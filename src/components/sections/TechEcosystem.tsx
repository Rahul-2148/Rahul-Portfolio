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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono mb-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span>Technical Domain Competence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Engineering Ecosystem &amp; Stack
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-2">
          Click any technology to inspect the architectural reasoning, experience depth, and real systems where it was deployed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Categorized Skills Cloud */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-8 shadow-lg">
          {categories.map((category) => {
            const catSkills = skills.filter((s) => s.category === category);
            if (catSkills.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
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
                            ? 'bg-primary/20 border border-border-accent text-primary font-bold shadow-md shadow-primary/10 scale-[1.03]'
                            : 'bg-surface border border-border text-foreground hover:text-primary hover:border-border-accent hover:bg-surface-elevated'
                        }`}
                        data-cursor="INSPECT"
                      >
                        <span>{skill.name}</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            skill.level === 'core'
                              ? 'bg-emerald-500'
                              : skill.level === 'proficient'
                              ? 'bg-primary'
                              : 'bg-amber-500'
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
        <div className="lg:col-span-4 bg-surface-elevated border border-border-accent rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-28">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-primary flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Skill Context
            </span>
            <span
              className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold border ${
                selectedSkill.level === 'core'
                  ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                  : selectedSkill.level === 'proficient'
                  ? 'bg-primary/20 text-primary border-border-accent'
                  : 'bg-amber-500/20 text-amber-500 border-amber-500/30'
              }`}
            >
              {selectedSkill.level} competence
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">{selectedSkill.name}</h3>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">Category: {selectedSkill.category}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Architectural Role</span>
              <p className="text-sm text-foreground leading-relaxed bg-surface border border-border p-3.5 rounded-xl">
                {selectedSkill.description}
              </p>
            </div>

            {selectedSkill.projects && selectedSkill.projects.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Deployed In Projects:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.projects.map((projSlug) => (
                    <span
                      key={projSlug}
                      className="px-2.5 py-1 rounded-md bg-surface border border-border text-xs font-mono text-primary"
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
