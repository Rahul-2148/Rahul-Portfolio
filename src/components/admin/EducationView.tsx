'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Calendar,
  MapPin,
  Save,
} from 'lucide-react';
import { Education } from '@/types';

interface EducationViewProps {
  educations: Education[];
  onRefresh: () => Promise<void>;
}

export function EducationView({ educations, onRefresh }: EducationViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [score, setScore] = useState('');
  const [location, setLocation] = useState('India');
  const [achievementsText, setAchievementsText] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setInstitution('');
    setDegree('');
    setField('');
    setDuration('');
    setScore('');
    setLocation('India');
    setAchievementsText('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Education) => {
    setEditingItem(item);
    setInstitution(item.institution);
    setDegree(item.degree);
    setField(item.field || '');
    setDuration(item.duration);
    setScore(item.score || '');
    setLocation(item.location || 'India');
    setAchievementsText((item.achievements || []).join('\n'));
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !degree) {
      setError('Please provide both institution and degree title.');
      return;
    }

    setSaving(true);
    setError(null);

    const achievementsList = achievementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Education = {
      id: editingItem?.id || `edu_${Date.now()}`,
      institution,
      degree,
      field,
      duration,
      score,
      location,
      achievements: achievementsList,
    };

    try {
      const res = await fetch('/api/admin/educations', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save education');
      }

      setSuccessMsg(
        editingItem ? 'Education updated successfully!' : 'New education credential added!'
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

  const handleDelete = async (item: Education) => {
    if (!confirm(`Are you sure you want to delete "${item.degree}"?`)) return;

    try {
      const res = await fetch(`/api/admin/educations?id=${encodeURIComponent(item.id || '')}&degree=${encodeURIComponent(item.degree)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccessMsg(`Deleted "${item.degree}" successfully.`);
        setTimeout(() => setSuccessMsg(null), 2500);
        await onRefresh();
      }
    } catch (err) {
      console.error('Delete education failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span>Academic Qualifications &amp; Degrees</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Manage university credentials, academic scores, and honors displayed on your public portfolio and resume.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {educations.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-surface border border-dashed border-border space-y-3">
            <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto" />
            <div className="text-sm font-bold text-foreground">No Education Records Found</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Add your university degrees, scores, and academic milestones.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>
        ) : (
          educations.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="p-6 rounded-2xl bg-card border border-border hover:border-border-accent transition-all space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">{edu.degree}</h3>
                    {edu.score && (
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        {edu.score}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-primary font-mono">
                    {edu.institution}
                  </div>
                  {edu.field && (
                    <div className="text-xs text-muted-foreground font-mono">
                      Field: {edu.field}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mr-2">
                    <span className="flex items-center gap-1 bg-surface-elevated px-2.5 py-1 rounded-full border border-border">
                      <Calendar className="w-3 h-3 text-primary" />
                      <span>{edu.duration}</span>
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3" />
                        <span>{edu.location}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="p-2 rounded-lg bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu)}
                    className="p-2 rounded-lg bg-surface hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground block mb-1">
                    Specializations &amp; Highlights:
                  </span>
                  <ul className="space-y-1 text-xs text-foreground/80 font-mono">
                    {edu.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
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
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>{editingItem ? 'Edit Education' : 'Add Education Credential'}</span>
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
                <label className="text-muted-foreground">Degree / Certificate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Technology (B.Tech)"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">University / Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University / College Name"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Department / Field</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science & Engineering"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Duration (Years)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021 — 2025"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Grade / Score</label>
                  <input
                    type="text"
                    placeholder="e.g. 8.5 CGPA or Grade"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Location</label>
                  <input
                    type="text"
                    placeholder="India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Key Coursework / Highlights (One per line)</label>
                <textarea
                  rows={4}
                  placeholder="Distributed Systems & Network Architecture&#10;Database Management Systems (NoSQL + SQL)&#10;Final Engineering Project: Multi-Vendor Platform"
                  value={achievementsText}
                  onChange={(e) => setAchievementsText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
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
                  <span>{saving ? 'Saving...' : 'Save Education'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EducationView;
