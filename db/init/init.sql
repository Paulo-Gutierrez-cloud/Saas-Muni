-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla principal de Licitaciones (97 campos mapeados del PDF)
CREATE TABLE IF NOT EXISTS licitaciones (
    -- Datos de Identificación
    codigo_externo VARCHAR(100) PRIMARY KEY, -- Campo 4
    nombre VARCHAR(255),                     -- Campo 5
    descripcion TEXT,                        -- Campo 8
    codigo_estado INTEGER,                   -- Campo 6
    estado VARCHAR(510),                    -- Campo 9
    codigo_tipo INTEGER,                    -- Campo 24
    tipo VARCHAR(20),                       -- Campo 25
    
    -- Fechas y Plazos
    fecha_creacion TIMESTAMP,               -- Campo 2 (consulta)
    fecha_cierre TIMESTAMP,                  -- Campo 7
    fecha_creacion_licitacion TIMESTAMP,     -- Campo 36
    fecha_cierre_licitacion TIMESTAMP,       -- Campo 37
    fecha_inicio TIMESTAMP,                  -- Campo 38
    fecha_final TIMESTAMP,                   -- Campo 39
    fecha_pub_respuestas TIMESTAMP,          -- Campo 40
    fecha_acto_apertura_tecnica TIMESTAMP,   -- Campo 41
    fecha_acto_apertura_economica TIMESTAMP, -- Campo 42
    fecha_publicacion TIMESTAMP,             -- Campo 43
    fecha_adjudicacion TIMESTAMP,            -- Campo 44
    fecha_estimada_adjudicacion TIMESTAMP,   -- Campo 45
    fecha_soporte_fisico TIMESTAMP,          -- Campo 46
    fecha_tiempo_evaluacion TIMESTAMP,       -- Campo 47
    fecha_estimada_firma TIMESTAMP,          -- Campo 48
    fecha_visita_terreno TIMESTAMP,          -- Campo 50
    fecha_entrega_antecedentes TIMESTAMP,    -- Campo 51
    dias_cierre_licitacion INTEGER,          -- Campo 22

    -- Comprador
    comprador_codigo_organismo VARCHAR(100), -- Campo 10
    comprador_nombre_organismo VARCHAR(510), -- Campo 11
    comprador_rut_unidad VARCHAR(100),       -- Campo 12
    comprador_codigo_unidad VARCHAR(100),    -- Campo 13
    comprador_nombre_unidad VARCHAR(510),    -- Campo 14
    comprador_direccion_unidad VARCHAR(510), -- Campo 15
    comprador_comuna_unidad VARCHAR(510),    -- Campo 16
    comprador_region_unidad VARCHAR(510),    -- Campo 17
    comprador_rut_usuario VARCHAR(100),      -- Campo 18
    comprador_codigo_usuario VARCHAR(100),   -- Campo 19
    comprador_nombre_usuario TEXT,           -- Campo 20
    comprador_cargo_usuario VARCHAR(100),    -- Campo 21

    -- Financiero / Pagos
    moneda VARCHAR(100),                     -- Campo 27
    monto_estimado FLOAT,                   -- Campo 58
    visibilidad_monto BIT(1),               -- Campo 57
    estimacion INTEGER,                     -- Campo 55
    fuente_financiamiento INTEGER,          -- Campo 56
    modalidad INTEGER,                      -- Campo 60
    tipo_pago INTEGER,                      -- Campo 61
    prohibicion_contratacion VARCHAR(510),  -- Campo 67
    subcontratacion BIT(1),                 -- Campo 68
    
    -- Contrato y Duración
    contrato INTEGER,                        -- Campo 33
    unidad_tiempo_duracion_contrato INTEGER, -- Campo 69
    tiempo_duracion_contrato INTEGER,        -- Campo 70
    tipo_duracion_contrato VARCHAR(510),     -- Campo 71
    extension_plazo SMALLINT,                -- Campo 73
    es_renovable BIT(1),                    -- Campo 78
    valor_tiempo_renovacion INTEGER,        -- Campo 76
    periodo_tiempo_renovacion VARCHAR(510), -- Campo 77

    -- Reclamaciones y Otras Marcas
    cantidad_reclamos INTEGER,               -- Campo 35
    informada BIT(1),                       -- Campo 23
    es_base_tipo BIT(1),                    -- Campo 74
    obras INTEGER,                           -- Campo 34
    
    -- Adjudicación (si aplica)
    adjudicacion_tipo INTEGER,              -- Campo 79
    adjudicacion_fecha TIMESTAMP,            -- Campo 80
    adjudicacion_numero VARCHAR(100),        -- Campo 81
    adjudicacion_numero_oferentes INTEGER,   -- Campo 82
    adjudicacion_url_acta TEXT,              -- Campo 83

    -- Metadata del Sistema
    score_probabilidad FLOAT DEFAULT 0.0,
    categoria_ia VARCHAR(100),
    analisis_ia TEXT, -- JSON con resumen, stack, requisitos y estrategia
    sync_status VARCHAR(20) DEFAULT 'basic', -- 'basic' o 'full'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Items de la Licitación (Campos 84-97)
CREATE TABLE IF NOT EXISTS licitacion_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_externo_licitacion VARCHAR(100) REFERENCES licitaciones(codigo_externo) ON DELETE CASCADE,
    correlativo INTEGER,                    -- Campo 86
    codigo_producto INTEGER,                -- Campo 87 (UNSPSC)
    codigo_categoria VARCHAR(100),          -- Campo 88 (UNSPSC Categoria)
    categoria VARCHAR(400),                 -- Campo 89
    nombre_producto VARCHAR(510),           -- Campo 90
    descripcion_producto VARCHAR(510),      -- Campo 91
    unidad_medida VARCHAR(510),             -- Campo 92
    cantidad FLOAT,                         -- Campo 93
    
    -- Datos de Adjudicación por Item
    adjudicacion_rut_proveedor VARCHAR(100),    -- Campo 94
    adjudicacion_nombre_proveedor VARCHAR(500), -- Campo 95
    adjudicacion_cantidad_adjudicada VARCHAR(500), -- Campo 96
    adjudicacion_monto_unitario FLOAT,          -- Campo 97
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexación para búsquedas rápidas
CREATE INDEX idx_licitaciones_estado ON licitaciones(estado);
CREATE INDEX idx_licitaciones_region ON licitaciones(comprador_region_unidad);
CREATE INDEX idx_items_unspc ON licitacion_items(codigo_producto);

-- Tabla de Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id SERIAL PRIMARY KEY,
    licitacion_codigo VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_favoritos_codigo ON favoritos(licitacion_codigo);

-- Tabla de Historial de Alertas
CREATE TABLE IF NOT EXISTS alert_history (
    id SERIAL PRIMARY KEY,
    licitacion_codigo VARCHAR(100),
    nombre_licitacion VARCHAR(510),
    score FLOAT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
