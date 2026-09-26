'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
  Star,
  HardDrive,
  Cloud,
} from 'lucide-react';
import { ResumeItem } from '@/types';

interface ResumesViewProps {
  resumes: ResumeItem[];
  onRefresh: () => Promise<void>;
}

export function ResumesView({ resumes, onRefresh }: ResumesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [cloudinaryStatus, setCloudinaryStatus] = useState<{
    loading: boolean;
    connected: boolean;
    cloudName: string;
    message: string;
  }>({
    loading: true,
    connected: false,
    cloudName: '',
    message: 'Checking...',
  });

  const checkCloudinaryStatus = () => {
    setCloudinaryStatus((p) => ({ ...p, loading: true }));
    fetch('/api/admin/cloudinary/status')
      .then((res) => res.json())
      .then((data) => {
        setCloudinaryStatus({
          loading: false,
          connected: Boolean(data.connected),
          cloudName: data.cloudName || '',
          message: data.message || '',
        });
      })
      .catch((err) => {
        setCloudinaryStatus({
          loading: false,
          connected: false,
          cloudName: '',
          message: err instanceof Error ? err.message : 'Status check failed',
        });
      });
  };

  useEffect(() => {
    checkCloudinaryStatus();
  }, []);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT / Full-Stack');
  const [description, setDescription] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const CATEGORY_PRESETS = [
    'IT / Full-Stack',
    'Core Systems',
    'AI & ML',
    'Software Engineering',
    'Frontend Specialist',
    'Backend & DevOps',
    'General',
  ];

  const handleOpenUpload = () => {
    setTitle('');
    setCategory('IT / Full-Stack');
    setDescription('');
    setIsPrimary(resumes.length === 0);
    setSelectedFile(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF or document file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', 'resume');
      formData.append('title', title || selectedFile.name);
      formData.append('category', category);
      formData.append('isPrimary', isPrimary ? 'true' : 'false');
      formData.append('description', description);

      const res = await fetch('/api/admin/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload resume to Cloudinary/storage');
      }

      setSuccessMsg('Resume successfully uploaded to Cloudinary and synchronized with database!');
      setTimeout(() => setSuccessMsg(null), 3000);
      setIsModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (resume: ResumeItem) => {
    try {
      const res = await fetch('/api/admin/resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resume, isPrimary: true }),
      });

      if (res.ok) {
        setSuccessMsg(`"${resume.title}" is now the primary resume!`);
        setTimeout(() => setSuccessMsg(null), 2500);
        await onRefresh();
      }
    } catch (err) {
      console.error('Failed to set primary resume:', err);
    }
  };

  const handleDelete = async (resume: ResumeItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${resume.title}"? This will also remove it from Cloudinary CDN.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/resumes?id=${encodeURIComponent(resume.id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccessMsg(`Deleted "${resume.title}" successfully.`);
        setTimeout(() => setSuccessMsg(null), 2500);
        await onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Curated Resumes &amp; Storage</span>
            </h2>

            {/* Cloudinary Live Connection Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border ${
                cloudinaryStatus.connected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
              title={cloudinaryStatus.message}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>
                {cloudinaryStatus.loading
                  ? 'Checking CDN...'
                  : cloudinaryStatus.connected
                  ? `Cloudinary CDN Active (${cloudinaryStatus.cloudName})`
                  : 'Local Disk Storage Active'}
              </span>
              <button
                type="button"
                onClick={checkCloudinaryStatus}
                className="ml-1 hover:underline text-[10px] text-muted-foreground hover:text-foreground"
                title="Test Cloudinary Ping"
              >
                (Recheck)
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            Upload and manage tailored CV versions. Files are securely stored and delivered globally.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenUpload}
            className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New CV</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumes.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-3xl bg-surface border border-dashed border-border space-y-3">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
            <div className="text-sm font-bold text-foreground">No Resumes Uploaded Yet</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Click &quot;Upload New CV&quot; to upload your PDF resume and make it available to your visitors.
            </p>
            <button
              onClick={handleOpenUpload}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-mono font-bold inline-flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload First Resume</span>
            </button>
          </div>
        ) : (
          resumes.map((res) => (
            <div
              key={res.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                res.isPrimary
                  ? 'bg-primary/5 border-primary/40 shadow-sm'
                  : 'bg-card border-border hover:border-border-accent'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-primary border border-primary/20">
                      {res.category}
                    </span>
                    {res.isPrimary && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                        <Star className="w-3 h-3 fill-emerald-400" />
                        <span>Primary Default</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground truncate" title={res.title}>
                    {res.title}
                  </h3>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Preview in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(res)}
                    className="p-2 rounded-lg bg-surface hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {res.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {res.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center gap-3">
                  {res.fileSize && (
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-primary" />
                      <span>{res.fileSize}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Cloud className="w-3 h-3 text-cyan-400" />
                    <span>{res.publicId ? 'Cloudinary CDN' : 'Local Storage'}</span>
                  </span>
                </div>

                {!res.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(res)}
                    className="text-primary hover:underline font-bold"
                  >
                    Set as Primary
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
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
                <Upload className="w-5 h-5 text-primary" />
                <span>Upload New Resume</span>
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

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-muted-foreground">Resume Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Developer Resume (IT)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Category / Profile Role</label>
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {CATEGORY_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setCategory(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors ${
                        category === preset
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'bg-surface hover:bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Or custom category name..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Select PDF Document</label>
                <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center cursor-pointer bg-surface/50 relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-primary mx-auto" />
                    {selectedFile ? (
                      <div className="text-foreground font-bold text-xs truncate max-w-xs mx-auto">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </div>
                    ) : (
                      <>
                        <div className="text-foreground font-bold">Choose a PDF or drag here</div>
                        <div className="text-[10px] text-muted-foreground">
                          PDF files up to 10MB supported
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Target Role / Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tailored for Next.js, MERN, and Cloud engineering roles"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-foreground">Set as Primary Default Resume</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-muted text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-5 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-primary/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading Resume...' : 'Upload & Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumesView;
