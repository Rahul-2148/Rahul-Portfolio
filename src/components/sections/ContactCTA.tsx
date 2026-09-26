'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { personalInfo } from '@/lib/data/portfolio';
import { Magnetic } from '@/components/ui/Magnetic';

export function ContactCTA() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact-cta" className="pt-4 sm:pt-6 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl bg-card border border-border-accent p-6 sm:p-10 overflow-hidden text-center shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Available for New Opportunities</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Let&apos;s build something <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">great</span> together.
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Looking for a dedicated full-stack developer, MERN engineer, or AI builder? Whether it&apos;s an exciting full-time role or a freelance project, my inbox is always open.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Magnetic strength={0.2}>
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center gap-2"
                data-cursor="CONTACT"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get in Touch</span>
              </Link>
            </Magnetic>


            <Magnetic strength={0.15}>
              <button
                onClick={copyEmail}
                className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs transition-all flex items-center gap-2 shadow-xs active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-primary" />}
                <span>{copied ? 'Copied to Clipboard!' : personalInfo.email}</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
