'use client';

import React from 'react';
import { Printer, Mail, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { personalInfo, projects, experience } from '@/lib/data/portfolio';

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between bg-[#090910] border border-white/[0.08] p-4 rounded-2xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <Sparkles className="w-4 h-4" />
          <span>Curated Technical Resume</span>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center gap-2 transition-colors shadow-md shadow-cyan-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Main Resume Sheet */}
      <div className="bg-[#0b0b12] border border-white/[0.08] rounded-2xl p-8 sm:p-12 space-y-10 shadow-2xl text-neutral-200 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Header */}
        <div className="border-b border-white/10 pb-8 space-y-3 print:border-neutral-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight print:text-black">
              {personalInfo.name}
            </h1>
            <span className="text-sm font-mono text-cyan-400 font-semibold print:text-neutral-700">
              {personalInfo.role} • {personalInfo.tagline}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 print:text-neutral-600">
            <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:text-cyan-300">
              <Mail className="w-3.5 h-3.5" />
              <span>{personalInfo.email}</span>
            </a>
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-cyan-300">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>github.com/Rahul-2148</span>
            </a>
            <span>Location: {personalInfo.location}</span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed pt-2 print:text-neutral-800">
            {personalInfo.bio} Specialized in distributed multi-portal applications, low-latency WebSocket synchronization, MongoDB schema design, and AI model orchestration.
          </p>
        </div>

        {/* Technical Skills Matrix */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold print:text-neutral-900">
            Technical Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] print:border-neutral-200">
              <span className="text-neutral-400 block mb-1">Frontend:</span>
              <span className="text-white print:text-black">Next.js (App Router), React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Zustand</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] print:border-neutral-200">
              <span className="text-neutral-400 block mb-1">Backend:</span>
              <span className="text-white print:text-black">Node.js, Express, Python, REST APIs, JWT, Role-Based Access Control (RBAC)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] print:border-neutral-200">
              <span className="text-neutral-400 block mb-1">Real-Time &amp; Data:</span>
              <span className="text-white print:text-black">Socket.IO, WebSockets, Redis (Pub/Sub &amp; Caching), MongoDB Atlas, Mongoose ODM</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] print:border-neutral-200">
              <span className="text-neutral-400 block mb-1">AI, Cloud &amp; Tools:</span>
              <span className="text-white print:text-black">Gemini API, Python ML, Docker, Razorpay, Stripe, Cloudinary, Git, Oxlint (Rust)</span>
            </div>
          </div>
        </div>

        {/* Flagship Engineering Projects */}
        <div className="space-y-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold print:text-neutral-900">
            Flagship Production Systems
          </h2>

          <div className="space-y-6">
            {projects.slice(0, 3).map((p) => (
              <div key={p.slug} className="space-y-2 border-l-2 border-cyan-500/40 pl-4 print:border-neutral-400">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white print:text-black">
                    {p.name} — <span className="font-normal text-cyan-400 print:text-neutral-700">{p.tagline}</span>
                  </h3>
                  <span className="text-xs font-mono text-neutral-500">{p.year}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed print:text-neutral-800">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 text-[10px] font-mono text-neutral-300 print:border-neutral-300 print:text-neutral-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold print:text-neutral-900">
            Professional Experience
          </h2>

          {experience.map((exp, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white print:text-black">{exp.role}</h3>
                  <span className="text-xs font-mono text-cyan-400 print:text-neutral-700">{exp.company}</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">{exp.duration}</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-300 print:text-neutral-800">
                {exp.achievements.map((ach, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2">
                    <span className="text-cyan-400 print:text-black">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
