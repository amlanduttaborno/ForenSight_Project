from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.analysis import router as analysis_router
from .api.research import router as research_router
from .config import settings
from .db import Base, engine

Base.metadata.create_all(bind=engine)
settings.storage_path.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0-demo",
    description="Initial ForenSight supervisor demo. Final multimodal checkpoint not connected.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "mode": "DEMO / PRELIMINARY",
        "docs": "/docs",
    }


@app.get(f"{settings.api_prefix}/health")
def health():
    return {
        "status": "ok",
        "demo_mode": settings.demo_mode,
        "model_status": "final multimodal checkpoint not connected",
    }


app.include_router(analysis_router, prefix=settings.api_prefix)
app.include_router(research_router, prefix=settings.api_prefix)
