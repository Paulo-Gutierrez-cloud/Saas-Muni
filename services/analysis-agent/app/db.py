from sqlalchemy import create_engine, Column, String, Integer, DateTime, Text, Float
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
    comprador_region_unidad = Column(String(510))
    monto_estimado = Column(Float)
    estado = Column(String(510))
    score_probabilidad = Column(Float, default=0.0)
    categoria_ia = Column(String(100))
    analisis_ia = Column(Text, nullable=True)
