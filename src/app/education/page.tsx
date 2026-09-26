'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Trophy,
  Download,
  BookOpen,
  Star,
  Check,
} from 'lucide-react';
import { educations as defaultEducations, achievements as defaultAchievements } from '@/lib/data/portfolio';
import { Education, Achievement } from '@/types';

export default function EducationPage() {
  const [eduList, setEduList] = useState<Education[]>(defaultEducations);
  const [achList, setAchList] = useState<Achievement[]>(defaultAchievements);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
      })
      .catch((err) => {
        console.warn('Live education sync error:', err);
      });
  }, []);

  const triggerResumeModal = () => {
    window.dispatchEvent(new CustomEvent('open-resume-modal'));
  };

  const filteredAchievements =
    selectedCategory === 'all'
      ? achList
      : achList.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="pt-2 sm:pt-4 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-mono font-medium">
          <GraduationCap className="w-4 h-4" />
          <span>ACADEMIC FOUNDATION &amp; RECOGNITION</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight">
              Education &amp; <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Credentials</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-mono leading-relaxed">
              Formal computer science foundations, accredited engineering degrees, distinction milestones, and verified industry credentials.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={triggerResumeModal}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-purple-200" />
              <span>Download CV</span>
              <Download className="w-3.5 h-3.5 text-cyan-200" />
            </button>

            <Link
              href="/resume"
              className="px-4 py-2.5 rounded-full bg-surface hover:bg-surface-elevated border border-border text-foreground font-mono text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>ATS Sheet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs relative overflow-hidden">
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
            Primary Degree
          </span>
          <div className="text-base sm:text-lg font-bold text-foreground">B.Tech in CSE</div>
          <div className="text-xs font-mono text-emerald-400 font-semibold">Distinction (8.8+ CGPA)</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs relative overflow-hidden">
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
            Core Specialization
          </span>
          <div className="text-base sm:text-lg font-bold text-cyan-400">Distributed &amp; Real-Time</div>
          <div className="text-xs font-mono text-muted-foreground">Systems Architecture</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs relative overflow-hidden">
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
            Honors &amp; Milestones
          </span>
          <div className="text-base sm:text-lg font-bold text-foreground">{achList.length}+ Verified</div>
          <div className="text-xs font-mono text-purple-400 font-semibold">Certifications &amp; Awards</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs relative overflow-hidden">
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">
            Technical Domain
          </span>
          <div className="text-base sm:text-lg font-bold text-emerald-400">Full-Stack</div>
          <div className="text-xs font-mono text-muted-foreground">Engineering &amp; Architecture</div>
        </div>
      </div>

      {/* ====================================================
          SECTION 1: FORMAL EDUCATION & DEGREES
          ==================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-foreground flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-primary" />
              <span>Academic Degrees &amp; Coursework</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
              Accredited university programs and foundational computer engineering curriculum.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
            {eduList.length} Program{eduList.length > 1 ? 's' : ''} Documented
          </span>
        </div>

        {eduList.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-dashed border-border text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-muted-foreground/60 mx-auto stroke-1" />
            <h3 className="text-base font-semibold text-foreground font-mono">Academic Records Being Synchronized</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-md mx-auto">
              Formal academic credentials and degree documentation are currently being synchronized. Feel free to request verified documentation directly via the contact page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {eduList.map((edu, idx) => (
              <div
                key={edu.id || idx}
                className="p-6 sm:p-8 rounded-3xl bg-card border border-border hover:border-purple-500/40 backdrop-blur-sm transition-all shadow-sm hover:shadow-xl hover:shadow-purple-500/5 group relative overflow-hidden space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {edu.degree}
                      </h3>
                      {edu.score && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{edu.score}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-base font-semibold text-primary font-mono">
                      {edu.institution}
                    </div>
                    {edu.field && (
                      <div className="text-xs sm:text-sm text-muted-foreground font-mono">
                        Department: {edu.field}
                      </div>
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
                  <div className="pt-4 border-t border-border/70 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span>Specializations, Core Competencies &amp; Projects:</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-foreground/90 font-mono">
                      {edu.achievements.map((item, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2.5 p-2 rounded-xl bg-surface/60 border border-border/50">
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
        )}
      </div>

      {/* ====================================================
          SECTION 2: VERIFIED ACHIEVEMENTS & CERTIFICATIONS
          ==================================================== */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-foreground flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Honors, Certifications &amp; Milestones</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
              Competitive coding milestones, hackathon awards, and verified technical credentials.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'certification', 'hackathon', 'milestone', 'award'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-surface hover:bg-muted text-muted-foreground border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredAchievements.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-dashed border-border text-center space-y-3">
            <Trophy className="w-10 h-10 text-muted-foreground/60 mx-auto stroke-1" />
            <h3 className="text-base font-semibold text-foreground font-mono">No Certifications / Honors Listed Yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-md mx-auto">
              Verified certifications, technical achievements, and honors are currently being compiled. Inquiries and verification details are welcome via the contact page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-amber-500/40 backdrop-blur-sm transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/5 group space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-amber-400 border border-amber-500/20">
                        {ach.category}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {ach.date}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-amber-400 transition-colors pt-0.5">
                      {ach.title}
                    </h3>
                    <p className="text-xs font-mono text-primary font-semibold">
                      {ach.issuer}
                    </p>
                  </div>

                  {(ach.credentialUrl || ach.url) && (
                    <a
                      href={ach.credentialUrl || ach.url}
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
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    {ach.description}
                  </p>
                )}

                {ach.skills && ach.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ach.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====================================================
          SECTION 3: TAILORED CV VAULT CALLOUT BANNER
          ==================================================== */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-950/40 via-surface to-slate-900 border border-purple-500/30 space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono">
              <Star className="w-3.5 h-3.5 fill-purple-300" />
              <span>OFFICIAL RESUMES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Looking for a tailored CV for your team?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              Preview and download official resumes directly in high resolution.
            </p>
          </div>

          <button
            onClick={triggerResumeModal}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-mono text-xs font-bold transition-all shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 flex items-center gap-2.5 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Open Multi-Resume Vault</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
