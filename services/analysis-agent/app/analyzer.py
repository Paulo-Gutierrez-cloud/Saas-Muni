def calculate_score(licitacion, keywords, regions):
    score = 0
    text_to_analyze = f"{licitacion.nombre} {licitacion.descripcion or ''}".lower()
    
    # 1. Match de Rubro TI (50 pts)
    matches = [word for word in keywords if word in text_to_analyze]
    if matches:
        score += 50
    
    # 2. Match de Región (20 pts)
    region = licitacion.comprador_region_unidad or ""
    if any(r.lower() in region.lower() for r in regions):
        score += 20
    
    # 3. Match de Monto (20 pts)
    if licitacion.monto_estimado and licitacion.monto_estimado > 5000000:
        score += 20
    
    # 4. Estado de la licitación (10 pts)
    if licitacion.estado == "Publicada":
        score += 10
        
    analysis = {
        "resumen": f"Esta licitación para '{licitacion.nombre}' parece alineada con servicios TI." if matches else "Licitación con bajo match técnico inicial.",
        "stack": ["Desarrollo Software", "Cloud"] if "software" in text_to_analyze else ["Hardware", "Infraestructura"],
        "requisitos": ["Garantía de seriedad", "Experiencia previa"],
        "estrategia": "Se recomienda revisar las bases administrativas para confirmar plazos de entrega."
    }
        
    return min(score, 100), matches[0] if matches else "Otros", analysis
