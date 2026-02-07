from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/licitaciones_ti"
    REDIS_URL: str = "redis://redis:6379/0"
    API_TITLE: str = "Mercado Público TI API"
    API_VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"

settings = Settings()
