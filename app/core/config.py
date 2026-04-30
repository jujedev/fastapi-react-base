from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # ─── App ─────────────────────────────────────────────────────────────────
    APP_NAME: str = "Mi App"
    DEBUG: bool = True

    # ─── Base de datos ────────────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/mi_app"

    # ─── JWT ─────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60       # 1 hora
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7          # 7 días

    class Config:
        env_file = str(BASE_DIR / ".env")


@lru_cache()
def get_settings() -> Settings:
    return Settings()