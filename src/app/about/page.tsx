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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono">
          <User className="w-3.5 h-3.5 text-primary" />
          <span>Engineer Profile</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
          Engineering with Intent
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          I am Rahul Raj, a Full-Stack Engineer based in India. I bridge the gap between rigorous systems engineering and polished, intuitive user interfaces.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
            <h3 className="text-lg font-bold text-foreground">1. Systems Over Frameworks</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tools change rapidly, but fundamental principles—concurrency, network boundaries, caching hierarchies, and database indexing—remain durable. I design architectures that withstand shifting tooling.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
            <h3 className="text-lg font-bold text-foreground">2. Interface Craft Matters</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An extraordinarily engineered backend is ineffective if users struggle to understand the product. I treat frontend architecture, typography, micro-interactions, and accessibility as first-class engineering responsibilities.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
            <h3 className="text-lg font-bold text-foreground">3. Zero Fabrications</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every system, metric, and repository in this portfolio is authentic. If a capability was experimental, it is labeled as experimental. Honest engineering creates trust.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-3 shadow-xs">
            <h3 className="text-lg font-bold text-foreground">4. Obsessive Performance</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From sub-second WebSocket broadcasts to statically pre-rendered Next.js routes and Turbopack builds, performance is not an afterthought; it is an active feature.
            </p>
          </div>
        </div>
      </div>

      {/* What I Love Building */}
      <div className="bg-surface-elevated border border-border-accent rounded-2xl p-8 sm:p-10 space-y-6 shadow-md">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          What I Enjoy Engineering Most
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            • <strong className="text-foreground">Distributed Real-Time Platforms:</strong> Multi-role systems like Zosh Bazaar (5 micro-frontends with real-time driver dispatch) and Snapcart (sub-second geolocation sync via Socket.IO and Redis).
          </p>
          <p>
            • <strong className="text-foreground">Full-Lifecycle Applications:</strong> Taking products from database schema design (MongoDB/Mongoose) through backend REST/Socket APIs to responsive Next.js/React frontends.
          </p>
          <p>
            • <strong className="text-foreground">AI-Augmented Workflows:</strong> Practical machine learning microservices and LLM orchestrators that solve real user friction rather than superficial gimmicks.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href="/work"
            className="px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span>Explore Engineering Work</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <span>Get in Touch</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
