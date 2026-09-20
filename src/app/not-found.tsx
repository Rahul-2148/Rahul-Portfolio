'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Home } from 'lucide-react';

export default function NotFound() {
  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        <span>HTTP 404 — Route Not Found</span>
      </div>

      <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-foreground font-mono">
        404
      </h1>

      <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        The requested resource path does not exist in this deployment. Check the command palette or terminal for verified system endpoints.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <button
          onClick={toggleTerminal}
          className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs flex items-center gap-2 transition-all shadow-xs"
        >
          <Terminal className="w-4 h-4 text-primary" />
          <span>Inspect in Terminal</span>
        </button>
      </div>
    </div>
  );
}
