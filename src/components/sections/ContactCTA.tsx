'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { personalInfo } from '@/lib/data/portfolio';

export function ContactCTA() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact-cta" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl bg-card border border-border-accent p-8 sm:p-14 overflow-hidden text-center shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Ready for Immediate Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Let&apos;s build something <span className="gradient-theme-text">extraordinary</span> together.
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Whether you need a Principal Full-Stack Engineer for a distributed SaaS platform, a real-time event pipeline architect, or an AI product builder, my inbox is open.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2"
              data-cursor="CONTACT"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send a Direct Message</span>
            </Link>

            <button
              onClick={copyEmail}
              className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-primary" />}
              <span>{copied ? 'Copied to Clipboard!' : personalInfo.email}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default ContactCTA;
