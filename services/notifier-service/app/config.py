from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDIS_URL: str = "redis://redis:6379/0"
    
    # SMTP Config (Defaults for Mailtrap local testing)
    SMTP_HOST: str = "sandbox.smtp.mailtrap.io"
    SMTP_PORT: int = 2525
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "alertas@licitaciones-ti.cl"
    
    # Notification settings
    SCORE_THRESHOLD: int = 80
    NOTIFY_EMAIL: str = "usuario@ejemplo.com" # Email destino por defecto

    class Config:
        env_file = ".env"

settings = Settings()
