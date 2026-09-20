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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          <span>Career Progression</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
          Experience &amp; Milestones
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          A track record of engineering, deploying, and maintaining production web applications and distributed backends.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-border ml-4 pl-6 sm:pl-8 space-y-12">
        {experience.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform" />

            <div className="bg-card border border-border hover:border-border-accent rounded-2xl p-6 sm:p-8 space-y-4 transition-all shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">{item.role}</h3>
                  <p className="text-sm font-semibold text-primary font-mono mt-0.5">{item.company}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-surface-elevated px-3 py-1 rounded-full border border-border">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              {/* Achievements */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                  Delivered Engineering Milestones:
                </span>
                <ul className="space-y-2 text-xs text-foreground font-mono">
                  {item.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="border-t border-border pt-4 flex flex-wrap gap-2">
                {item.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-xs font-mono text-foreground"
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
