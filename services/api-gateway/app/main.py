import asyncio
import json
import redis.asyncio as redis
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
from .db import Licitacion, Favorito, AlertHistory, get_db
from .config import settings

app = FastAPI(title=settings.API_TITLE, version=settings.API_VERSION)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection for WebSockets
redis_conn = redis.from_url(settings.REDIS_URL, decode_responses=True)

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    # Start Redis listener in background
    asyncio.create_task(redis_listener())

async def redis_listener():
    pubsub = redis_conn.pubsub()
    await pubsub.subscribe("licitaciones_events")
    print(">>> WebSocket Redis Listener Active")
    async for message in pubsub.listen():
        if message["type"] == "message":
            await manager.broadcast(message["data"])

@app.get("/")
def read_root():
    return {"status": "online", "message": "Mercado Público TI API Gateway"}

@app.get("/licitaciones")
def get_licitaciones(
    db: Session = Depends(get_db),
    region: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    q: Optional[str] = Query(None),
    limit: int = 50,
    offset: int = 0
):
    query = db.query(Licitacion)
    
    if region:
        query = query.filter(Licitacion.comprador_region_unidad.ilike(f"%{region}%"))
    
    if categoria:
        query = query.filter(Licitacion.categoria_ia == categoria)
        
    if min_score is not None:
        query = query.filter(Licitacion.score_probabilidad >= min_score)
    
    if q:
        query = query.filter(
            (Licitacion.nombre.ilike(f"%{q}%")) | 
            (Licitacion.descripcion.ilike(f"%{q}%"))
        )
    
    total = query.count()
    items = query.order_by(Licitacion.score_probabilidad.desc(), Licitacion.fecha_cierre.asc()).offset(offset).limit(limit).all()
    
    return {
        "total": total,
        "items": items
    }

@app.get("/licitaciones/{codigo}")
def get_licitacion_detail(codigo: str, db: Session = Depends(get_db)):
    item = db.query(Licitacion).filter(Licitacion.codigo_externo == codigo).first()
    if not item:
        return {"error": "Licitación no encontrada"}, 404
    return item

@app.get("/favoritos")
def get_favoritos(db: Session = Depends(get_db)):
    # Join with Licitaciones to get full details
    favs = db.query(Licitacion).join(
        Favorito, Licitacion.codigo_externo == Favorito.licitacion_codigo
    ).all()
    return favs

@app.post("/favoritos/{codigo}")
def add_favorito(codigo: str, db: Session = Depends(get_db)):
    existing = db.query(Favorito).filter(Favorito.licitacion_codigo == codigo).first()
    if existing:
        return {"message": "Ya es favorito"}
    
    nuevo_fav = Favorito(licitacion_codigo=codigo)
    db.add(nuevo_fav)
    db.commit()
    return {"status": "success", "message": "Añadido a favoritos"}

@app.delete("/favoritos/{codigo}")
def remove_favorito(codigo: str, db: Session = Depends(get_db)):
    fav = db.query(Favorito).filter(Favorito.licitacion_codigo == codigo).first()
    if not fav:
        return {"error": "No es favorito"}, 404
    
    db.delete(fav)
    db.commit()
    return {"status": "success", "message": "Eliminado de favoritos"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_licitaciones = db.query(Licitacion).count()
    ti_opportunities = db.query(Licitacion).filter(Licitacion.score_probabilidad > 50).count()
    avg_score = db.query(Licitacion).filter(Licitacion.score_probabilidad > 0).with_entities(Licitacion.score_probabilidad).all()
    
    avg_score_val = sum([s[0] for s in avg_score]) / len(avg_score) if avg_score else 0
    
    # Get top regions
    from sqlalchemy import func
    top_regions = db.query(
        Licitacion.comprador_region_unidad, 
        func.count(Licitacion.codigo_externo)
    ).filter(Licitacion.score_probabilidad > 50).group_by(Licitacion.comprador_region_unidad).order_by(func.count(Licitacion.codigo_externo).desc()).limit(5).all()

    # Get high impact tenders (Score > 90)
    high_impact = db.query(Licitacion).filter(Licitacion.score_probabilidad >= 90).order_by(Licitacion.score_probabilidad.desc()).limit(3).all()

    return {
        "total": total_licitaciones,
        "ti_matches": ti_opportunities,
        "average_score": round(avg_score_val, 1),
        "top_regions": [{"name": r[0], "count": r[1]} for r in top_regions],
        "high_impact": [
            {
                "codigo": l.codigo_externo,
                "nombre": l.nombre,
                "score": l.score_probabilidad,
                "region": l.comprador_region_unidad
            } for l in high_impact
        ]
    }

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    # Simulación de datos para Regresión Lineal y Tendencias
    # En producción esto consultaría licitacion_eventos o datos históricos
    from datetime import datetime, timedelta
    import random
    
    dates = [(datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(15, -1, -1)]
    
    # Tendencia de Licitaciones TI (Regresión Lineal Simbolizada)
    trends = []
    base_val = 50
    for i, date in enumerate(dates):
        change = random.randint(-10, 15)
        base_val += change
        trends.append({"date": date, "count": max(10, base_val), "predicted": base_val + 5})
    
    # Probabilidad de Adjudicación por Rango de Score
    probabilities = [
        {"range": "0-40", "success_rate": 5, "opportunities": 1200},
        {"range": "40-70", "success_rate": 15, "opportunities": 850},
        {"range": "70-90", "success_rate": 45, "opportunities": 300},
        {"range": "90-100", "success_rate": 78, "opportunities": 120},
    ]
    
    # Segmentación por Categoría IA
    categories = db.query(
        Licitacion.categoria_ia, 
        func.count(Licitacion.codigo_externo)
    ).filter(Licitacion.categoria_ia != None).group_by(Licitacion.categoria_ia).all()

    return {
        "trends": trends,
        "probabilities": probabilities,
        "segmentation": [{"name": c[0], "value": c[1]} for c in categories]
    }

@app.post("/chat")
async def chat_with_openclaw(request: dict):
    # Puente hacia el contenedor de OpenClaw usando el endpoint estándar de OpenAI
    import httpx
    
    user_message = request.get("message")
    messages = request.get("messages")
    
    # Endpoint compatible con OpenAI expuesto por OpenClaw
    openclaw_url = "http://openclaw:18789/v1/chat/completions"
    
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            headers = {
                "Authorization": "Bearer testtoken123",
                "Content-Type": "application/json"
            }
            
            # Construct payload
            payload = {
                "model": "openai/llama3.1"
            }
            
            # System Prompt injection
            system_prompt = {
                "role": "system", 
                "content": """You are OpenClaw, an expert strategic analyst for public tenders in Chile (Mercado Público). 
                
CONTEXT:
- You have access to a PostgreSQL database with a table 'licitaciones' (columns: codigo_externo, nombre, descripcion, fecha_cierre, score_probabilidad, comprador_region_unidad).
- You can use the 'Database' tool to query this data. 

RULES:
1. Always interpret "numbers" or "results" as TENDERS/LICITACIONES, never as lottery or gambling.
2. If asked for "last 5", fetch the 5 most recent tenders from the DB.
3. For simple questions (e.g., "2+2"), answer directly without tools.
4. For complex questions, USE YOUR TOOLS."""
            }

            if messages:
                # Prepend system prompt if not present
                if not messages or messages[0].get("role") != "system":
                    payload["messages"] = [system_prompt] + messages
                else:
                    payload["messages"] = messages
            elif user_message:
                 payload["messages"] = [system_prompt, {"role": "user", "content": user_message}]
            else:
                return {"response": "Error: Debe incluir 'message' o 'messages' en la petición."}
            
            response = await client.post(openclaw_url, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                # Extraer contenido de la respuesta estilo OpenAI
                content = data.get("choices", [])[0].get("message", {}).get("content", "")
                return {"response": content or "El analista no generó respuesta."}
            else:
                return {"response": f"Error del Analista ({response.status_code}): {response.text}"}
                
    except Exception as e:
        return {"response": f"Error de conexión con OpenClaw: {str(e)}"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
