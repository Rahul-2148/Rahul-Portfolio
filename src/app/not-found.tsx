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
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span>HTTP 404 — Route Not Found</span>
      </div>

      <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-white font-mono">
        404
      </h1>

      <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        The requested resource path does not exist in this deployment. Check the command palette or terminal for verified system endpoints.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <button
          onClick={toggleTerminal}
          className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 font-mono text-xs flex items-center gap-2 transition-all"
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Inspect in Terminal</span>
        </button>
      </div>
    </div>
  );
}
