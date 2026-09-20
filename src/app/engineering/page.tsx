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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-primary" />
          <span>Core Engineering Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
          System Architecture &amp; Engineering Domains
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
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
              className="bg-card border border-border hover:border-border-accent rounded-2xl p-6 sm:p-8 space-y-6 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">{domain.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {domain.description}
              </p>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Core Principles &amp; Patterns:
                </span>
                <ul className="space-y-1.5 text-xs text-foreground font-mono">
                  {domain.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4 flex flex-wrap gap-1.5">
                {domain.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[11px] font-mono text-muted-foreground"
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
      <div className="border-t border-border pt-12">
        <TechEcosystem />
      </div>

      {/* Production Guarantees */}
      <div className="bg-surface-elevated border border-border-accent rounded-2xl p-8 sm:p-12 space-y-6 shadow-lg">
        <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Production Architecture Principles</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          How I Approach Software Quality
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="space-y-2 bg-surface border border-border p-5 rounded-xl shadow-xs">
            <h4 className="font-bold text-foreground">Strict Type Soundness</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              End-to-end TypeScript interfaces with runtime validation via Zod at every API boundary to prevent corrupt data propagation.
            </p>
          </div>
          <div className="space-y-2 bg-surface border border-border p-5 rounded-xl shadow-xs">
            <h4 className="font-bold text-foreground">Zero-Block Real-Time</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Decoupled WebSocket event loops using Redis pub/sub channels and room-scoped broadcasts to prevent node blocking.
            </p>
          </div>
          <div className="space-y-2 bg-surface border border-border p-5 rounded-xl shadow-xs">
            <h4 className="font-bold text-foreground">Pragmatic AI Systems</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI integrated through strict provider abstractions with structured tools, fallback paths, and deterministic responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
