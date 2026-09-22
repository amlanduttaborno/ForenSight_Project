import hashlib
import json
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from ..models import Analysis
from ..schemas import AnalysisResponse, ArtifactLinks, Region
from ..services.demo_inference import DemoInferenceEngine
from ..services.report import build_demo_report
from ..services.storage import create_analysis_dir, safe_artifact_path

router = APIRouter(prefix="/analyses", tags=["analyses"])
engine = DemoInferenceEngine()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
WARNING = (
    "This is a supervisor-demo visualization. The evidence score is not a trained authenticity probability. "
    "Final AutoSplice-aligned multimodal retraining is pending."
)


def artifact_links(analysis_id: str) -> ArtifactLinks:
    base = f"{settings.api_prefix}/analyses/{analysis_id}"
    return ArtifactLinks(
        original=f"{base}/artifacts/original.jpg",
        overlay=f"{base}/artifacts/overlay.jpg",
        mask=f"{base}/artifacts/mask.png",
        heatmap=f"{base}/artifacts/heatmap.png",
        report=f"{base}/report",
    )


def to_response(row: Analysis) -> AnalysisResponse:
    regions_path = Path(row.artifact_dir) / "regions.json"
    regions_data = json.loads(regions_path.read_text()) if regions_path.exists() else []
    return AnalysisResponse(
        id=row.id,
        filename=row.filename,
        verdict=row.verdict,
        preliminary_score=row.preliminary_score,
        manipulated_area_pct=row.manipulated_area_pct,
        region_count=row.region_count,
        width=row.width,
        height=row.height,
        caption=row.caption,
        caption_provided=bool(row.caption.strip()),
        multimodal_status=(
            "Text modality supplied to the application contract; final CLIP-fusion checkpoint not connected"
            if row.caption.strip()
            else "Image-only demo input; add a caption to demonstrate the multimodal application contract"
        ),
        model_status=row.model_status,
        warning=WARNING,
        regions=[Region(**r) for r in regions_data],
        artifacts=artifact_links(row.id),
        created_at=row.created_at,
    )


@router.post("", response_model=AnalysisResponse)
async def create_analysis(
    image: UploadFile = File(...),
    caption: str = Form(default=""),
    analysis_mode: str = Form(default="demo"),
    db: Session = Depends(get_db),
):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Only JPG, PNG and WEBP images are supported")

    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded image is empty")
    if len(data) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"Maximum upload size is {settings.max_upload_mb} MB")

    analysis_id, analysis_dir = create_analysis_dir()
    try:
        result = engine.analyze(data, analysis_dir)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not decode/process image: {exc}") from exc

    sha256 = hashlib.sha256(data).hexdigest()
    (analysis_dir / "regions.json").write_text(json.dumps(result.regions, indent=2))

    row = Analysis(
        id=analysis_id,
        filename=image.filename or "uploaded-image",
        sha256=sha256,
        caption=caption.strip(),
        analysis_mode=analysis_mode,
        verdict=result.verdict,
        preliminary_score=result.preliminary_score,
        manipulated_area_pct=result.manipulated_area_pct,
        region_count=len(result.regions),
        width=result.width,
        height=result.height,
        model_status=engine.model_status,
        artifact_dir=str(analysis_dir),
        created_at=datetime.utcnow(),
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    build_demo_report(analysis_dir / "report.pdf", analysis=row, regions=result.regions)
    return to_response(row)


@router.get("", response_model=list[AnalysisResponse])
def list_analyses(db: Session = Depends(get_db)):
    rows = db.scalars(select(Analysis).order_by(Analysis.created_at.desc()).limit(100)).all()
    return [to_response(row) for row in rows]


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    row = db.get(Analysis, analysis_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return to_response(row)


@router.get("/{analysis_id}/artifacts/{name}")
def get_artifact(analysis_id: str, name: str, db: Session = Depends(get_db)):
    row = db.get(Analysis, analysis_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    try:
        path = safe_artifact_path(Path(row.artifact_dir), name)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    if not path.exists():
        raise HTTPException(status_code=404, detail="Artifact not found")
    media_type = "image/png" if path.suffix == ".png" else "image/jpeg"
    return FileResponse(path, media_type=media_type)


@router.get("/{analysis_id}/report")
def get_report(analysis_id: str, db: Session = Depends(get_db)):
    row = db.get(Analysis, analysis_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    path = Path(row.artifact_dir) / "report.pdf"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(path, media_type="application/pdf", filename=f"forensight-{analysis_id}.pdf")
