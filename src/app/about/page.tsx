import React from 'react';
import Link from 'next/link';
import {
  User,
  Compass,
  ArrowUpRight,
  Code2,
  Cpu,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
} from 'lucide-react';
import { personalInfo as defaultPersonalInfo, educations as defaultEducations, achievements as defaultAchievements } from '@/lib/data/portfolio';
import { ResumeModalTrigger } from '@/components/interactive/ResumeModalTrigger';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PortfolioModel } from '@/lib/db/models/Portfolio';

// Use Incremental Static Regeneration (ISR) for instant sub-second page loads
export const revalidate = 60;

export const metadata = {
  title: 'About Rahul Raj — Systems Engineer',
  description:
    'Engineering philosophy, background, and approach to building resilient distributed systems by Rahul Raj.',
};

export default async function AboutPage() {
  let doc = null;
  try {
    await connectToDatabase();
    doc = await PortfolioModel.findOne({ docId: 'main' }).lean();
  } catch (err) {
    console.warn('DB connect error in AboutPage, falling back to static:', err);
  }

  const personalInfo = doc?.personalInfo || defaultPersonalInfo;
  const educations = (doc?.educations && doc.educations.length > 0) ? doc.educations : defaultEducations;
  const achievements = (doc?.achievements && doc.achievements.length > 0) ? doc.achievements : defaultAchievements;

  const engineeringFacts = [
    { label: 'Core Philosophy', value: 'Systems Over Frameworks' },
    { label: 'Specialization', value: 'AI × Product × Real-Time Systems' },
    { label: 'Event Latency', value: '< 50ms State Sync' },
    { label: 'Micro-Frontends', value: '5 Decoupled Portals (Zosh Bazaar)' },
  ];

  return (
    <div className="pt-1 sm:pt-2 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-12">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono">
          <User className="w-3.5 h-3.5 text-primary" />
          <span>Engineer Profile &amp; Mindset</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
          Engineering with Intent
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-3xl">
          I am <strong className="text-foreground">{personalInfo.name}</strong>, a Full-Stack Engineer based in India. I engineer high-concurrency event-driven web applications and distributed architectures where rigorous backend logic meets refined, accessible user interfaces.
        </p>
      </div>

      {/* Fast Technical Facts Grid */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-4 gap-4">
        {engineeringFacts.map((fact, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
              {fact.label}
            </span>
            <div className="text-sm sm:text-base font-bold text-foreground">{fact.value}</div>
          </div>
        ))}
      </div>

      {/* Short Story & Philosophy */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-primary" />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card border border-border hover:border-border-accent p-6 sm:p-8 rounded-2xl space-y-3 shadow-xs transition-colors">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span>1. Systems Over Frameworks</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Frameworks and UI libraries evolve rapidly, but underlying system fundamentals—concurrency, network boundaries, caching hierarchies, database indexing, and state machines—remain durable. I design architectures that withstand shifting tooling.
            </p>
          </div>

          <div className="bg-card border border-border hover:border-border-accent p-6 sm:p-8 rounded-2xl space-y-3 shadow-xs transition-colors">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span>2. Interface Craft Matters</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An extraordinarily engineered backend is ineffective if users struggle to understand the product. I treat frontend architecture, typography, micro-interactions, and accessibility as first-class engineering responsibilities.
            </p>
          </div>

          <div className="bg-card border border-border hover:border-border-accent p-6 sm:p-8 rounded-2xl space-y-3 shadow-xs transition-colors">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>3. Zero Fabricated Claims</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every system, metric, and repository in this portfolio is authentic. If a capability was experimental, it is labeled as experimental. Honest engineering creates real trust with teams and stakeholders.
            </p>
          </div>

          <div className="bg-card border border-border hover:border-border-accent p-6 sm:p-8 rounded-2xl space-y-3 shadow-xs transition-colors">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>4. Obsessive Performance</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From sub-50ms WebSocket room broadcasts in Socket.IO to statically pre-rendered Next.js routes and Turbopack builds, performance is not an afterthought; it is an active feature of everything I build.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================
          ACADEMIC BACKGROUND & EDUCATION SECTION
          ==================================================== */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span>Education &amp; Academic Credentials</span>
            </h2>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              Formal engineering foundations and continuous specialized coursework.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
            Accredited Degrees
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {educations.map((edu) => (
            <div
              key={edu.id || edu.degree}
              className="bg-card border border-border hover:border-primary/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {edu.degree}
                    </h3>
                    {edu.score && (
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        {edu.score}
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-primary font-mono">
                    {edu.institution}
                  </p>
                  {edu.field && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Department: {edu.field}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs font-mono text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated border border-border">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{edu.duration}</span>
                  </span>
                  {edu.location && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{edu.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="pt-3 border-t border-border/70 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                    Specializations &amp; Key Highlights:
                  </span>
                  <ul className="space-y-1.5 text-xs text-foreground/90 font-mono">
                    {edu.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================
          ACHIEVEMENTS, CERTIFICATIONS & HONORS
          ==================================================== */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
              <Award className="w-6 h-6 text-purple-400" />
              <span>Achievements &amp; Verified Honors</span>
            </h2>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              Industry certifications, hackathons, and competitive programming milestones.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/25 w-fit flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-card border border-border hover:border-purple-500/40 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs transition-all hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-purple-400 border border-purple-500/20">
                    {ach.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground pt-1">
                    {ach.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    Issued by <strong className="text-foreground">{ach.issuer}</strong> • {ach.date}
                  </p>
                </div>

                {ach.credentialUrl && (
                  <a
                    href={ach.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-surface-elevated hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="View Credential"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {ach.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ach.description}
                </p>
              )}

              {ach.skills && ach.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {ach.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Focus & Engineering Depth Card */}
      <div className="bg-surface-elevated border border-border-accent rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Current Focus &amp; What I Enjoy Engineering
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            • <strong className="text-foreground">Distributed Real-Time Platforms:</strong> Multi-role systems like Zosh Bazaar (5 micro-frontends with real-time driver dispatch) and Snapcart (sub-second geolocation sync via Socket.IO and Redis).
          </p>
          <p>
            • <strong className="text-foreground">Full-Lifecycle Applications:</strong> Taking products from database schema design (MongoDB/Mongoose) through backend REST/Socket APIs to responsive Next.js frontends.
          </p>
          <p>
            • <strong className="text-foreground">AI-Augmented Workflows:</strong> Practical machine learning microservices and LLM orchestrators that solve real user friction rather than superficial novelties.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href="/work"
            className="px-6 py-3.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span>Explore Engineering Work</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <ResumeModalTrigger
            className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated border border-purple-500/30 text-foreground font-mono text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>View &amp; Download CV</span>
          </ResumeModalTrigger>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <span>Get in Touch</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

