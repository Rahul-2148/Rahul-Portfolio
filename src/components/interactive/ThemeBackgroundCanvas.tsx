'use client';

import React, { useEffect, useState } from 'react';
import { getStoredTheme, ThemeId } from '@/lib/theme';

export function ThemeBackgroundCanvas() {
  const [theme, setLocalTheme] = useState<ThemeId>('cyber-cyan');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalTheme(getStoredTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeId>;
      if (customEvent.detail) {
        setLocalTheme(customEvent.detail);
      } else {
        setLocalTheme(getStoredTheme());
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);

    // Also observe attribute changes on documentElement
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') as ThemeId | null;
      if (current) {
        setLocalTheme(current);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-opacity duration-700"
    >
      {/* ====================================================
          1. CYBER CYAN MOTIF: Cybernetic Blueprint & HUD
          ==================================================== */}
      {theme === 'cyber-cyan' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Ambient Radial Spotlight */}
          <div
            className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-[140px] opacity-25"
            style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }}
          />
          <div
            className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full blur-[160px] opacity-15"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)' }}
          />

          {/* Technical Blueprint Grid (3-5% opacity) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_65%,transparent_100%)]" />

          {/* HUD Telemetry Watermarks */}
          <div className="absolute top-28 left-6 text-[10px] font-mono text-cyan-400/20 tracking-widest uppercase hidden lg:block">
            ┌ SYS_GRID: CYBER_BLUEPRINT_V4 ── [ACTIVE]
          </div>
          <div className="absolute top-28 right-6 text-[10px] font-mono text-cyan-400/20 tracking-widest uppercase hidden lg:block">
            COORD: 28.6139° N, 77.2090° E ┐
          </div>
          <div className="absolute bottom-10 left-6 text-[10px] font-mono text-cyan-400/15 tracking-widest uppercase hidden lg:block">
            └ QUANTUM_CORE: SYNCHRONIZED
          </div>
          <div className="absolute bottom-10 right-6 text-[10px] font-mono text-cyan-400/15 tracking-widest uppercase hidden lg:block">
            LATENCY: 4.2MS // HIGH_THROUGHPUT ┘
          </div>
        </div>
      )}

      {/* ====================================================
          2. SYNTH VIOLET MOTIF: Neon Aurora & Starlight
          ==================================================== */}
      {theme === 'synth-violet' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Aurora Floating Mesh Orbs */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[160px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-pink-500/12 blur-[150px]" />
          <div className="absolute -bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[170px]" />

          {/* Micro Starlight Constellation Dots (3% opacity) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.12)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)]" />

          {/* Horizon Subtle Glow Line */}
          <div className="absolute top-1/2 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />

          {/* Atmospheric Telemetry */}
          <div className="absolute top-28 left-6 text-[10px] font-mono text-purple-400/20 tracking-widest uppercase hidden lg:block">
            ✦ AURORA_FIELD: HARMONIC_RESONANCE
          </div>
          <div className="absolute bottom-10 right-6 text-[10px] font-mono text-pink-400/20 tracking-widest uppercase hidden lg:block">
            NEO_TOKYO_ENGINE // SPECTRUM: VIOLET
          </div>
        </div>
      )}

      {/* ====================================================
          3. MATRIX EMERALD MOTIF: Phosphor Terminal & Scanlines
          ==================================================== */}
      {theme === 'matrix-emerald' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Phosphor Terminal Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-500/12 blur-[150px]" />
          <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px]" />

          {/* Terminal Dot-Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14)_1px,transparent_1px)] bg-[size:1.75rem_1.75rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_65%,transparent_100%)]" />

          {/* Horizontal CRT Scanlines (2% opacity) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:100%_4px] opacity-60" />

          {/* Telemetry Code Watermarks */}
          <div className="absolute top-28 left-6 font-mono text-[10px] text-emerald-500/25 space-y-1 hidden lg:block select-none">
            <p>&gt; 0x7F_ALLOC: BUFFER_OK</p>
            <p>&gt; TCP_SOCKET: STREAM_ESTABLISHED</p>
            <p>&gt; TLS1.3_CIPHER: ECDHE_RSA_AES</p>
          </div>
          <div className="absolute bottom-10 right-6 font-mono text-[10px] text-emerald-500/20 text-right space-y-1 hidden lg:block select-none">
            <p>MEM: 412MB / 1024MB</p>
            <p>PACKETS_TX: 94,821 / RX: 94,821</p>
            <p>SYS_STATUS: 100% OPERATIONAL</p>
          </div>
        </div>
      )}

      {/* ====================================================
          4. SOLAR AMBER MOTIF: Industrial CAD Drafting
          ==================================================== */}
      {theme === 'solar-amber' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Warm Industrial Directional Spotlight */}
          <div className="absolute top-0 right-1/4 w-[750px] h-[750px] rounded-full bg-amber-500/12 blur-[170px]" />
          <div className="absolute -bottom-20 -left-20 w-[550px] h-[550px] rounded-full bg-orange-500/10 blur-[150px]" />

          {/* 45° CAD Hatched Linework (4% opacity) */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(245,158,11,0.03)_0,rgba(245,158,11,0.03)_1px,transparent_0,transparent_28px)] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_65%,transparent_100%)]" />

          {/* Orthogonal Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_35%,#000_60%,transparent_100%)]" />

          {/* CAD Axis Ticks & Drafting Annotations */}
          <div className="absolute top-28 left-6 text-[10px] font-mono text-amber-500/20 tracking-widest hidden lg:block">
            [X-AXIS // DRAFTING_PITCH: 64.0MM]
          </div>
          <div className="absolute top-28 right-6 text-[10px] font-mono text-amber-500/20 tracking-widest hidden lg:block">
            [Y-AXIS // ELEVATION: +14.2°]
          </div>
          <div className="absolute bottom-10 left-6 text-[10px] font-mono text-amber-500/15 tracking-widest hidden lg:block">
            SPEC_REV: 4.8 // TOLERANCE: ±0.005MM
          </div>
        </div>
      )}

      {/* ====================================================
          5. CRIMSON OVERDRIVE MOTIF: Kinetic Circuitry
          ==================================================== */}
      {theme === 'crimson-overdrive' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* High-Voltage Ambient Rim Glow */}
          <div className="absolute -top-20 -left-20 w-[650px] h-[650px] rounded-full bg-rose-600/14 blur-[160px]" />
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-orange-600/12 blur-[150px]" />

          {/* Angular Circuit-Like Trace Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,42,95,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,42,95,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_35%,#000_60%,transparent_100%)]" />

          {/* 60° Diagonal Velocity Lines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(60deg,rgba(255,42,95,0.02)_0,rgba(255,42,95,0.02)_1px,transparent_0,transparent_40px)] opacity-50" />

          {/* High-Octane Telemetry */}
          <div className="absolute top-28 left-6 text-[10px] font-mono text-rose-500/25 tracking-widest uppercase hidden lg:block">
            ⚡ OVERDRIVE_BUS // VOLTAGE: 1.25V [BOOST]
          </div>
          <div className="absolute bottom-10 right-6 text-[10px] font-mono text-rose-500/20 tracking-widest uppercase hidden lg:block">
            CLOCK: 5.4 GHZ // THERMAL: NOMINAL
          </div>
        </div>
      )}

      {/* ====================================================
          6. STUDIO LIGHT MOTIF: Swiss Minimalist & Dot-Grid
          ==================================================== */}
      {theme === 'studio-light' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Architectural Soft Daylight Vignette */}
          <div className="absolute top-0 right-10 w-[700px] h-[700px] rounded-full bg-sky-200/35 blur-[160px]" />
          <div className="absolute -bottom-10 left-10 w-[650px] h-[650px] rounded-full bg-blue-100/40 blur-[150px]" />

          {/* Precision Swiss Dot-Matrix Grid (Drafting Paper) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_85%_70%_at_50%_35%,#000_70%,transparent_100%)]" />

          {/* Architectural Crosshair Markers (+) at Grid Points */}
          <div className="absolute top-28 left-8 text-xs font-mono text-slate-400/40 select-none hidden lg:block">
            + 01 / GRID
          </div>
          <div className="absolute top-28 right-8 text-xs font-mono text-slate-400/40 select-none hidden lg:block">
            + 02 / SCALE 1:1
          </div>
          <div className="absolute bottom-10 left-8 text-xs font-mono text-slate-400/35 select-none hidden lg:block">
            + 03 / SYSTEM STUDIO
          </div>
          <div className="absolute bottom-10 right-8 text-xs font-mono text-slate-400/35 select-none hidden lg:block">
            + 04 / SWISS TYPOGRAPHY
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeBackgroundCanvas;
