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
        className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-cyan-400 transition-colors"
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
              backgroundColor: `${project.color || '#00d4ff'}20`,
              color: project.color || '#00d4ff',
            }}
          >
            Tier {project.tier} • {project.category}
          </span>
          <span className="text-xs font-mono text-neutral-500">{project.year}</span>
          <span className="text-xs font-mono text-cyan-300">Role: {project.role}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          {project.name}
        </h1>

        <p className="text-xl text-cyan-400 font-mono">
          {project.tagline}
        </p>

        <p className="text-base sm:text-lg text-neutral-300 max-w-4xl leading-relaxed">
          {project.description}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white text-xs font-mono flex items-center gap-2 transition-all"
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
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Launch Live System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Technologies Deployed */}
      <div className="bg-[#090910] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-400">
          Technologies &amp; Protocols Deployed
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Architecture Section (if available) */}
      {project.architecture && project.architecture.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Distributed System Topology</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Component Architecture &amp; Service Boundaries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.architecture.map((node) => (
              <div
                key={node.id}
                className="p-5 rounded-2xl bg-[#090910] border border-white/[0.08] hover:border-cyan-500/30 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-300 font-bold uppercase">{node.label}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-neutral-400 uppercase">
                    {node.type}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500">{node.technology}</p>
                <p className="text-xs text-neutral-300 leading-relaxed">{node.description}</p>
                {node.connections && node.connections.length > 0 && (
                  <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-500">
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
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Engineered Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#090910] border border-white/[0.06]"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300 font-mono">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Challenges */}
      {project.challenges && project.challenges.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Engineering Challenges &amp; Technical Solutions</span>
          </h2>
          <div className="space-y-6">
            {project.challenges.map((c, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#0b0b14] border border-cyan-500/20 space-y-4"
              >
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block">Problem Context:</span>
                    <p className="text-neutral-300 mt-1">{c.problem}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Engineered Solution:</span>
                    <p className="text-neutral-300 mt-1">{c.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">Architectural Impact:</span>
                    <p className="text-neutral-300 mt-1">{c.impact}</p>
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
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Key Architectural Decisions
          </h2>
          <div className="space-y-6">
            {project.decisions.map((d, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#090910] border border-white/[0.08] space-y-4"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <h3 className="text-base font-bold text-white">{d.problem}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-neutral-500 uppercase block mb-1">Evaluated Options:</span>
                    <ul className="list-disc list-inside text-neutral-400 space-y-1">
                      {d.options.map((opt, oIdx) => (
                        <li key={oIdx}>{opt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <span className="text-cyan-400 uppercase block mb-1">Chosen Decision:</span>
                    <p className="text-white font-semibold">{d.decision}</p>
                    <p className="text-neutral-400 mt-1">{d.tradeoff}</p>
                  </div>
                </div>

                <div className="text-xs font-mono text-emerald-400 pt-1">
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
