import time
import requests
import redis
import json
from datetime import datetime
from .config import settings
from .db import SessionLocal, Licitacion

# Conexión a Redis para Pub/Sub y eventos en tiempo real
redis_client = redis.from_url(settings.REDIS_URL)

def fetch_active_licitaciones():
    """Obtiene la lista de licitaciones activas del día."""
    url = f"https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?estado=activas&ticket={settings.MP_TICKET}"
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            data = response.json()
            return data.get("Listado", [])
    except Exception as e:
        print(f"Error fetching list: {e}")
    return []

def fetch_licitacion_detail(codigo):
    """Obtiene el detalle completo de una licitación (97 campos)."""
    url = f"https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo={codigo}&ticket={settings.MP_TICKET}"
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            data = response.json()
            listado = data.get("Listado", [])
            return listado[0] if listado else None
    except Exception as e:
        print(f"Error fetching detail {codigo}: {e}")
    return None

def sync():
    print(f"[{datetime.now()}] Iniciando ciclo de sincronización...")
    db = SessionLocal()
    
    # 1. Obtener lista básica
    items = fetch_active_licitaciones()
    if not items:
        print("No se encontraron licitaciones activas. Probando con fecha histórica (02022014) para validación...")
        url_hist = f"https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?fecha=02022014&ticket={settings.MP_TICKET}"
        try:
            r = requests.get(url_hist, timeout=30)
            if r.status_code == 200:
                items = r.json().get("Listado", [])
        except:
            pass

    print(f"Procesando {len(items)} licitaciones para validación.")
    
    new_codes = []
    
    for item in items:
        codigo = item.get("CodigoExterno")
        # Verificar si ya existe
        existing = db.query(Licitacion).filter(Licitacion.codigo_externo == codigo).first()
        
        if not existing:
            # Crear registro básico
            new_lic = Licitacion(
                codigo_externo=codigo,
                nombre=item.get("Nombre"),
                codigo_estado=item.get("CodigoEstado"),
                fecha_cierre=datetime.fromisoformat(item.get("FechaCierre").replace('Z', '')) if item.get("FechaCierre") else None,
                sync_status="basic"
            )
            db.add(new_lic)
            db.commit()
            new_codes.append(codigo)
            print(f"Nueva licitación detectada: {codigo}")
            
    # 2. Enriquecer las nuevas con el detalle completo (97 campos)
    # Por ahora procesamos las nuevas encontradas en este ciclo
    for codigo in new_codes:
        detail = fetch_licitacion_detail(codigo)
        if detail:
            lic = db.query(Licitacion).filter(Licitacion.codigo_externo == codigo).first()
            # Mapear algunos campos clave para el MVP del sync
            lic.descripcion = detail.get("Descripcion")
            lic.estado = detail.get("Estado")
            lic.moneda = detail.get("Moneda")
            # Adjudicación, items, etc se manejarán en la siguiente fase
            lic.sync_status = "full"
            db.commit()
            
            # 3. Notificar vía Redis para tiempo real
            event = {
                "type": "new_licitacion",
                "codigo": codigo,
                "nombre": lic.nombre,
                "timestamp": datetime.now().isoformat()
            }
            redis_client.publish("licitaciones_events", json.dumps(event))
            print(f"Detalle enriquecido y evento publicado para {codigo}")

    db.close()
    print(f"[{datetime.now()}] Sincronización finalizada.")

def main():
    while True:
        try:
            sync()
        except Exception as e:
            print(f"Critical error in sync loop: {e}")
        
        time.sleep(settings.SYNC_INTERVAL_MINUTES * 60)

if __name__ == "__main__":
    print(">>> SYNC SERVICE STARTED")
    main()
