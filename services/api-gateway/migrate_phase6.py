from sqlalchemy import create_engine, text
from app.config import settings

engine = create_engine(settings.DATABASE_URL)

def create_extra_tables():
    with engine.connect() as conn:
        print(">>> Creando tablas adicionales (favoritos, alert_history)...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS favoritos (
                id SERIAL PRIMARY KEY,
                licitacion_codigo VARCHAR(100) UNIQUE,
                notas TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS alert_history (
                id SERIAL PRIMARY KEY,
                licitacion_codigo VARCHAR(100),
                nombre_licitacion VARCHAR(510),
                score FLOAT,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))
        conn.commit()
        print(">>> Tablas creadas exitosamente.")

if __name__ == "__main__":
    create_extra_tables()
