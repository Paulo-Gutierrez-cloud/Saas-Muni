import redis
import json

r = redis.from_url("redis://redis:6379/0")

test_event = {
    "codigo": "2024-TEST-SMTP",
    "nombre": "DESARROLLO DE SOFTWARE GUBERNAMENTAL CRITICO",
    "score": 92,
    "region": "Región Metropolitana"
}

print(f"Enviando evento de prueba a Redis...")
r.publish("licitacion_scored", json.dumps(test_event))
print("Evento enviado.")
