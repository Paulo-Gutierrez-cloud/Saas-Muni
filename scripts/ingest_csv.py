import csv
import os
import sys
import psycopg2
from datetime import datetime

# Configuration
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "licitaciones_ti")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASS = os.environ.get("DB_PASS", "postgres")

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

def parse_date(date_str):
    # Format: 06-01-2026 15:00:00 or 06/01/2026 depending on locale
    # Trying common formats
    formats = ["%d-%m-%Y %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%Y-%m-%d %H:%M:%S"]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def ingest_csv(file_path):
    print(f"Ingesting {file_path}...")
    conn = get_db_connection()
    cur = conn.cursor()
    
    count = 0
    with open(file_path, mode='r', encoding='latin-1') as csvfile: # latin-1 common for legacy
        reader = csv.DictReader(csvfile, delimiter=';')
        
        for row in reader:
            # Mapping CSV columns to DB columns
            codigo_externo = row.get("CodigoCotizacion")
            nombre = row.get("NombreCotizacion")
            descripcion = row.get("Descripcion")
            estado_code = row.get("CodigoEstado") # Map to integer if possible
            estado_str = "Publicada" # Defaulting for now, need map based on code
            
            # Simple Rubro/Category detection for 'categoria_ti'
            rubro = "Otros"
            keywords_ti = ["software", "licencia", "computador", "servidor", "toner", "impresora", "disco duro", "redes", "cableado", "ups", "informatica", "tecnologia"]
            
            text_to_search = (str(nombre) + " " + str(descripcion)).lower()
            if any(k in text_to_search for k in keywords_ti):
                rubro = "TI"

            comprador_region = row.get("RegionUnidaddeCompra", "Desconocida")
            fecha_cierre_str = row.get("FechaCierre")
            fecha_cierre = parse_date(fecha_cierre_str) if fecha_cierre_str else None
            
            # Insert
            try:
                cur.execute("""
                    INSERT INTO licitaciones (
                        codigo_externo, nombre, descripcion, estado, 
                        comprador_region_unidad, categoria_ia, fecha_cierre, fecha_publicacion
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (codigo_externo) DO NOTHING;
                """, (codigo_externo, nombre, descripcion, estado_str, comprador_region, rubro, fecha_cierre))
                count += 1
                if count % 100 == 0:
                    conn.commit()
                    print(f"Processed {count} rows...", end='\r')
            except Exception as e:
                conn.rollback()
                print(f"Error inserting row {codigo_externo}: {e}")
                continue

    conn.commit()
    conn.close()
    print(f"\nSuccessfully ingested {count} rows from {file_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ingest_csv.py <path_to_csv>")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    ingest_csv(csv_file)
