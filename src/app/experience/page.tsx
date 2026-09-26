import { Briefcase, Calendar, CheckCircle2, GraduationCap, Award, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { experience, educations, achievements } from '@/lib/data/portfolio';
import { TechIcon } from '@/components/ui/TechIcons';

export const metadata = {
  title: 'Engineering Experience & Milestones',
  description:
    'Chronological timeline of professional experience, responsibilities, and delivered systems by Rahul Raj.',
};

export default function ExperiencePage() {
  return (
    <div className="pt-1 sm:pt-2 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 sm:space-y-14">
      {/* Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          <span>Career Progression &amp; Milestones</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight">
          Experience &amp; Milestones
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          A track record of engineering, deploying, and maintaining production web applications, academic excellence, and technical achievements.
        </p>
      </div>

      {/* 1. Professional Work Experience Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 pb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Professional Engineering Roles
          </h2>
        </div>

        <div className="relative border-l border-border ml-4 pl-6 sm:pl-8 space-y-6 sm:space-y-8">
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-xs font-mono text-foreground font-medium"
                    >
                      <TechIcon name={t} className="w-3.5 h-3.5 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Education & Academic Qualifications */}
      {educations.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Education &amp; Academic Background
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              Formal Qualifications
            </span>
          </div>

          <div className="relative border-l border-border ml-4 pl-6 sm:pl-8 space-y-6 sm:space-y-8">
            {educations.map((edu, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform" />

                <div className="bg-card border border-border hover:border-border-accent rounded-2xl p-6 sm:p-8 space-y-3 transition-all shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{edu.degree}</h3>
                      <p className="text-sm font-semibold text-primary font-mono">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1 bg-surface-elevated px-3 py-1 rounded-full border border-border">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{edu.duration}</span>
                      </span>
                    </div>
                  </div>

                  {edu.score && (
                    <div className="inline-block text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      {edu.score}
                    </div>
                  )}

                  {edu.location && (
                    <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{edu.location}</span>
                    </div>
                  )}

                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="space-y-1 text-xs text-muted-foreground font-mono pt-2">
                      {edu.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Achievements & Certifications */}
      {achievements.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Certifications &amp; Engineering Honors
              </h2>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/25 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-card border border-border hover:border-purple-500/40 rounded-2xl p-5 space-y-2.5 shadow-xs transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-purple-400 border border-purple-500/20">
                      {ach.category}
                    </span>
                    <h3 className="text-sm font-bold text-foreground pt-1">{ach.title}</h3>
                    <p className="text-xs font-mono text-muted-foreground">{ach.issuer} • {ach.date}</p>
                  </div>
                  {ach.credentialUrl && (
                    <a
                      href={ach.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-surface-elevated hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                {ach.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{ach.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

