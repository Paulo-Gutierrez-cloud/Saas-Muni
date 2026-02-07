"use client";
import React from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    region: string;
    categoria: string;
    minScore: number;
  };
  onApply: (filters: { region: string; categoria: string; minScore: number }) => void;
}

const REGIONES = [
  "Región Metropolitana de Santiago",
  "Región de Valparaíso",
  "Región del Biobío",
  "Región de Antofagasta",
  "Región de Coquimbo",
  "Región de los Lagos",
  "Región de la Araucanía",
  "Región de O'Higgins",
  "Región de los Ríos",
  "Región de Tarapacá",
  "Región de Atacama",
  "Región de Maule",
  "Región de Ñuble",
  "Región de Arica y Parinacota",
  "Región de Aysén del G. Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena"
];

const CATEGORIAS = [
  "Software",
  "Hardware",
  "Infraestructura",
  "Cloud",
  "Ciberseguridad",
  "Consultoría",
  "Soporte",
  "Otros"
];

export const FilterDrawer = ({ isOpen, onClose, filters, onApply }: FilterDrawerProps) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  React.useEffect(() => {
    if (isOpen) setLocalFilters(filters);
  }, [isOpen, filters]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-out p-8 flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Filtros Avanzados</h2>
            <p className="text-sm text-gray-500 mt-1">Refina tu búsqueda estratégica</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {/* Región */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Región</label>
            <select 
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              value={localFilters.region}
              onChange={(e) => setLocalFilters({ ...localFilters, region: e.target.value })}
            >
              <option value="">Todas las regiones</option>
              {REGIONES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Categoría TI</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setLocalFilters({ ...localFilters, categoria: localFilters.categoria === cat ? "" : cat })}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-between",
                    localFilters.categoria === cat 
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-400" 
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                  )}
                >
                  {cat}
                  {localFilters.categoria === cat && <Check className="size-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Score Mínimo */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Match IA Mínimo</label>
              <span className="text-blue-400 font-bold text-lg">{localFilters.minScore}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              value={localFilters.minScore}
              onChange={(e) => setLocalFilters({ ...localFilters, minScore: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-medium">
              <span>EXPLORATORIO (0%)</span>
              <span>ESTRATÉGICO (100%)</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex gap-4">
          <button 
            onClick={() => setLocalFilters({ region: "", categoria: "", minScore: 0 })}
            className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-200 transition-colors"
          >
            Limpiar
          </button>
          <button 
            onClick={handleApply}
            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </>
  );
};
