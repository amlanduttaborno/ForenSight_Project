from datetime import datetime
from pydantic import BaseModel, Field


class Region(BaseModel):
    index: int
    x: int
    y: int
    width: int
    height: int
    area_pct: float
    mean_evidence: float


class ArtifactLinks(BaseModel):
    original: str
    overlay: str
    mask: str
    heatmap: str
    report: str


class AnalysisResponse(BaseModel):
    id: str
    filename: str
    verdict: str
    preliminary_score: float = Field(ge=0, le=1)
    manipulated_area_pct: float
    region_count: int
    width: int
    height: int
    caption: str
    caption_provided: bool
    multimodal_status: str
    model_status: str
    warning: str
    regions: list[Region]
    artifacts: ArtifactLinks
    created_at: datetime


class ResearchStatus(BaseModel):
    project: str
    current_stage: str
    completed: list[str]
    pending: list[str]
    demo_message: str
