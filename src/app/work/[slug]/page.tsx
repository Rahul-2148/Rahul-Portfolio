import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { projects } from '@/lib/data/portfolio';

export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Back button */}
      <Link
        href="/work"
        className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all projects</span>
      </Link>

      {/* Project Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${project.color || 'var(--primary)'}20`,
              color: project.color || 'var(--primary)',
            }}
          >
            Tier {project.tier} • {project.category}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
          <span className="text-xs font-mono text-primary font-semibold">Role: {project.role}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
          {project.name}
        </h1>

        <p className="text-xl text-primary font-mono">
          {project.tagline}
        </p>

        <p className="text-base sm:text-lg text-muted-foreground max-w-4xl leading-relaxed">
          {project.description}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-foreground text-xs font-mono flex items-center gap-2 transition-all shadow-xs"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Inspect Source Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <span>Launch Live System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Technologies Deployed */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Technologies &amp; Protocols Deployed
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Architecture Section (if available) */}
      {project.architecture && project.architecture.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Distributed System Topology</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Component Architecture &amp; Service Boundaries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.architecture.map((node) => (
              <div
                key={node.id}
                className="p-5 rounded-2xl bg-card border border-border hover:border-border-accent space-y-3 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-primary font-bold uppercase">{node.label}</span>
                  <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground uppercase border border-border">
                    {node.type}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground">{node.technology}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
                {node.connections && node.connections.length > 0 && (
                  <div className="pt-2 border-t border-border text-[10px] font-mono text-muted-foreground">
                    Connects to: {node.connections.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features & Engineered Capabilities */}
      {project.features && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Engineered Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground font-mono">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span>Engineering Challenges &amp; Technical Solutions</span>
          </h2>
          <div className="space-y-6">
            {project.challenges.map((c, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-surface-elevated border border-border-accent space-y-4 shadow-md"
              >
                <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs font-mono text-destructive uppercase tracking-wider block font-semibold">Problem Context:</span>
                    <p className="text-muted-foreground mt-1">{c.problem}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-primary uppercase tracking-wider block font-semibold">Engineered Solution:</span>
                    <p className="text-muted-foreground mt-1">{c.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider block font-semibold">Architectural Impact:</span>
                    <p className="text-muted-foreground mt-1">{c.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architectural Decisions */}
      {project.decisions && project.decisions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Key Architectural Decisions
          </h2>
          <div className="space-y-6">
            {project.decisions.map((d, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-4 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <h3 className="text-base font-bold text-foreground">{d.problem}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-surface border border-border">
                    <span className="text-muted-foreground uppercase block mb-1">Evaluated Options:</span>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {d.options.map((opt, oIdx) => (
                        <li key={oIdx}>{opt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/10 border border-border-accent">
                    <span className="text-primary uppercase block mb-1 font-semibold">Chosen Decision:</span>
                    <p className="text-foreground font-semibold">{d.decision}</p>
                    <p className="text-muted-foreground mt-1">{d.tradeoff}</p>
                  </div>
                </div>

                <div className="text-xs font-mono text-emerald-500 pt-1 font-semibold">
                  <span>Result: {d.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
