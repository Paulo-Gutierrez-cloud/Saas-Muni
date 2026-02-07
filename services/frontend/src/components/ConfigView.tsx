"use client";
import React, { useState } from "react";
import { Settings, Save, Building2, MapPin, Search, Mail, BellRing } from "lucide-react";

export const ConfigView = () => {
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 pb-24 text-gray-200">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Settings className="text-gray-400" /> Configuración Estratégica
          </h1>
          <p className="text-gray-500 font-medium">Personaliza el motor de IA según el perfil de tu empresa.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg shadow-blue-900/40"
        >
          {saving ? "Guardando..." : <><Save className="size-4" /> Guardar Cambios</>}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Profile */}
        <section className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Building2 className="text-blue-400 size-5" /> Perfil de Empresa
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Palabras Clave (Core Business)</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                <input 
                  type="text" 
                  defaultValue="Software, Desarrollo, Cloud, AWS, Python" 
                  className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all font-medium text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Regiones de Operación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                <input 
                  type="text" 
                  defaultValue="Región Metropolitana, Valparaíso, Biobío" 
                  className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all font-medium text-gray-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <BellRing className="text-yellow-400 size-5" /> Motor de Alertas
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-2xl border border-gray-800">
              <div className="flex gap-4 items-center">
                <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Notificaciones por Email</p>
                  <p className="text-[10px] text-gray-500 font-medium">Enviado a: re***@gmail.com</p>
                </div>
              </div>
              <div className="size-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="size-2 bg-white rounded-full" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Umbral de Scoring Crítico</label>
                <span className="text-xs font-bold text-blue-400">80% Match</span>
              </div>
              <input type="range" className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <p className="text-[10px] text-gray-600 font-medium leading-relaxed italic">
                * Solo se enviarán alertas si el Agente de IA califica la licitación por encima de este valor.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/10 p-10 rounded-[3rem] text-center">
          <p className="text-sm text-gray-400 font-medium max-w-2xl mx-auto">
            Nota: Cambiar estos parámetros forzará al **Agente OpenClaw** a re-evaluar las licitaciones actuales para ajustar sus recomendaciones estratégicas en tiempo real.
          </p>
      </div>
    </div>
  );
};
