from fastapi import APIRouter

from ..schemas import ResearchStatus

router = APIRouter(prefix="/research", tags=["research"])


@router.get("/status", response_model=ResearchStatus)
def research_status():
    return ResearchStatus(
        project="ForenSight — Explainable Multimodal Image Forensics",
        current_stage="Initial full-stack supervisor demo + AutoSplice-specific alignment correction",
        completed=[
            "AutoSplice acquisition and extraction workflow",
            "Caption JSON parsing pipeline",
            "RGB + forensic + CLIP + segmentation architecture implemented",
            "GPU training/evaluation pipeline exercised",
            "Checkpoint/export workflow implemented",
            "Initial frontend/backend application workflow implemented",
        ],
        pending=[
            "Correct AutoSplice source-ID image/mask/caption manifest mapping",
            "Retrain with true aligned text modality",
            "Validate held-out classification and localization metrics",
            "Re-test production single-image inference",
            "Replace demo engine with validated multimodal checkpoint",
        ],
        demo_message=(
            "Tomorrow's app demonstrates the production workflow without presenting the preliminary heuristic "
            "as a validated AI authenticity model."
        ),
    )
