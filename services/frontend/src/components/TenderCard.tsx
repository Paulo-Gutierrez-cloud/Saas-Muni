"use client";
import React from "react";
import { Tender } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExternalLink, MapPin, Database, Heart } from "lucide-react";

interface TenderCardProps {
  tender: Tender;
  onToggleFavorite?: (codigo: string, current: boolean) => void;
  onClick?: () => void;
}

export const TenderCard = ({ tender, onToggleFavorite, onClick }: TenderCardProps) => {
  const getScoreColor = (score: number | string | undefined | null) => {
    const s = Number(score);
    if (isNaN(s)) return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    if (s >= 70) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (s >= 40) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  };

  return (
    <div 
      onClick={onClick}
      className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group shadow-lg relative cursor-pointer flex flex-col h-full"
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(tender.codigo_externo, !!tender.is_favorite);
        }}
        className={cn(
          "absolute top-6 right-6 p-2 rounded-full border transition-all duration-200 z-10",
          tender.is_favorite 
            ? "bg-red-500/10 border-red-500/50 text-red-500" 
            : "bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300"
        )}
      >
        <Heart className={cn("size-4", tender.is_favorite && "fill-current")} />
      </button>

      <div className="flex justify-between items-start mb-4 pr-10">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {tender.nombre}
          </h3>
          <p className="text-xs text-blue-500 font-mono mt-1">{tender.codigo_externo}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1",
          getScoreColor(tender.score_probabilidad)
        )}>
          {Number(tender.score_probabilidad || 0)}% Match
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="size-4 text-gray-600" />
          <span className="truncate">{tender.comprador_region_unidad || "Región no especificada"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Database className="size-4 text-gray-600" />
          <span className="capitalize">{tender.categoria_ia || "Generica"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-gray-100">
            {typeof tender.monto_estimado === 'number' && !isNaN(tender.monto_estimado)
              ? `$${tender.monto_estimado.toLocaleString("es-CL")}` 
              : tender.monto_estimado || "Monto no disp."}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`http://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?idLicitacion=${tender.codigo_externo}`, "_blank");
            }}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-400 font-medium transition-colors uppercase tracking-widest"
          >
            Ficha Oficial <ExternalLink className="size-3" />
          </button>
        </div>
        
        <button 
          className="w-full py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          Ver Análisis de Agente
        </button>
      </div>
    </div>
  );
};
