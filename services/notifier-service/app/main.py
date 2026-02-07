import redis
import json
import time
from .config import settings
from .email_client import send_opportunity_email

def start_notifier():
    print(f"[{time.strftime('%H:%M:%S')}] Notifier Service iniciado. Esperando eventos...")
    r = redis.from_url(settings.REDIS_URL)
    pubsub = r.pubsub()
    pubsub.subscribe("licitacion_scored")

    for message in pubsub.listen():
        if message['type'] == 'message':
            try:
                data = json.loads(message['data'])
                score = data.get('score', 0)
                
                print(f"[{time.strftime('%H:%M:%S')}] Procesando scoring de {data.get('codigo')}: {score}%")
                
                if score >= settings.SCORE_THRESHOLD:
                    print(f"🔥 ¡Score alto detectado! Enviando email...")
                    success = send_opportunity_email(
                        tender_name=data.get('nombre', 'Sin nombre'),
                        tender_id=data.get('codigo', 'N/A'),
                        score=score,
                        region=data.get('region', 'No especificada')
                    )
                    if success:
                        print("✅ Email enviado correctamente.")
                    else:
                        print("❌ Error al enviar el email.")
                else:
                    print(f"ℹ️ Score {score}% por debajo del umbral ({settings.SCORE_THRESHOLD}%)")
                    
            except Exception as e:
                print(f"Error procesando mensaje: {e}")

if __name__ == "__main__":
    start_notifier()
