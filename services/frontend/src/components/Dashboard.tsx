"use client";
import React, { useState, useEffect } from "react";
import { Tender } from "@/lib/types";
import { TenderCard } from "./TenderCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { AnalysisDrawer } from "./AnalysisDrawer";
import { FilterDrawer } from "./FilterDrawer";
import { cn } from "@/lib/utils";
import { Search, Filter, RefreshCcw, Activity } from "lucide-react";

export const Dashboard = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | favorites
  const [isConnected, setIsConnected] = useState(false);
  const [recentAlert, setRecentAlert] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    region: "",
    categoria: "",
    minScore: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTenders = React.useCallback(async () => {
    try {
      setLoading(true);
      let url = activeTab === "favorites" 
        ? "http://localhost:8000/favoritos"
        : `http://localhost:8000/licitaciones?q=${search}&limit=50`;
      
      if (activeTab !== "favorites") {
        if (advancedFilters.region) url += `&region=${encodeURIComponent(advancedFilters.region)}`;
        if (advancedFilters.categoria) url += `&categoria=${encodeURIComponent(advancedFilters.categoria)}`;
        if (advancedFilters.minScore > 0) url += `&min_score=${advancedFilters.minScore}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      let items = activeTab === "favorites" ? data : (data?.items || data);
      
      // Force array type
      if (!Array.isArray(items)) {
        console.warn("API did not return an array, defaulting to empty list", items);
        items = [];
      }
      
      setTenders(items);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTenders([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeTab, advancedFilters]);

  const fetchFavoritesIds = async () => {
    try {
      const res = await fetch("http://localhost:8000/favoritos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFavorites(data.map((f: Tender) => f?.codigo_externo).filter((id): id is string => typeof id === 'string'));
      } else {
        setFavorites([]);
      }
    } catch (e) { 
      console.error("Error fetching favorites:", e);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchTenders();
    fetchFavoritesIds();
  }, [search, activeTab, fetchTenders]);

  const handleToggleFavorite = async (codigo: string, isFav: boolean) => {
    try {
      const method = isFav ? "DELETE" : "POST";
      await fetch(`http://localhost:8000/favoritos/${codigo}`, { method });
      
      setFavorites(prev => isFav 
        ? prev.filter(id => id !== codigo) 
        : [...prev, codigo]
      );
      
      if (activeTab === "favorites") fetchTenders();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "licitacion_scored") {
          setRecentAlert(`${data.nombre || 'Actualización'}: ${data.score || 0}%`);
          setTimeout(() => setRecentAlert(null), 5000);
          fetchTenders();
        }
      } catch (e) {
        console.error("WS Message Error:", e);
      }
    };

    return () => ws.close();
  }, [fetchTenders]);

  if (!mounted) return null;

  return (
    <div className="flex-1 bg-gray-950 min-h-screen overflow-auto">
      {/* Top Header */}
      <header className="px-8 py-6 border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o descripción..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-blue-600 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <nav className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
            <button 
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeTab === "all" ? "bg-gray-800 text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-300"
              )}
            >
              Todo
            </button>
            <button 
              onClick={() => setActiveTab("favorites")}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                activeTab === "favorites" ? "bg-gray-800 text-blue-400 shadow-sm" : "text-gray-500 hover:text-gray-300"
              )}
            >
              Favoritos
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg">
            <Activity className={cn("size-4", isConnected ? "text-green-500" : "text-red-500")} />
            <span className="text-xs font-medium text-gray-400">
              {isConnected ? "Live Network" : "Disconnected"}
            </span>
          </div>
          <button 
            onClick={fetchTenders}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors"
          >
            <RefreshCcw className="size-4 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {recentAlert && (
          <div className="mb-6 p-4 bg-blue-600/20 border border-blue-600/50 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-blue-400">NUEVO SCORING DETECTADO:</span>
            <span className="text-sm text-gray-200 truncate">{recentAlert}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              {activeTab === "all" ? "Oportunidades TI [SYNC OK]" : "Mis Favoritos"}
            </h2>
            <p className="text-gray-500 mt-1">
              {activeTab === "all" 
                ? "Explora las mejores licitaciones filtradas por nuestro agente IA."
                : "Licitaciones marcadas para seguimiento estratégico."}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 bg-gray-900 border rounded-xl text-sm font-medium transition-all",
                (advancedFilters.region || advancedFilters.categoria || advancedFilters.minScore > 0)
                  ? "border-blue-500 text-blue-400 bg-blue-500/10 shadow-lg shadow-blue-900/10"
                  : "border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700"
              )}
            >
              <Filter className="size-4" /> Filtros Avanzados
              {(advancedFilters.region || advancedFilters.categoria || advancedFilters.minScore > 0) && (
                <span className="size-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenders
              .filter(t => {
                if (!t || typeof t !== 'object') return false;
                if (!t.codigo_externo && !t.nombre) return false;
                return true;
              })
              .map((tender, index) => (
                <ErrorBoundary key={tender.codigo_externo || `idx-${index}`}>
                  <TenderCard 
                    tender={{
                      ...tender, 
                      is_favorite: Boolean(favorites && Array.isArray(favorites) && favorites.includes(tender.codigo_externo))
                    }} 
                    onToggleFavorite={handleToggleFavorite}
                    onClick={() => setSelectedTender(tender)}
                  />
                </ErrorBoundary>
              ))}
          </div>
        )}
        
        {!loading && tenders.length === 0 && (
          <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500">
              {activeTab === "favorites" 
                ? "Aún no tienes licitaciones favoritas." 
                : "No se encontraron licitaciones que coincidan con tu búsqueda."}
            </p>
          </div>
        )}

        {mounted && (
          <>
            <AnalysisDrawer 
              tender={selectedTender} 
              onClose={() => setSelectedTender(null)} 
            />
            <FilterDrawer
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={advancedFilters}
              onApply={setAdvancedFilters}
            />
          </>
        )}
      </main>
    </div>
  );
};
