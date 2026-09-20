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
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0f111d] to-[#07070b] border border-cyan-500/30 p-8 sm:p-14 overflow-hidden text-center shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Ready for Immediate Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">extraordinary</span> together.
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Whether you need a Principal Full-Stack Engineer for a distributed SaaS platform, a real-time event pipeline architect, or an AI product builder, my inbox is open.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center gap-2"
              data-cursor="CONTACT"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send a Direct Message</span>
            </Link>

            <button
              onClick={copyEmail}
              className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-200 font-mono text-xs transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? 'Copied to Clipboard!' : personalInfo.email}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default ContactCTA;
