from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/licitaciones_ti"
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Perfil del usuario para scoring (Simulado para MVP)
    TI_KEYWORDS: list = [
        "software", "desarrollo", "web", "app", "aplicacion", "sistema", "plataforma",
        "it", "tecnologia", "informacion", "computacion", "programacion", "nube", 
        "cloud", "hosting", "servidor", "ciberseguridad", "inteligencia artificial", 
        "datos", "bi", "crm", "erp", "soporte tecnico", "redes"
    ]
    PREFERED_REGIONS: list = ["Metropolitana de Santiago", "Valparaíso"]

    class Config:
        env_file = ".env"

settings = Settings()
