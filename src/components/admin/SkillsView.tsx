'use client';

import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, X, CheckCircle2 } from 'lucide-react';
import { Skill, SkillCategory, SkillDomain } from '@/types';

interface SkillsViewProps {
  skills: Skill[];
  onRefresh: () => Promise<void>;
}

export function SkillsView({ skills, onRefresh }: SkillsViewProps) {
  const [domainFilter, setDomainFilter] = useState<'all' | 'IT' | 'Non-IT'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [domain, setDomain] = useState<SkillDomain>('IT');
  const [category, setCategory] = useState<SkillCategory>('Frontend');
  const [level, setLevel] = useState<'core' | 'proficient' | 'familiar'>('proficient');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#00f0ff');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'Frontend', label: 'Frontend' },
    { id: 'Backend', label: 'Backend' },
    { id: 'Database', label: 'Database' },
    { id: 'Realtime', label: 'Realtime' },
    { id: 'AI', label: 'AI & ML' },
    { id: 'DevOps', label: 'DevOps' },
    { id: 'Cloud', label: 'Cloud' },
    { id: 'Tools', label: 'Tools' },
    { id: 'Design', label: 'UI/UX Design' },
    { id: 'BPO & Operations', label: 'BPO & Operations' },
    { id: 'Office & Analytics', label: 'Office & Analytics' },
    { id: 'Creative & Media', label: 'Creative & Media' },
    { id: 'Supply Chain', label: 'Supply Chain' },
    { id: 'Manufacturing', label: 'Manufacturing' },
    { id: 'Management', label: 'Management' },
  ];

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setName('');
    setDomain('IT');
    setCategory('Frontend');
    setLevel('proficient');
    setDescription('');
    setColor('#00f0ff');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setDomain(skill.domain || 'IT');
    setCategory(skill.category as SkillCategory);
    setLevel(skill.level);
    setDescription(skill.description || '');
    setColor(skill.color || '#00f0ff');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Skill Name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          domain,
          category,
          level,
          description: description.trim(),
          color,
          active: true,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to save skill');
      }

      await onRefresh();
      setIsModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (!confirm(`Are you sure you want to delete skill "${skill.name}"?`)) {
      return;
    }

    try {
      const slug = skill.slug || skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch(`/api/admin/skills?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await onRefresh();
      }
    } catch {
      // Ignore
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesDomain = domainFilter === 'all' || (s.domain || 'IT') === domainFilter;
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesDomain && matchesCategory;
  });

  const availableAdminCategories = categories.filter((c) => {
    if (c.id === 'all') return true;
    if (domainFilter === 'all') return true;
    const domainPool = skills.filter((s) => (s.domain || 'IT') === domainFilter);
    return domainPool.some((s) => s.category === c.id);
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Master Reusable Skills Catalog ({skills.length})</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Technologies defined here can be selected across all projects without manual string duplication.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Technology</span>
        </button>
      </div>

      {/* Two-Tier Filters: Domain + Dynamic Categories */}
      <div className="space-y-2">
        {/* Tier 1: Domain Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface border border-border rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setDomainFilter('all');
              setCategoryFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              domainFilter === 'all'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All Domains ({skills.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setDomainFilter('IT');
              setCategoryFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              domainFilter === 'IT'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            💻 IT Technical ({skills.filter((s) => (s.domain || 'IT') === 'IT').length})
          </button>
          <button
            type="button"
            onClick={() => {
              setDomainFilter('Non-IT');
              setCategoryFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              domainFilter === 'Non-IT'
                ? 'bg-pink-500 text-white font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            🤝 Non-IT Professional ({skills.filter((s) => s.domain === 'Non-IT').length})
          </button>
        </div>

        {/* Tier 2: Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-surface/70 border border-border/70 rounded-xl text-xs font-mono">
          {availableAdminCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === c.id
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            className="p-5 rounded-2xl bg-card border border-border hover:border-border-accent flex flex-col justify-between space-y-3 transition-all shadow-sm group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: skill.color || '#00f0ff' }}
                  />
                  <h4 className="text-base font-bold font-mono text-foreground">{skill.name}</h4>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground mt-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      (skill.domain || 'IT') === 'Non-IT'
                        ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                        : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {skill.domain || 'IT'}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{skill.category}</span>
                  <span>•</span>
                  <span className="capitalize">{skill.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(skill)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit skill"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(skill)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                  title="Delete skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {skill.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {skill.description}
              </p>
            )}

            {skill.projects && skill.projects.length > 0 && (
              <div className="pt-2 border-t border-border flex flex-wrap gap-1">
                {skill.projects.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded bg-surface-elevated text-[10px] font-mono text-muted-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            data-lenis-prevent
            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 text-foreground max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-base font-bold font-mono text-foreground">
                {editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Add New Skill / Technology'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs font-mono">
                {error}
              </div>
            )}

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-muted-foreground">Technology / Skill Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, Redis, PyTorch"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Domain Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDomain('IT');
                      if (['BPO & Operations', 'Supply Chain', 'Manufacturing'].includes(category)) {
                        setCategory('Frontend');
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                      domain === 'IT'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    💻 IT &amp; Technical
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDomain('Non-IT');
                      if (['Frontend', 'Backend', 'Database', 'Realtime', 'AI', 'DevOps', 'Cloud', 'Tools', 'Design'].includes(category)) {
                        setCategory('BPO & Operations');
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                      domain === 'Non-IT'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    🤝 Non-IT &amp; Operations
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    {domain === 'IT' ? (
                      <>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="Realtime">Realtime</option>
                        <option value="AI">AI &amp; ML</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Tools">Tools</option>
                        <option value="Design">UI/UX Design</option>
                      </>
                    ) : (
                      <>
                        <option value="BPO & Operations">BPO &amp; Customer Operations</option>
                        <option value="Office & Analytics">Office &amp; Business Analytics (Excel, Power BI)</option>
                        <option value="Creative & Media">Creative &amp; Media (Video Editing)</option>
                        <option value="Supply Chain">Supply Chain &amp; Logistics</option>
                        <option value="Manufacturing">Manufacturing &amp; Quality</option>
                        <option value="Management">Management &amp; Leadership</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground">Mastery Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as typeof level)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="core">Core</option>
                    <option value="proficient">Proficient</option>
                    <option value="familiar">Familiar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Description / Notes</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. App Router, Server Actions, SSR"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="text-muted-foreground">Badge Accent:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span>{color}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Skill'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
