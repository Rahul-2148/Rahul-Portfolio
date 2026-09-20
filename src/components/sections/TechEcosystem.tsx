'use client';

import React, { useState } from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { skills } from '@/lib/data/portfolio';

export function TechEcosystem() {
  const [selectedSkillName, setSelectedSkillName] = useState<string>('Next.js');

  const selectedSkill = skills.find((s) => s.name === selectedSkillName) || skills[0];

  const categories = ['Frontend', 'Backend', 'Database', 'Realtime', 'AI', 'Cloud', 'DevOps'];

  return (
    <section id="engineering" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Technical Domain Competence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Engineering Ecosystem &amp; Stack
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2">
          Click any technology to inspect the architectural reasoning, experience depth, and real systems where it was deployed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Categorized Skills Cloud */}
        <div className="lg:col-span-8 bg-[#090910] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-8">
          {categories.map((category) => {
            const catSkills = skills.filter((s) => s.category === category);
            if (catSkills.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                    {category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {catSkills.map((skill) => {
                    const isSelected = selectedSkill.name === skill.name;
                    return (
                      <button
                        key={skill.name}
                        onClick={() => setSelectedSkillName(skill.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10 scale-[1.03]'
                            : 'bg-white/[0.03] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/20'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <span>{skill.name}</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            skill.level === 'core'
                              ? 'bg-emerald-400'
                              : skill.level === 'proficient'
                              ? 'bg-cyan-400'
                              : 'bg-amber-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Skill Inspector */}
        <div className="lg:col-span-4 bg-[#0c0c16] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-28">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Skill Context
            </span>
            <span
              className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${
                selectedSkill.level === 'core'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : selectedSkill.level === 'proficient'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {selectedSkill.level} competence
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{selectedSkill.name}</h3>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">Category: {selectedSkill.category}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Architectural Role</span>
              <p className="text-sm text-neutral-300 leading-relaxed bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-xl">
                {selectedSkill.description}
              </p>
            </div>

            {selectedSkill.projects && selectedSkill.projects.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Deployed In Projects:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.projects.map((projSlug) => (
                    <span
                      key={projSlug}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-300"
                    >
                      {projSlug}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default TechEcosystem;
