'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  ExternalLink,
  Save,
} from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementsViewProps {
  achievements: Achievement[];
  onRefresh: () => Promise<void>;
}

export function AchievementsView({ achievements, onRefresh }: AchievementsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<'certification' | 'award' | 'hackathon' | 'milestone'>('certification');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setIssuer('');
    setDate('');
    setCategory('certification');
    setCredentialUrl('');
    setDescription('');
    setSkillsText('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setTitle(item.title);
    setIssuer(item.issuer);
    setDate(item.date);
    setCategory(item.category);
    setCredentialUrl(item.credentialUrl || '');
    setDescription(item.description || '');
    setSkillsText((item.skills || []).join(', '));
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer) {
      setError('Please provide both achievement title and issuing body.');
      return;
    }

    setSaving(true);
    setError(null);

    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Achievement = {
      id: editingItem?.id || `ach_${Date.now()}`,
      title,
      issuer,
      date,
      category,
      credentialUrl,
      description,
      skills: skillsArray,
    };

    try {
      const res = await fetch('/api/admin/achievements', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save achievement');
      }

      setSuccessMsg(
        editingItem ? 'Achievement updated successfully!' : 'New certification added!'
      );
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Achievement) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/achievements?id=${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccessMsg(`Deleted "${item.title}" successfully.`);
        setTimeout(() => setSuccessMsg(null), 2500);
        await onRefresh();
      }
    } catch (err) {
      console.error('Delete achievement failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Achievements, Certifications &amp; Honors</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Industry certificates, hackathons, and technical problem-solving milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-3xl bg-surface border border-dashed border-border space-y-3">
            <Award className="w-8 h-8 text-muted-foreground mx-auto" />
            <div className="text-sm font-bold text-foreground">No Achievements Yet</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Add your certifications, hackathon awards, and problem-solving badges.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Credential</span>
            </button>
          </div>
        ) : (
          achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-5 rounded-2xl bg-card border border-border hover:border-purple-500/40 transition-all space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-purple-400 border border-purple-500/20">
                    {ach.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground pt-1">{ach.title}</h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    {ach.issuer} • {ach.date}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {ach.credentialUrl && (
                    <a
                      href={ach.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="View Credential URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEdit(ach)}
                    className="p-2 rounded-lg bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit achievement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ach)}
                    className="p-2 rounded-lg bg-surface hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete achievement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {ach.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ach.description}
                </p>
              )}

              {ach.skills && ach.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {ach.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            data-lenis-prevent
            className="w-full max-w-lg bg-popover border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>{editingItem ? 'Edit Credential' : 'Add Credential / Award'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-muted-foreground">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Developer / Hackathon Winner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Issuer / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services, LeetCode, etc."
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Date / Year</label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="certification">Certification</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="milestone">Engineering Milestone</option>
                  <option value="award">Award / Recognition</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Credential Verification Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief note about the achievement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Associated Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, System Design"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Credential'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AchievementsView;
