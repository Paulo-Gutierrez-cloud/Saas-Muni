"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { StrategicOverview } from "@/components/StrategicOverview";
import { AnalyticalDashboard } from "@/components/AnalyticalDashboard";
import { ChatAssistant } from "@/components/ChatAssistant";
import { AlertsView } from "@/components/AlertsView";
import { ConfigView } from "@/components/ConfigView";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  const [activeView, setActiveView] = useState("Inicio");

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-black font-sans antialiased text-gray-200 overflow-hidden">
        <Sidebar activeItem={activeView} onNavigate={setActiveView} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {activeView === "Inicio" ? (
            <StrategicOverview />
          ) : activeView === "Licitaciones" ? (
            <Dashboard />
          ) : activeView === "Análisis" ? (
            <AnalyticalDashboard />
          ) : activeView === "Asistente IA" ? (
            <ChatAssistant />
          ) : activeView === "Alertas" ? (
            <AlertsView />
          ) : activeView === "Configuración" ? (
            <ConfigView />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-400 mb-2">Sección {activeView}</h2>
                <p className="text-gray-600">Esta funcionalidad estará disponible pronto.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
