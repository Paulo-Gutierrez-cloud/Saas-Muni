"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-950 border border-red-500 rounded-3xl m-8 text-white">
          <h2 className="text-xl font-bold mb-4">Algo salió mal en el Dashboard</h2>
          <pre className="bg-black/50 p-4 rounded-xl overflow-auto text-xs font-mono text-red-400">
            {this.state.error?.message}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-600 rounded-lg text-sm font-bold"
          >
            Reintentar Recarga
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
