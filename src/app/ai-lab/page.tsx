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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <Bot className="w-3.5 h-3.5" />
          <span>Intelligent System Design</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          AI Lab &amp; Orchestration
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
          Artificial intelligence should be an engineered system component, not a decorative novelty. Here is how I design, constrain, and integrate AI models into production software.
        </p>
      </div>

      {/* Architecture Blueprint Card */}
      <div className="bg-[#090910] border border-white/[0.08] rounded-2xl p-6 sm:p-10 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Provider Abstraction Architecture</span>
        </h2>
        <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Decoupled AI integration ensures zero vendor lock-in and seamless fallback when rate limits or upstream provider outages occur.
        </p>

        <div className="bg-black/60 p-6 rounded-xl border border-white/5 font-mono text-xs text-neutral-300 space-y-2 overflow-x-auto">
          <div className="text-cyan-400 font-bold">Client Application / Storefront</div>
          <div className="text-neutral-500 pl-4">│  (HTTP / WebSocket Stream)</div>
          <div className="text-white font-bold pl-4">▼ Application Backend (API Controller)</div>
          <div className="text-neutral-500 pl-8">│  (Context Injection &amp; Rate Limiter)</div>
          <div className="text-emerald-400 font-bold pl-8">▼ AI Orchestrator &amp; Tool Router</div>
          <div className="text-neutral-500 pl-12">│</div>
          <div className="text-cyan-300 pl-12">├── [Gemini Provider] ── Primary High-Speed Reasoning</div>
          <div className="text-amber-300 pl-12">├── [Claude / OpenAI Provider] ── Automatic Resilient Fallback</div>
          <div className="text-purple-300 pl-12">└── [Python ML Microservice] ── Relevance &amp; Embeddings</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <span className="font-bold text-white block">Structured Tool Calling</span>
            <p className="text-neutral-400">Models invoke strictly validated functions instead of guessing data.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <span className="font-bold text-white block">Hallucination Mitigation</span>
            <p className="text-neutral-400">Strict grounding against verified database records and system telemetry.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <span className="font-bold text-white block">Streaming Token UX</span>
            <p className="text-neutral-400">Low-latency progressive chunks for seamless user responsiveness.</p>
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
