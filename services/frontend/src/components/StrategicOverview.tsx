"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, Award, MapPin, BarChart3, ChevronRight } from "lucide-react";

interface Stats {
  total: number;
  ti_matches: number;
  average_score: number;
  top_regions: { name: string; count: number }[];
  high_impact: { codigo: string; nombre: string; score: number; region: string }[];
}

export const StrategicOverview = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Daily Habits Checklist
  const dailyTasks = [
    { id: 1, title: "Revisar Matches >90%", icon: <Award className="size-4" />, color: "text-blue-400" },
    { id: 2, title: "Analizar 3 Fichas Oficiales", icon: <BarChart3 className="size-4" />, color: "text-purple-400" },
    { id: 3, title: "Chequear Fechas de Cierre", icon: <TrendingUp className="size-4" />, color: "text-green-400" },
  ];

  useEffect(() => {
    fetch("http://localhost:8000/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error("Error loading stats", err));
  }, []);

  if (loading) return (
    <div className="p-8 animate-pulse space-y-8">
      <div className="h-32 bg-gray-900 rounded-3xl border border-gray-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-900 rounded-3xl border border-gray-800" />
          <div className="h-64 bg-gray-900 rounded-3xl border border-gray-800" />
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 italic">Comando Estratégico</h1>
          <p className="text-gray-500 mt-2">¿Cómo vamos a ganar hoy? Aquí están tus prioridades.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-tighter">Última Actualización</p>
          <p className="text-sm font-mono text-blue-500">Justo ahora</p>
        </div>
      </header>

      {/* Decision Agenda */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
            <h4 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
              <Award className="size-5 text-blue-500" /> Radar de Oportunidades "Hot"
            </h4>
            <div className="space-y-4">
              {stats?.high_impact.map((lic) => (
                <div key={lic.codigo} className="flex items-center justify-between p-4 bg-gray-950/50 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-mono text-gray-500 mb-1">{lic.codigo}</p>
                    <h5 className="font-bold text-gray-200 truncate group-hover:text-blue-400 transition-colors">{lic.nombre}</h5>
                    <p className="text-[10px] text-gray-600 uppercase mt-1">{lic.region}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-blue-400">{lic.score}%</div>
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Match</div>
                  </div>
                </div>
              ))}
              {stats?.high_impact.length === 0 && (
                <p className="text-center py-8 text-gray-600 italic">No hay licitaciones críticas en este momento. Sigue buscando.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <p className="text-xs font-bold text-gray-500 uppercase mb-4">Métrica de Calidad Hoy</p>
                <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full border-4 border-blue-500/20 border-t-purple-500 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-100">{stats?.average_score}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-200">Salud del Pipeline</p>
                        <p className="text-[10px] text-gray-500">Basado en {stats?.ti_matches} matches activos.</p>
                    </div>
                </div>
             </div>
             <div className="bg-gradient-to-br from-gray-900 to-transparent border border-gray-800 rounded-3xl p-6">
                <p className="text-xs font-bold text-gray-500 uppercase mb-4">Recomendación Diaria</p>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">
                  &quot;Enfócate en la Región Metropolitana. Las licitaciones de <span className="text-blue-400">Software</span> están cerrando con menos oferentes hoy.&quot;
                </p>
             </div>
          </div>
        </div>

        {/* Actionable Habits Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                < Award className="size-24 rotate-12" />
            </div>
            <h4 className="text-xl font-bold mb-2">Tu Meta Diaria</h4>
            <p className="text-blue-100 text-sm mb-6">Completa estos pasos para dominar el portal hoy:</p>
            <div className="space-y-3">
              {dailyTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-all cursor-pointer">
                  <div className="p-1.5 bg-white/20 rounded-lg">{task.icon}</div>
                  <span className="text-sm font-bold">{task.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Hot Regions TI</h4>
            <div className="space-y-4">
               {stats?.top_regions.map((region) => (
                 <div key={region.name} className="flex justify-between items-center group">
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{region.name}</span>
                    <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-lg">{region.count}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
