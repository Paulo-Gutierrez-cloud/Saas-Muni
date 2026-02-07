"use client";
import React from "react";
import { Home, BarChart3, Bell, Settings, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

export const Sidebar = ({ activeItem, onNavigate }: SidebarProps) => {
  const menuItems = [
    { name: "Inicio", icon: Home },
    { name: "Licitaciones", icon: Search },
    { name: "Análisis", icon: BarChart3 },
    { name: "Asistente IA", icon: Sparkles },
    { name: "Alertas", icon: Bell },
    { name: "Configuración", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col pt-8 shrink-0">
      <div className="px-6 mb-10 flex items-center gap-2">
        <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">L</div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Licitaciones TI
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeItem === item.name 
                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
            <item.icon className="size-5" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="p-4 bg-gray-800/40 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Usuario Premium</p>
          <p className="text-sm font-semibold text-gray-200">Admin TI Chile</p>
        </div>
      </div>
    </div>
  );
};
