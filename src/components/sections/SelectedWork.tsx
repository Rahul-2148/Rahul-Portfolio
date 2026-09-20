'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { projects } from '@/lib/data/portfolio';

export function SelectedWork() {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'flagship', label: 'Tier S Flagships' },
    { id: 'E-commerce', label: 'E-Commerce' },
    { id: 'Realtime', label: 'Real-Time' },
    { id: 'Social', label: 'Social Platform' },
    { id: 'Full Stack', label: 'Full Stack' },
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'flagship') return project.tier === 'S';
    return project.category === filter;
  });

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Curated Engineering Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Selected Systems &amp; Products
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
            Every project below is an authentic, production-quality implementation with verified GitHub source code and real-world architectural design.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface border border-border p-1.5 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === cat.id
                  ? 'bg-primary/20 text-primary border border-border-accent font-bold shadow-xs shadow-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => {
          const isFlagship = project.tier === 'S';
          return (
            <div
              key={project.slug}
              className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg card-ambient-glow ${
                isFlagship
                  ? 'bg-card border-border-accent hover:border-primary shadow-xl'
                  : 'bg-card border-border hover:border-border-accent'
              }`}
              data-cursor="CASE STUDY"
            >
              {/* Subtle top glow line */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${project.color || 'var(--primary)'}, transparent)`,
                }}
              />

              <div className="p-6 sm:p-8 space-y-6 flex-1">
                {/* Header info */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${project.color || 'var(--primary)'}20`,
                        color: project.color || 'var(--primary)',
                      }}
                    >
                      Tier {project.tier}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{project.category}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm font-medium text-primary font-mono mt-1">
                    {project.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Key Features bullet points */}
                {project.features && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Engineered Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-foreground font-mono">
                      {project.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.slice(0, 7).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 7 && (
                    <span className="px-2 py-1 rounded-lg bg-muted border border-border text-[11px] font-mono text-muted-foreground">
                      +{project.technologies.length - 7} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 sm:px-8 py-4 bg-surface/80 border-t border-border flex items-center justify-between gap-4">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors group/link"
                >
                  <span>Explore Architecture &amp; Case Study</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>

                <div className="flex items-center gap-3">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-surface-elevated hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                      title="GitHub Repository"
                      data-cursor="CODE"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}

                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-primary/15 hover:bg-primary/25 border border-border-accent text-primary transition-colors"
                      title="Live Production Demo"
                      data-cursor="LIVE"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default SelectedWork;
