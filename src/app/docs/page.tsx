'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Copy, Check, Terminal, Shield, Sparkles } from 'lucide-react';

export default function DocsPage() {
  const [copied, setCopied] = useState(false);
  const [uiLoaded, setUiLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Inject Swagger UI stylesheet
    const cssId = 'swagger-ui-stylesheet';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css';
      document.head.appendChild(link);
    }

    // Inject Swagger UI JS Bundle
    const scriptId = 'swagger-ui-bundle-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initSwagger = () => {
      try {
        const win = window as unknown as {
          SwaggerUIBundle?: (options: Record<string, unknown>) => void;
        };

        if (typeof win.SwaggerUIBundle === 'function') {
          win.SwaggerUIBundle({
            url: '/api/docs',
            dom_id: '#swagger-ui-container',
            deepLinking: true,
            displayRequestDuration: true,
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            docExpansion: 'list',
            persistAuthorization: true,
            tryItOutEnabled: true,
          });
          setUiLoaded(true);
        } else {
          setLoadError('SwaggerUIBundle initialized with unexpected format');
        }
      } catch (err) {
        console.error('Failed to mount Swagger UI:', err);
        setLoadError('Failed to initialize interactive documentation viewer');
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js';
      script.async = true;
      script.onload = () => {
        initSwagger();
      };
      script.onerror = () => {
        setLoadError('Could not load Swagger UI bundle from CDN');
      };
      document.body.appendChild(script);
    } else {
      // Script already loaded or loading
      if ((window as unknown as { SwaggerUIBundle?: unknown }).SwaggerUIBundle) {
        initSwagger();
      } else {
        script.onload = () => initSwagger();
      }
    }
  }, []);

  const handleCopySpecUrl = () => {
    const url = `${window.location.origin}/api/docs`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="-mt-16 min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090e]/85 backdrop-blur-xl px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </Link>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
                API
              </div>
              <span className="font-semibold text-sm sm:text-base tracking-tight text-white">
                Rahul Raj <span className="text-cyan-400 font-mono text-xs ml-1 font-normal">v1.0.0</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live OpenAPI 3.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopySpecUrl}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
              title="Copy link to raw OpenAPI JSON"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied URL!' : 'Copy Spec URL'}</span>
            </button>

            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Overview */}
      <section className="border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
              <Terminal className="w-3 h-3" />
              Production REST Architecture
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-800/60 border border-white/5 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Interactive Sandbox Enabled
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              API Documentation & Interactive Swagger Explorer
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
              Exhaustive API documentation for Rahul Raj&apos;s portfolio platform. Test endpoints directly in your browser, inspect request bodies, inspect Zod schemas, and view real-time latency diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <div className="text-slate-400 font-medium">Base URL</div>
              <div className="mt-1 font-mono text-cyan-300 text-xs break-all">/api (relative to domain)</div>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <div className="text-slate-400 font-medium">Authentication</div>
              <div className="mt-1 text-slate-300">Cookie (<code className="text-purple-300 font-mono">portfolio_admin_token</code>) or Header (<code className="text-purple-300 font-mono">x-admin-passcode</code>)</div>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <div className="text-slate-400 font-medium">Rate Limiting</div>
              <div className="mt-1 text-slate-300">Sliding Window (5 req / 15m for Contact, 60 req / min general)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Swagger Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {!uiLoaded && !loadError && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-mono">Initializing Swagger UI Specification...</p>
          </div>
        )}

        {loadError && (
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/20 text-center max-w-lg mx-auto my-12 space-y-3">
            <p className="text-red-400 font-medium text-sm">{loadError}</p>
            <p className="text-xs text-slate-400">
              You can still view the raw JSON specification directly at:
            </p>
            <a
              href="/api/docs"
              className="inline-block text-xs font-mono text-cyan-400 underline"
            >
              /api/docs
            </a>
          </div>
        )}

        {/* Swagger UI DOM Target */}
        <div id="swagger-ui-container" className="swagger-dark-theme rounded-2xl overflow-hidden" />
      </main>

      {/* Dark Theme Overrides for Swagger UI */}
      <style jsx global>{`
        .swagger-dark-theme {
          filter: invert(88%) hue-rotate(180deg);
        }
        .swagger-dark-theme img,
        .swagger-dark-theme svg,
        .swagger-dark-theme .highlight-code {
          filter: invert(100%) hue-rotate(180deg);
        }
        .swagger-dark-theme .topbar {
          display: none !important;
        }
        .swagger-dark-theme .swagger-ui {
          color: #111;
          font-family: inherit;
        }
        .swagger-dark-theme .swagger-ui .info {
          margin: 20px 0;
        }
        .swagger-dark-theme .swagger-ui .scheme-container {
          background: #f8fafc;
          border-radius: 12px;
          padding: 15px;
          box-shadow: none;
          border: 1px solid #e2e8f0;
        }
        .swagger-dark-theme .swagger-ui .opblock {
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: none;
        }
        .swagger-dark-theme .swagger-ui .opblock .opblock-summary {
          padding: 10px 16px;
        }
        .swagger-dark-theme .swagger-ui .btn.execute {
          background-color: #0284c7;
          border-color: #0284c7;
          color: #fff;
          font-weight: 600;
          border-radius: 8px;
        }
        .swagger-dark-theme .swagger-ui .btn.authorize {
          border-color: #7c3aed;
          color: #7c3aed;
          border-radius: 8px;
        }
        .swagger-dark-theme .swagger-ui input[type="text"] {
          border-radius: 6px;
        }
      `}</style>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-500">
        <p>
          Rahul Raj Portfolio API • Documented with OpenAPI 3.0.3 & Swagger UI • Built with Next.js 16
        </p>
      </footer>
    </div>
  );
}
