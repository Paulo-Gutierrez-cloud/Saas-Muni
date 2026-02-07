"use client";
import React, { useEffect, useState } from "react";
import { Bell, Calendar, ExternalLink, Zap, CheckCircle2 } from "lucide-react";

interface Alert {
  id: number;
  codigo_externo: string;
  nombre: string;
  score: number;
  sent_at: string;
}

export const AlertsView = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de historial de alertas
    // En el futuro esto consultará /alerts/history
    const mockAlerts = [
      { id: 1, codigo_externo: "1234-5-LP24", nombre: "Desarrollo de Software Educativo", score: 95, sent_at: "2026-02-05 10:30" },
      { id: 2, codigo_externo: "5678-1-LP24", nombre: "Migración Cloud AWS", score: 88, sent_at: "2026-02-04 15:45" },
      { id: 3, codigo_externo: "9012-4-LP24", nombre: "Soporte Técnico Nivel 2", score: 82, sent_at: "2026-02-03 09:12" },
    ];
    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 pb-24 text-gray-200">
      <header>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <Bell className="text-yellow-500" /> Historial de Alertas
        </h1>
        <p className="text-gray-500 font-medium">Oportunidades de alto impacto notificadas automáticamente.</p>
      </header>

      <div className="max-w-4xl space-y-4">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-gray-900 animate-pulse rounded-3xl border border-gray-800" />)
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl flex items-center justify-between group hover:border-blue-500/50 transition-all">
              <div className="flex gap-6 items-center">
                <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Zap className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{alert.nombre}</h3>
                    <span className="text-[10px] font-black bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 uppercase">
                      Score: {alert.score}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {alert.sent_at}</span>
                    <span className="font-mono text-blue-500/70">{alert.codigo_externo}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-800 rounded-xl transition-all text-gray-400 hover:text-white">
                  <ExternalLink className="size-5" />
                </button>
                <div className="text-green-500 bg-green-500/10 p-2 rounded-xl">
                  <CheckCircle2 className="size-5" />
                </div>
              </div>
            </div>
          ))
        )}
        
        {!loading && alerts.length === 0 && (
          <div className="text-center py-20 bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-800">
            <Bell className="size-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No se han emitido alertas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
};
