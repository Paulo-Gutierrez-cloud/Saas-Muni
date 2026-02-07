"use client";
import React from "react";
import { Tender } from "@/lib/types";
import { X, Cpu, ClipboardCheck, Lightbulb, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisDrawerProps {
  tender: Tender | null;
  onClose: () => void;
}

export const AnalysisDrawer = ({ tender, onClose }: AnalysisDrawerProps) => {
  if (!tender) return null;

  let analysis = {
    resumen: "Sin análisis disponible.",
    stack: [],
    requisitos: [],
    estrategia: "No se ha generado estrategia aún."
  };

  if (tender.analisis_ia) {
    try {
      analysis = typeof tender.analisis_ia === 'string' 
        ? JSON.parse(tender.analisis_ia) 
        : tender.analisis_ia;
    } catch (e) {
      console.error("Error parsing analysis", e);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-950 border-l border-gray-800 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{tender.nombre}</h2>
              <p className="text-blue-500 font-mono text-sm">{tender.codigo_externo}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Match</p>
                <p className="text-2xl font-bold text-green-400">{tender.score_probabilidad}%</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Categoría</p>
                <p className="text-lg font-bold text-blue-400">{tender.categoria_ia || 'Analizando...'}</p>
              </div>
            </div>

            {/* Resumen */}
            <section>
              <div className="flex items-center gap-2 mb-3 text-white">
                <Zap className="size-5 text-yellow-500" />
                <h3 className="font-bold">Resumen de Oportunidad</h3>
              </div>
              <p className="text-gray-400 leading-relaxed bg-gray-900/30 p-4 rounded-xl border border-gray-800/50">
                {analysis.resumen}
              </p>
            </section>

            {/* Tech Stack */}
            <section>
              <div className="flex items-center gap-2 mb-3 text-white">
                <Cpu className="size-5 text-blue-500" />
                <h3 className="font-bold">Stack Tecnológico</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.stack.map((item: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                    {item}
                  </span>
                ))}
                {analysis.stack.length === 0 && <span className="text-gray-500 text-sm">No detectado.</span>}
              </div>
            </section>

            {/* Requisitos */}
            <section>
              <div className="flex items-center gap-2 mb-3 text-white">
                <ClipboardCheck className="size-5 text-green-500" />
                <h3 className="font-bold">Requisitos Clave</h3>
              </div>
              <ul className="space-y-2">
                {analysis.requisitos.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <div className="size-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {/* Impactful Proposal Strategy */}
            <section className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Target className="size-16 text-blue-500" />
              </div>
              
              <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Lightbulb className="size-4" /> Propuesta de Alto Impacto
              </h4>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-950/50 rounded-2xl border border-blue-500/20">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Diferenciador Ganador</p>
                    <p className="text-gray-200 text-sm leading-relaxed italic font-medium">
                        &quot;{analysis.estrategia}&quot;
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-950/50 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-tighter">Nuestra Fortaleza</p>
                    <p className="text-xs text-green-400 font-bold">Arquitectura Microservicios</p>
                  </div>
                  <div className="p-3 bg-gray-950/50 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-tighter">Punto Crítico</p>
                    <p className="text-xs text-yellow-500 font-bold">Tiempo de Entrega</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40">
                  <Zap className="size-4" /> Generar Pitch Estratégico
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-blue-500/10 pt-4">
                <div className="flex gap-2">
                    <span className="text-[9px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 uppercase">Viabilidad: Alta</span>
                    <span className="text-[9px] font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700 uppercase">Riesgo: 12%</span>
                </div>
                <p className="text-[10px] text-blue-500 font-black">WIN PROB: 88%</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
