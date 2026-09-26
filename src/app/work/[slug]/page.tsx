import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Image as ImageIcon,
  BookOpen,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { TechIcon } from '@/components/ui/TechIcons';
import { getProjectBySlug } from '@/lib/data/getProject';

import { projects as staticProjects } from '@/lib/data/portfolio';

// Enable ISR revalidation for instant cached case study loads
export const revalidate = 60;

export async function generateStaticParams() {
  return staticProjects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, true);
  if (!project) return { title: 'Project Not Found | Rahul Raj' };
  return {
    title: `${project.name} | Architecture & Case Study | Rahul Raj`,
    description: project.description || project.tagline,
  };
}

export default async function ProjectCaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const project = await getProjectBySlug(slug, isPreview);

  if (!project) {
    notFound();
  }

  const isDraft = project.status === 'draft' || project.status === 'archived';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-12 space-y-8 sm:space-y-10">
      {/* Draft / Preview Banner */}
      {isDraft && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>ADMIN PREVIEW MODE:</strong> This project is currently marked as{' '}
              <span className="uppercase font-bold">{project.status}</span>. It is hidden from the public portfolio.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
          >
            Edit in Admin Studio →
          </Link>
        </div>
      )}

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
          {project.vendorModel && (
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              {project.vendorModel}
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
          <span className="text-xs font-mono text-primary font-semibold">Role: {project.role}</span>
          {project.featured && (
            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold">
              FEATURED
            </span>
          )}
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

        {/* Architecture & Vendor Topology Banner */}
        {(project.vendorModel || (project.portalsList && project.portalsList.length > 0)) && (
          <div className="p-4 sm:p-5 rounded-2xl bg-surface/70 border border-border/80 space-y-3 max-w-4xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
              <span className="text-xs font-mono text-foreground font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Architecture &amp; Vendor Model:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {project.vendorModel || project.type}
                </span>
              </span>
              {project.portalsList && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  {project.portalsCount || project.portalsList.length} Connected Portals / Actor Interfaces
                </span>
              )}
            </div>

            {project.portalsList && project.portalsList.length > 0 && (
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
                  Decoupled System Interfaces &amp; Roles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.portalsList.map((portal, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-foreground/90 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>{portal}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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

          {project.isPrivate && (
            <span className="px-4 py-2.5 rounded-xl bg-muted border border-border text-xs font-mono text-muted-foreground">
              🔒 Private Enterprise Codebase
            </span>
          )}
        </div>
      </div>

      {/* Gallery Screenshots (if available) */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>Project Media &amp; Screenshots</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((imgUrl, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border bg-card group relative aspect-video flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`${project.name} screenshot ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies Deployed */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Technologies &amp; Protocols Deployed
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-foreground font-medium"
            >
              <TechIcon name={tech} className="w-4 h-4 shrink-0" />
              <span>{tech}</span>
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

      {/* Case Study Details (if available) */}
      {project.caseStudyContent && (project.caseStudyContent.problem || project.caseStudyContent.solutions) && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Deep Dive Case Study</span>
          </div>

          {project.caseStudyContent.problem && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold font-mono text-foreground uppercase">Problem Statement &amp; Challenges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.caseStudyContent.problem}
              </p>
            </div>
          )}

          {project.caseStudyContent.solutions && (
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="text-sm font-bold font-mono text-foreground uppercase">Architectural Solution &amp; Execution</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.caseStudyContent.solutions}
              </p>
            </div>
          )}

          {project.caseStudyContent.lessonsLearned && project.caseStudyContent.lessonsLearned.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="text-sm font-bold font-mono text-foreground uppercase">Key Outcomes &amp; Takeaways</h3>
              <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground">
                {project.caseStudyContent.lessonsLearned.map((lesson, idx) => (
                  <li key={idx}>{lesson}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Engineering Challenges & Solutions */}
      {project.challenges && project.challenges.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Engineering Challenges</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Complex Bottlenecks Solved
          </h2>
          <div className="space-y-4">
            {project.challenges.map((challenge, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm"
              >
                <h3 className="text-lg font-bold text-foreground">{challenge.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1 bg-surface-elevated/40 p-3.5 rounded-xl border border-border">
                    <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">Problem</span>
                    <p className="text-muted-foreground">{challenge.problem}</p>
                  </div>
                  <div className="space-y-1 bg-surface-elevated/40 p-3.5 rounded-xl border border-border">
                    <span className="font-mono text-primary font-bold uppercase text-[10px]">Solution</span>
                    <p className="text-muted-foreground">{challenge.solution}</p>
                  </div>
                  <div className="space-y-1 bg-surface-elevated/40 p-3.5 rounded-xl border border-border">
                    <span className="font-mono text-emerald-400 font-bold uppercase text-[10px]">Impact</span>
                    <p className="text-muted-foreground">{challenge.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified System Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Production Verification</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {project.metrics.map((metric, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 shadow-sm"
              >
                <div className="text-2xl sm:text-3xl font-black text-primary font-mono">
                  {metric.value}
                </div>
                <div className="text-xs font-mono text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
