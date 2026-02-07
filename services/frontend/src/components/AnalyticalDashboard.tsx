"use client";
import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Brain, TrendingUp, Target, BarChart3, Filter, Zap } from "lucide-react";

interface AnalyticsData {
  trends: { date: string; count: number; predicted: number }[];
  probabilities: { range: string; success_rate: number; opportunities: number }[];
  segmentation: { name: string; value: number }[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export const AnalyticalDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/analytics")
      .then(res => {
        if (!res.ok) throw new Error("Backend unreachable");
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Fetch error:", err);
        // Fallback or error state could be added here
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="h-64 bg-gray-900 rounded-3xl border border-gray-800 lg:col-span-2" />
      <div className="h-64 bg-gray-900 rounded-3xl border border-gray-800" />
      <div className="h-64 bg-gray-900 rounded-3xl border border-gray-800" />
      <div className="h-64 bg-gray-900 rounded-3xl border border-gray-800 lg:col-span-2" />
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 pb-24 text-gray-200">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Brain className="text-blue-500" /> Inteligencia Analítica
          </h1>
          <p className="text-gray-500 font-medium">Modelos predictivos y análisis de mercado para el éxito estratégico.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all">
                <Filter className="size-4" /> Segmentación
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                <Zap className="size-4" /> Activar ML
            </button>
        </div>
      </header>

      {/* Top Row: Main Trend + Probability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart (Linear Regression Style) */}
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-8 backdrop-blur-sm relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-400 size-5" /> Regresión Lineal: Tendencia de Mercado TI
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '1rem' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="count" name="Licitaciones Reales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                <Line type="monotone" dataKey="predicted" name="Proyección (ML)" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* win probability Gauge style bar */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Target className="text-purple-400 size-5" /> Probabilidad de Win
            </h4>
            <p className="text-xs text-gray-500 mb-8 font-medium italic">Correlación entre Match IA y Tasa de Adjudicación Histórica.</p>
          </div>
          <div className="space-y-6">
            {data?.probabilities.map((item, i) => (
              <div key={item.range} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.range} Score</span>
                  <span className="text-lg font-black text-white">{item.success_rate}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                        width: `${item.success_rate}%`,
                        backgroundColor: i === 3 ? "#10b981" : i === 2 ? "#3b82f6" : i === 1 ? "#f59e0b" : "#ef4444"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Market Segmentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900/40 border border-gray-800 rounded-[2.5rem] p-8">
           <h4 className="text-lg font-bold mb-8 flex items-center gap-2 text-white">
            <BarChart3 className="text-green-400 size-5" /> Segmentación por Categoría Estratégica
          </h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.segmentation} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={10} width={100} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '1rem' }}
                />
                <Bar dataKey="value" name="Volumen" radius={[0, 10, 10, 0]}>
                  {data?.segmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-transparent border border-gray-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="size-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="size-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Insights del Bot Predictivo</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
                La <span className="text-blue-400">Regresión Lineal</span> sugiere que las licitaciones de "Desarrollo de Software" aumentarán un <span className="text-green-400">18%</span> el próximo mes. La probabilidad de adjudicación sube drásticamente al superar el <span className="text-purple-400">85% de Match IA</span>.
            </p>
            <div className="mt-8 p-4 bg-gray-950/80 rounded-2xl border border-gray-800 text-xs text-gray-500 flex items-center gap-3">
                <Zap className="size-4 text-yellow-500 animate-pulse" /> IA Analizando 19,431 registros históricos...
            </div>
        </div>
      </div>
    </div>
  );
};
