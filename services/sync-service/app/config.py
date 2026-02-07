import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MP_TICKET: str = "F8537A18-6766-4DEF-9E59-426B4FEE2844"
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/licitaciones_ti"
    REDIS_URL: str = "redis://redis:6379/0"
    SYNC_INTERVAL_MINUTES: int = 5
    KEYWORDS_TI: str = "desarrollo web,software,aplicacion movil,apps,ti,informatica"

    class Config:
        env_file = ".env"

settings = Settings()
