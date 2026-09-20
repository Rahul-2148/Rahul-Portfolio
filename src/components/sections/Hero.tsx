'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Terminal, Sparkles, Layers } from 'lucide-react';
import { personalInfo } from '@/lib/data/portfolio';

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = [
    'Full-Stack & AI Systems Architect',
    'Real-Time Event Systems Engineer',
    'Distributed Micro-Frontend Designer',
    'High-Concurrency Platform Builder',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };

  const openArchitecture = () => {
    const el = document.getElementById('architecture');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Grids & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[140px] -top-20 -left-20 animate-pulse transition-colors duration-500"
          style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.12)' }}
        />
        <div
          className="w-[500px] h-[500px] rounded-full blur-[140px] bottom-0 right-0 transition-colors duration-500"
          style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.08)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Status Pill & Dynamic Role Switcher */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="transition-opacity duration-300">{roles[roleIndex]}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Open for High-Impact Roles &amp; Engineering Collabs</span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="max-w-5xl space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.08]">
            Architecting <span className="gradient-theme-text">resilient systems</span> &amp; intuitive interfaces.
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl font-normal leading-relaxed pt-2">
            I am <strong className="text-foreground font-semibold">{personalInfo.name}</strong>. I engineer distributed web architectures, high-concurrency real-time event pipelines, and modern AI-augmented applications from foundation to production.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-8">
          <Link
            href="/work"
            className="px-7 py-3.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 flex items-center gap-2"
            data-cursor="EXPLORE"
          >
            <span>Explore Flagship Work</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={openArchitecture}
            className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground font-medium text-sm transition-all hover:-translate-y-0.5 flex items-center gap-2 shadow-xs"
            data-cursor="SYSTEMS"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span>Interactive Architecture</span>
          </button>

          <button
            onClick={toggleTerminal}
            className="px-5 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-primary font-mono text-xs transition-all flex items-center gap-2 shadow-xs"
            data-cursor="CLI"
          >
            <Terminal className="w-4 h-4 text-primary" />
            <span>developer_cli</span>
          </button>
        </div>

        {/* Bottom Metrics & Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-16 mt-12 border-t border-border">
          <div className="p-4 rounded-xl bg-card border border-border shadow-xs card-beam card-ambient-glow">
            <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Architecture</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">5 Micro-Frontends</div>
            <p className="text-xs text-muted-foreground mt-1">Decoupled portals for multi-vendor scale</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs card-beam card-ambient-glow">
            <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Real-Time Core</span>
            <div className="text-xl sm:text-2xl font-bold text-primary mt-1">&lt; 50ms State Sync</div>
            <p className="text-xs text-muted-foreground mt-1">Socket.IO rooms + Redis pub/sub pipelines</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs card-beam card-ambient-glow">
            <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Payments &amp; Security</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground mt-1">Dual Gateway</div>
            <p className="text-xs text-muted-foreground mt-1">Stripe + Razorpay webhook validation</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-xs card-beam card-ambient-glow">
            <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Data Integrity</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-500 mt-1">100% Verified</div>
            <p className="text-xs text-muted-foreground mt-1">Zero fabricated metrics, real GitHub projects</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
