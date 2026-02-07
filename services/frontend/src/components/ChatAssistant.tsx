"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hola. Soy OpenClaw, tu analista estratégico de licitaciones. ¿En qué oportunidad quieres que profundicemos hoy?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Llamada al endpoint /chat que implementaremos en el API Gateway
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Lo siento, he tenido un problema conectando con mi motor central.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-gray-200 p-8 pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <Sparkles className="text-blue-400" /> Asistente Estratégico AI
        </h1>
        <p className="text-gray-500 font-medium italic">Powered by OpenClaw Engine</p>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col bg-gray-900/20 border border-gray-800 rounded-[3rem] relative shadow-2xl">
        {/* Messages Zone */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-blue-400 shadow-lg shadow-blue-900/20"
                }`}>
                  {msg.role === "user" ? <User className="size-5" /> : <Bot className="size-6 font-bold" />}
                </div>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-gray-900/60 border border-gray-800 text-gray-200 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex gap-4 max-w-[80%] items-center">
                <div className="size-10 bg-gray-800 rounded-2xl flex items-center justify-center text-blue-400 animate-pulse">
                  <Bot className="size-6" />
                </div>
                <div className="flex gap-1.5 p-4 bg-gray-900/60 border border-gray-800 rounded-3xl rounded-tl-none">
                  <span className="size-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 bg-blue-500 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Zone */}
        <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-gray-800 ring-1 ring-white/5">
          <div className="relative group max-w-5xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Pregúntale a OpenClaw sobre una licitación..."
              className="w-full bg-gray-950/80 border border-gray-800 rounded-2xl py-4 pl-6 pr-16 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white rounded-xl transition-all shadow-lg"
            >
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest font-black flex items-center justify-center gap-2">
            <Sparkles className="size-3 text-blue-500" /> Consultor Estratégico v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
