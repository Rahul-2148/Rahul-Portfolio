import { Bot, Layers } from 'lucide-react';
import { AiAssistant } from '@/components/sections/AiAssistant';

export const metadata = {
  title: 'AI Lab & Intelligent Systems',
  description:
    'AI orchestration architecture, provider abstractions, and interactive portfolio intelligence.',
};

export default function AiLabPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono">
          <Bot className="w-3.5 h-3.5 text-primary" />
          <span>Intelligent System Design</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
          AI Lab &amp; Orchestration
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Artificial intelligence should be an engineered system component, not a decorative novelty. Here is how I design, constrain, and integrate AI models into production software.
        </p>
      </div>

      {/* Architecture Blueprint Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>Provider Abstraction Architecture</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Decoupled AI integration ensures zero vendor lock-in and seamless fallback when rate limits or upstream provider outages occur.
        </p>

        <div className="bg-surface p-6 rounded-xl border border-border font-mono text-xs text-foreground space-y-2 overflow-x-auto shadow-xs">
          <div className="text-primary font-bold">Client Application / Storefront</div>
          <div className="text-muted-foreground pl-4">│  (HTTP / WebSocket Stream)</div>
          <div className="text-foreground font-bold pl-4">▼ Application Backend (API Controller)</div>
          <div className="text-muted-foreground pl-8">│  (Context Injection &amp; Rate Limiter)</div>
          <div className="text-emerald-500 font-bold pl-8">▼ AI Orchestrator &amp; Tool Router</div>
          <div className="text-muted-foreground pl-12">│</div>
          <div className="text-primary pl-12">├── [Gemini Provider] ── Primary High-Speed Reasoning</div>
          <div className="text-amber-500 pl-12">├── [Claude / OpenAI Provider] ── Automatic Resilient Fallback</div>
          <div className="text-purple-400 pl-12">└── [Python ML Microservice] ── Relevance &amp; Embeddings</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5 shadow-xs">
            <span className="font-bold text-foreground block">Structured Tool Calling</span>
            <p className="text-muted-foreground">Models invoke strictly validated functions instead of guessing data.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5 shadow-xs">
            <span className="font-bold text-foreground block">Hallucination Mitigation</span>
            <p className="text-muted-foreground">Strict grounding against verified database records and system telemetry.</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5 shadow-xs">
            <span className="font-bold text-foreground block">Streaming Token UX</span>
            <p className="text-muted-foreground">Low-latency progressive chunks for seamless user responsiveness.</p>
          </div>
        </div>
      </div>

      {/* Embedded Live AI Assistant */}
      <div>
        <AiAssistant />
      </div>
    </div>
  );
}
