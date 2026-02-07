from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, Float, SmallInteger, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Licitacion(Base):
    __tablename__ = "licitaciones"

    codigo_externo = Column(String(100), primary_key=True)
    nombre = Column(String(255))
    descripcion = Column(Text)
    codigo_estado = Column(Integer)
    estado = Column(String(510))
    codigo_tipo = Column(Integer)
    tipo = Column(String(20))
    
    fecha_creacion = Column(DateTime)
    fecha_cierre = Column(DateTime)
    fecha_publicacion = Column(DateTime)
    
    moneda = Column(String(100))
    monto_estimado = Column(Float)
    
    comprador_nombre_organismo = Column(String(510))
    comprador_region_unidad = Column(String(510))
    
    sync_status = Column(String(20), default="basic")
    score_probabilidad = Column(Float, default=0.0)

# Nota: Omitimos algunos campos para el MVP pero el init.sql los tiene todos.
# SQLAlchemy mapeará lo que detecte, pero el init.sql ya creó el esquema completo.
