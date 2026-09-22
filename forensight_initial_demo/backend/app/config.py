from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ForenSight Initial Demo"
    api_prefix: str = "/api/v1"
    frontend_origin: str = "http://localhost:3000"
    database_url: str = "sqlite:///./forensight_demo.db"
    storage_dir: str = "./storage"
    max_upload_mb: int = 12
    demo_mode: bool = True
    model_checkpoint: str = "./checkpoints/best.pt"
    redis_url: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def storage_path(self) -> Path:
        return Path(self.storage_dir).resolve()


settings = Settings()
