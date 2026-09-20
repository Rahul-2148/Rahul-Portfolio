import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { experience } from '@/lib/data/portfolio';

export const metadata = {
  title: 'Engineering Experience & Milestones',
  description:
    'Chronological timeline of professional experience, responsibilities, and delivered systems by Rahul Raj.',
};

export default function ExperiencePage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Career Progression</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Experience &amp; Milestones
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
          A track record of engineering, deploying, and maintaining production web applications and distributed backends.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-white/10 ml-4 pl-6 sm:pl-8 space-y-12">
        {experience.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#050508] border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

            <div className="bg-[#090910] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-4 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{item.role}</h3>
                  <p className="text-sm font-semibold text-cyan-400 font-mono mt-0.5">{item.company}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {item.description}
              </p>

              {/* Achievements */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block">
                  Delivered Engineering Milestones:
                </span>
                <ul className="space-y-2 text-xs text-neutral-300 font-mono">
                  {item.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="border-t border-white/[0.06] pt-4 flex flex-wrap gap-2">
                {item.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
