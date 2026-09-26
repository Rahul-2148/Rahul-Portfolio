'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Trophy,
} from 'lucide-react';
import { educations as defaultEducations, achievements as defaultAchievements } from '@/lib/data/portfolio';
import { Education, Achievement } from '@/types';

export function EducationAchievements() {
  const [eduList, setEduList] = useState<Education[]>(defaultEducations || []);
  const [achList, setAchList] = useState<Achievement[]>(defaultAchievements || []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.educations && Array.isArray(json.data.educations)) {
          setEduList(json.data.educations);
        }
        if (json?.data?.achievements && Array.isArray(json.data.achievements)) {
          setAchList(json.data.achievements);
        }
        setLoaded(true);
      })
      .catch((err) => {
        console.warn('Live education sync error:', err);
        setLoaded(true);
      });
  }, []);

  const triggerResumeModal = () => {
    window.dispatchEvent(new CustomEvent('open-resume-modal'));
  };

  // If no education or achievement credentials in database, cleanly hide from homepage
  if (loaded && eduList.length === 0 && achList.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-20 sm:py-28 relative overflow-hidden bg-background">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>ACADEMIC FOUNDATION &amp; RECOGNITION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Education &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400">Achievements</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-mono leading-relaxed">
              Rigorous computer science curriculum, formal engineering principles, and competitive algorithmic milestones.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={triggerResumeModal}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-500/25 flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </button>
            <Link
              href="/education"
              className="px-4 py-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <span>All Qualifications</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/resume"
              className="px-4 py-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <span>ATS Sheet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Dual Grid: Education on Left, Achievements on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Education Credentials (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold font-mono text-foreground flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Academic Degrees &amp; Coursework</span>
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {eduList.length} Program{eduList.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-5">
              {eduList.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="p-6 sm:p-7 rounded-3xl bg-card/80 border border-border hover:border-purple-500/40 backdrop-blur-sm transition-all shadow-sm hover:shadow-xl hover:shadow-purple-500/5 group relative overflow-hidden space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {edu.degree}
                        </h4>
                        {edu.score && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                            {edu.score}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-primary font-mono">
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
                    <div className="pt-3 border-t border-border/60 space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                        Core Competencies &amp; Focus:
                      </span>
                      <ul className="space-y-1.5 text-xs text-foreground/90 font-mono">
                        {edu.achievements.map((item, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
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

          {/* Right Column: Achievements & Certifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold font-mono text-foreground flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Honors &amp; Milestones</span>
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {achList.length} Verified
              </span>
            </div>

            <div className="space-y-3.5">
              {achList.map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="p-5 rounded-2xl bg-card/80 border border-border hover:border-amber-500/40 backdrop-blur-sm transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/5 group space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-amber-400 transition-colors">
                          {ach.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-muted-foreground border border-border">
                          {ach.category}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-primary font-semibold">
                        {ach.issuer}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground shrink-0 px-2 py-0.5 rounded bg-surface border border-border">
                      {ach.date}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    {ach.description}
                  </p>

                  {(ach.credentialUrl || ach.url) && (
                    <div className="pt-1">
                      <a
                        href={ach.credentialUrl || ach.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                      >
                        <span>View Certificate Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick CV Highlight Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-surface to-slate-900 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm text-foreground">Need a Tailored Resume?</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                Choose between Full-Stack IT, Core Backend &amp; Distributed Systems, or AI Engineering resumes tailored to your role.
              </p>
              <button
                onClick={triggerResumeModal}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Multi-Profile Resume Vault</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
