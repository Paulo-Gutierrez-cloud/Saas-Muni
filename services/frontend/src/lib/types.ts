export interface Tender {
  codigo_externo: string;
  nombre: string;
  descripcion?: string;
  comprador_region_unidad?: string;
  monto_estimado?: number;
  estado?: string;
  codigo_estado?: number;
  score_probabilidad: number;
  categoria_ia?: string;
  analisis_ia?: string; // Guardado como JSON string en DB
  is_favorite?: boolean;
  updated_at?: string;
}

export interface WebSocketEvent {
  type: string;
  codigo?: string;
  score?: number;
  nombre?: string;
  timestamp?: number;
}
