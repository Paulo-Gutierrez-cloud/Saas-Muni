import redis
import json
import time
from .config import settings
from .db import SessionLocal, Licitacion
from .analyzer import calculate_score

def start_worker():
    r = redis.from_url(settings.REDIS_URL, decode_responses=True)
    pubsub = r.pubsub()
    pubsub.subscribe("licitaciones_events")
    
    print(">>> ANALYSIS AGENT WORKER STARTED - Listening for events...")
    
    for message in pubsub.listen():
        if message["type"] == "message":
            try:
                data = json.loads(message["data"])
                if data["type"] == "new_licitacion":
                    process_licitacion(data["codigo"], r)
            except Exception as e:
                print(f"Error processing message: {e}")

def process_licitacion(codigo, redis_conn):
    print(f"[{time.ctime()}] Analizando licitación: {codigo}")
    db = SessionLocal()
    try:
        lic = db.query(Licitacion).filter(Licitacion.codigo_externo == codigo).first()
        if not lic:
            print(f"   Error: Licitación {codigo} no encontrada en DB")
            return
        
        # Calcular Score y Análisis
        score, category, analysis = calculate_score(lic, settings.TI_KEYWORDS, settings.PREFERED_REGIONS)
        
        # Actualizar DB
        lic.score_probabilidad = score
        lic.categoria_ia = category
        lic.analisis_ia = json.dumps(analysis)
        db.commit()
        
        print(f"   Score final: {score}% | Categoría: {category}")
        
        # Notificar resultado vía Redis (para que el frontend se actualice solo con scored)
        result_event = {
            "type": "licitacion_scored",
            "codigo": codigo,
            "score": score,
            "nombre": lic.nombre,
            "timestamp": time.time()
        }
        redis_conn.publish("licitaciones_scored", json.dumps(result_event))
        
    finally:
        db.close()

if __name__ == "__main__":
    start_worker()
