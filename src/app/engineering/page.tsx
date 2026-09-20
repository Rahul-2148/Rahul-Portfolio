import React from 'react';
import { Cpu, Server, Radio, Database, ShieldCheck, Sparkles, Code2 } from 'lucide-react';
import { TechEcosystem } from '@/components/sections/TechEcosystem';
import { engineeringDomains } from '@/lib/data/portfolio';

export const metadata = {
  title: 'Engineering Architecture & Domains',
  description:
    'Deep architectural breakdown across Frontend, Backend, Real-Time, Database, and AI systems.',
};

export default function EngineeringPage() {
  const getDomainIcon = (title: string) => {
    if (title.includes('Frontend')) return Code2;
    if (title.includes('Backend')) return Server;
    if (title.includes('Data')) return Database;
    if (title.includes('Real-Time')) return Radio;
    return Sparkles;
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Engineering Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          System Architecture &amp; Engineering Domains
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
          Building resilient, observable, and performant software requires more than picking frameworks. It requires deep respect for data lifecycle, asynchronous execution models, and clear architectural boundaries.
        </p>
      </div>

      {/* Engineering Domains Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engineeringDomains.map((domain) => {
          const Icon = getDomainIcon(domain.title);
          return (
            <div
              key={domain.title}
              className="bg-[#090910] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{domain.title}</h3>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed">
                {domain.description}
              </p>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                  Core Principles &amp; Patterns:
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
                  {domain.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/[0.06] pt-4 flex flex-wrap gap-1.5">
                {domain.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Tech Ecosystem Section */}
      <div className="border-t border-white/[0.08] pt-12">
        <TechEcosystem />
      </div>

      {/* Production Guarantees */}
      <div className="bg-[#0b0b14] border border-cyan-500/30 rounded-2xl p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Production Architecture Principles</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How I Approach Software Quality
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-neutral-300">
          <div className="space-y-2 bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl">
            <h4 className="font-bold text-white">Strict Type Soundness</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              End-to-end TypeScript interfaces with runtime validation via Zod at every API boundary to prevent corrupt data propagation.
            </p>
          </div>
          <div className="space-y-2 bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl">
            <h4 className="font-bold text-white">Zero-Block Real-Time</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Decoupled WebSocket event loops using Redis pub/sub channels and room-scoped broadcasts to prevent node blocking.
            </p>
          </div>
          <div className="space-y-2 bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl">
            <h4 className="font-bold text-white">Pragmatic AI Systems</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              AI integrated through strict provider abstractions with structured tools, fallback paths, and deterministic responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
