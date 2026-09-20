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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Engineering Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Selected Systems &amp; Products
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2">
            Every project below is an authentic, production-quality implementation with verified GitHub source code and real-world architectural design.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] p-1.5 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs shadow-cyan-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
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
              className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isFlagship
                  ? 'bg-gradient-to-b from-[#0f111a] to-[#090a10] border-cyan-500/30 hover:border-cyan-400/60 shadow-xl'
                  : 'bg-[#090910] border-white/[0.08] hover:border-white/20'
              }`}
              data-cursor="CASE STUDY"
            >
              {/* Subtle top glow line */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${project.color || '#00d4ff'}, transparent)`,
                }}
              />

              <div className="p-6 sm:p-8 space-y-6 flex-1">
                {/* Header info */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${project.color || '#00d4ff'}20`,
                        color: project.color || '#00d4ff',
                      }}
                    >
                      Tier {project.tier}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{project.category}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{project.year}</span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm font-medium text-cyan-400/90 font-mono mt-1">
                    {project.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Key Features bullet points */}
                {project.features && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                      Engineered Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-300 font-mono">
                      {project.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
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
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 7 && (
                    <span className="px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-neutral-500">
                      +{project.technologies.length - 7} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 sm:px-8 py-4 bg-black/40 border-t border-white/[0.06] flex items-center justify-between gap-4">
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-300 transition-colors group/link"
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
                      className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-colors"
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
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
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
