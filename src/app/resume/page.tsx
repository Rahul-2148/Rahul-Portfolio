'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Printer, Mail, Sparkles, Download, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { TechIcon } from '@/components/ui/TechIcons';
import {
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  experience as defaultExperience,
  educations as defaultEducations,
  achievements as defaultAchievements,
  resumes as defaultResumes,
} from '@/lib/data/portfolio';
import { trackEvent } from '@/lib/analytics/tracker';
import { ResumeItem, Education, Achievement, Project, Experience } from '@/types';

export default function ResumePage() {
  const [resumesList, setResumesList] = useState<ResumeItem[]>(defaultResumes);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    defaultResumes.find((r) => r.isPrimary)?.id || defaultResumes[0]?.id || ''
  );
  const [eduList, setEduList] = useState<Education[]>(defaultEducations);
  const [achList, setAchList] = useState<Achievement[]>(defaultAchievements);
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [experienceList, setExperienceList] = useState<Experience[]>(defaultExperience);
  const [info, setInfo] = useState(defaultPersonalInfo);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.personalInfo) setInfo(json.data.personalInfo);
        if (json?.data?.educations && json.data.educations.length > 0) setEduList(json.data.educations);
        if (json?.data?.achievements && json.data.achievements.length > 0) setAchList(json.data.achievements);
        if (json?.data?.projects && json.data.projects.length > 0) setProjectsList(json.data.projects);
        if (json?.data?.experiences && json.data.experiences.length > 0) setExperienceList(json.data.experiences);
        if (json?.data?.resumes && json.data.resumes.length > 0) {
          setResumesList(json.data.resumes);
          const primary = json.data.resumes.find((r: ResumeItem) => r.isPrimary) || json.data.resumes[0];
          setSelectedResumeId(primary.id);
        }
      })
      .catch((err) => {
        console.warn('Live portfolio sync warning:', err);
      });
  }, []);

  const activeResume: ResumeItem | undefined =
    resumesList.find((r) => r.id === selectedResumeId) || resumesList[0];

  const handlePrint = () => {
    trackEvent('resume_download', { metadata: { source: 'resume_page_print' } });
    window.print();
  };

  const handleOpenModal = (resumeId?: string) => {
    window.dispatchEvent(new CustomEvent('open-resume-modal', { detail: { resumeId } }));
  };

  const handleDownloadActive = () => {
    if (!activeResume?.url) {
      window.dispatchEvent(new CustomEvent('open-resume-modal'));
      return;
    }

    trackEvent('resume_download', {
      metadata: {
        resumeId: activeResume.id,
        title: activeResume.title,
        category: activeResume.category,
      },
    });

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);

    const safeCat = (activeResume.category || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    const link = document.createElement('a');
    link.href = activeResume.url;
    link.download = `Rahul_Raj_${safeCat}_Resume.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-10 space-y-6">
      {/* Top Action Bar (Hidden on print) */}
      <div className="bg-surface border border-border p-4 rounded-2xl print:hidden shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Technical Curriculum Vitae</span>
          </div>

          <div className="flex items-center gap-2">
            {activeResume?.url ? (
              <>
                <button
                  onClick={handleDownloadActive}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-500/25 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {downloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {activeResume.category || 'CV'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenModal(activeResume.id)}
                  className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-foreground text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Preview in PDF modal viewer"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>PDF Viewer</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </button>
              </>
            ) : (
              <Link
                href="/contact"
                className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Request Custom PDF</span>
              </Link>
            )}

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-foreground text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Print standard ATS layout"
            >
              <Printer className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs if multiple resumes exist */}
        {resumesList.length > 1 && (
          <div
            data-lenis-prevent
            className="pt-2 border-t border-border/60 flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x overscroll-contain"
          >
            <span className="text-[11px] font-mono uppercase text-muted-foreground shrink-0 mr-1">
              Select Profile:
            </span>
            {resumesList.map((res) => {
              const isSelected = res.id === activeResume.id;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedResumeId(res.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'bg-surface-elevated hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  <span>{res.category || res.title}</span>
                  {res.isPrimary && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" title="Primary" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Resume Sheet */}
      <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 space-y-10 shadow-2xl text-foreground print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Header */}
        <div className="border-b border-border pb-8 space-y-3 print:border-neutral-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight print:text-black">
              {info.name}
            </h1>
            <span className="text-sm font-mono text-primary font-semibold print:text-neutral-700">
              {info.role} • {info.tagline}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground print:text-neutral-600">
            <a href={`mailto:${info.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>{info.email}</span>
            </a>
            <a href={info.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>github.com/Rahul-2148</span>
            </a>
            <span>Location: {info.location}</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed pt-2 print:text-neutral-800">
            {info.bio} Specialized in distributed multi-portal applications, low-latency WebSocket synchronization, MongoDB schema design, and AI model orchestration.
          </p>
        </div>

        {/* Technical Skills Matrix */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary font-bold print:text-neutral-900">
            Technical Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border print:border-neutral-200">
              <span className="text-muted-foreground block mb-1">Frontend:</span>
              <span className="text-foreground print:text-black">Next.js (App Router), React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Zustand</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border print:border-neutral-200">
              <span className="text-muted-foreground block mb-1">Backend:</span>
              <span className="text-foreground print:text-black">Node.js, Express, Python, REST APIs, JWT, Role-Based Access Control (RBAC)</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border print:border-neutral-200">
              <span className="text-muted-foreground block mb-1">Real-Time &amp; Data:</span>
              <span className="text-foreground print:text-black">Socket.IO, WebSockets, Redis (Pub/Sub &amp; Caching), MongoDB Atlas, Mongoose ODM</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border print:border-neutral-200">
              <span className="text-muted-foreground block mb-1">AI, Cloud &amp; Tools:</span>
              <span className="text-foreground print:text-black">Gemini API, Python ML, Docker, Razorpay, Stripe, Cloudinary, Git, GitHub Actions, Postman, Linux</span>
            </div>
          </div>
        </div>

        {/* Flagship Engineering Projects */}
        <div className="space-y-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary font-bold print:text-neutral-900">
            Flagship Production Systems
          </h2>

          <div className="space-y-6">
            {projectsList.slice(0, 3).map((p: Project) => (
              <div key={p.slug} className="space-y-2 border-l-2 border-border-accent pl-4 print:border-neutral-400">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-foreground print:text-black">
                    {p.name} — <span className="font-normal text-primary print:text-neutral-700">{p.tagline}</span>
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">{p.year}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed print:text-neutral-800">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.technologies.map((t: string) => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground print:border-neutral-300 print:text-neutral-700">
                      <TechIcon name={t} className="w-3 h-3 shrink-0 print:hidden" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary font-bold print:text-neutral-900">
            Professional Experience
          </h2>

          {experienceList.map((exp: Experience, idx: number) => (
            <div key={idx} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-foreground print:text-black">{exp.role}</h3>
                  <span className="text-xs font-mono text-primary print:text-neutral-700">{exp.company}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{exp.duration}</span>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground print:text-neutral-800">
                {exp.achievements.map((ach: string, aIdx: number) => (
                  <li key={aIdx} className="flex items-start gap-2">
                    <span className="text-primary print:text-black">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education & Academic Qualifications */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary font-bold print:text-neutral-900">
            Education &amp; Academic Credentials
          </h2>

          <div className="space-y-4">
            {eduList.length > 0 ? (
              eduList.map((edu: Education, idx: number) => (
                <div key={idx} className="space-y-1.5 border-l-2 border-primary/40 pl-3 print:border-neutral-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground print:text-black">
                      {edu.degree} — <span className="font-normal text-muted-foreground print:text-neutral-700">{edu.institution}</span>
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">{edu.duration}</span>
                  </div>
                  {edu.score && (
                    <div className="text-xs font-mono text-emerald-400 print:text-neutral-800 font-semibold">
                      {edu.score}
                    </div>
                  )}
                  {edu.achievements && (
                    <ul className="space-y-0.5 text-xs text-muted-foreground print:text-neutral-800">
                      {edu.achievements.map((item: string, aIdx: number) => (
                        <li key={aIdx}>• {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="space-y-1.5 border-l-2 border-primary/40 pl-3 print:border-neutral-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground print:text-black">
                    Bachelor of Technology (B.Tech) — <span className="font-normal text-muted-foreground print:text-neutral-700">Computer Science &amp; Engineering</span>
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">Technical Degree</span>
                </div>
                <p className="text-xs text-muted-foreground print:text-neutral-700">
                  Comprehensive grounding in Data Structures, Algorithms, Full-Stack Architecture, Operating Systems, and Distributed Computing.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Certifications & Key Competencies */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-primary font-bold print:text-neutral-900">
            Specialized Certifications &amp; Engineering Focus
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            {achList.length > 0 ? (
              achList.map((ach: Achievement) => (
                <div key={ach.id} className="p-3 rounded-xl bg-surface border border-border print:border-neutral-200">
                  <div className="font-bold text-foreground print:text-black">{ach.title}</div>
                  <div className="text-muted-foreground print:text-neutral-600 text-[11px]">{ach.issuer} • {ach.date}</div>
                </div>
              ))
            ) : (
              <>
                <div className="p-3 rounded-xl bg-surface border border-border print:border-neutral-200">
                  <div className="font-bold text-foreground print:text-black">Full-Stack Web Architecture</div>
                  <div className="text-muted-foreground print:text-neutral-600 text-[11px]">MERN Architecture &amp; Next.js SSR</div>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-border print:border-neutral-200">
                  <div className="font-bold text-foreground print:text-black">Real-Time Event Orchestration</div>
                  <div className="text-muted-foreground print:text-neutral-600 text-[11px]">Socket.IO &amp; WebSockets Synchronization</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
