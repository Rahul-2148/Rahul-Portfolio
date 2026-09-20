import Link from 'next/link';
import { User, Compass, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'About Rahul Raj',
  description:
    'Engineering philosophy, background, and approach to building software systems by Rahul Raj.',
};

export default function AboutPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <User className="w-3.5 h-3.5" />
          <span>Engineer Profile</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Engineering with Intent
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
          I am Rahul Raj, a Full-Stack Engineer based in India. I bridge the gap between rigorous systems engineering and polished, intuitive user interfaces.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#090910] border border-white/[0.08] p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white">1. Systems Over Frameworks</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Tools change rapidly, but fundamental principles—concurrency, network boundaries, caching hierarchies, and database indexing—remain durable. I design architectures that withstand shifting tooling.
            </p>
          </div>

          <div className="bg-[#090910] border border-white/[0.08] p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white">2. Interface Craft Matters</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              An extraordinarily engineered backend is ineffective if users struggle to understand the product. I treat frontend architecture, typography, micro-interactions, and accessibility as first-class engineering responsibilities.
            </p>
          </div>

          <div className="bg-[#090910] border border-white/[0.08] p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white">3. Zero Fabrications</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every system, metric, and repository in this portfolio is authentic. If a capability was experimental, it is labeled as experimental. Honest engineering creates trust.
            </p>
          </div>

          <div className="bg-[#090910] border border-white/[0.08] p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white">4. Obsessive Performance</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              From sub-second WebSocket broadcasts to statically pre-rendered Next.js routes and Turbopack builds, performance is not an afterthought; it is an active feature.
            </p>
          </div>
        </div>
      </div>

      {/* What I Love Building */}
      <div className="bg-[#0b0b14] border border-cyan-500/20 rounded-2xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          What I Enjoy Engineering Most
        </h2>
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            • <strong className="text-white">Distributed Real-Time Platforms:</strong> Multi-role systems like Zosh Bazaar (5 micro-frontends with real-time driver dispatch) and Snapcart (sub-second geolocation sync via Socket.IO and Redis).
          </p>
          <p>
            • <strong className="text-white">Full-Lifecycle Applications:</strong> Taking products from database schema design (MongoDB/Mongoose) through backend REST/Socket APIs to responsive Next.js/React frontends.
          </p>
          <p>
            • <strong className="text-white">AI-Augmented Workflows:</strong> Practical machine learning microservices and LLM orchestrators that solve real user friction rather than superficial gimmicks.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href="/work"
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs font-mono flex items-center gap-2 transition-all"
          >
            <span>Explore Engineering Work</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-xs flex items-center gap-2 transition-all"
          >
            <span>Get in Touch</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
