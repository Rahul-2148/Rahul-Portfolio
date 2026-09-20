'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { personalInfo, navItems } from '@/lib/data/portfolio';

export function Footer() {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };

  return (
    <footer className="border-t border-border bg-surface relative overflow-hidden py-16">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs shadow-primary/20">
                R
              </div>
              <span className="font-semibold text-foreground tracking-tight">Rahul Raj</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Full-Stack Engineer architecting scalable distributed platforms, event-driven real-time services, and intelligent AI-augmented digital products.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-muted border border-border text-xs font-mono text-foreground hover:text-primary transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                <span>{copied ? 'Copied to Clipboard' : personalInfo.email}</span>
              </button>
              <button
                onClick={toggleTerminal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-muted border border-border text-xs font-mono text-foreground hover:text-primary transition-colors"
                title="Open Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>CLI</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Navigation</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: System Status & Connect */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">System Status</p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Portfolio: Online</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                <span>Engine: Next.js + Turbopack</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-border-accent inline-block" />
                <span>Linter: Oxlint (Rust)</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:underline"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub @Rahul-2148</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <p>© {new Date().getFullYear()} Rahul Raj. Engineered with precision.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-primary transition-colors group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
