'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  ExternalLink,
  X,
  CheckCircle2,
  Calendar,
  HardDrive,
  ShieldCheck,
  Layers,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { ResumeItem } from '@/types';
import { trackEvent } from '@/lib/analytics/tracker';

export function ResumeModal({
  initialOpen = false,
  initialDetail,
}: {
  initialOpen?: boolean;
  initialDetail?: { resumeId?: string; category?: string } | null;
} = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [resumesList, setResumesList] = useState<ResumeItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(initialDetail?.resumeId || '');
  const [loading, setLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Fetch only resumes actually uploaded to the database
  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      if (data.success && Array.isArray(data.resumes) && data.resumes.length > 0) {
        setResumesList(data.resumes);
        setSelectedResumeId((prev) => {
          if (data.resumes.some((r: ResumeItem) => r.id === prev)) {
            return prev;
          }
          const primary = data.resumes.find((r: ResumeItem) => r.isPrimary) || data.resumes[0];
          return primary.id;
        });
      } else {
        setResumesList([]);
        setSelectedResumeId('');
      }
    } catch (err) {
      console.warn('Error fetching uploaded resumes:', err);
      setResumesList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Global listener for opening the modal from anywhere
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ resumeId?: string; category?: string }>;
      if (customEvent.detail?.resumeId) {
        setSelectedResumeId(customEvent.detail.resumeId);
      }
      setIsOpen(true);
      fetchResumes();
    };

    window.addEventListener('open-resume-modal', handleOpen);
    return () => window.removeEventListener('open-resume-modal', handleOpen);
  }, [fetchResumes]);

  // Fetch resumes immediately if opened upon mount
  useEffect(() => {
    if (initialOpen) {
      fetchResumes();
    }
  }, [initialOpen, fetchResumes]);

  // Broadcast modal open/close state to hide background widgets & lock body scroll
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('resume-modal-state', { detail: { open: true } }));
      document.body.style.overflow = 'hidden';
    } else {
      window.dispatchEvent(new CustomEvent('resume-modal-state', { detail: { open: false } }));
      document.body.style.overflow = '';
    }
    return () => {
      window.dispatchEvent(new CustomEvent('resume-modal-state', { detail: { open: false } }));
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const activeResume: ResumeItem | undefined =
    resumesList.find((r) => r.id === selectedResumeId) || resumesList[0];

  const handleDownload = () => {
    if (!activeResume?.url) return;

    trackEvent('resume_download', {
      metadata: {
        resumeId: activeResume.id,
        title: activeResume.title,
        category: activeResume.category,
      },
    });

    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);

    const safeCategory = (activeResume.category || 'CV').replace(/[^a-zA-Z0-9]/g, '_');
    const link = document.createElement('a');
    link.href = activeResume.url;
    link.download = `Rahul_Raj_${safeCategory}_Resume.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain touch-pan-y"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="relative w-full max-w-[840px] bg-popover text-popover-foreground border border-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh] overscroll-contain"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-border flex items-center justify-between bg-surface/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <span>Curated Resumes</span>
                    {resumesList.length > 0 && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{resumesList.length} Uploaded</span>
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {resumesList.length > 0
                      ? 'Select an uploaded profile to preview & download the PDF.'
                      : 'Verified engineering credentials.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground font-mono text-xs">
                <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                <span>Checking uploaded resumes in database...</span>
              </div>
            ) : resumesList.length === 0 ? (
              /* ====================================================
                 EMPTY STATE: NO RESUME UPLOADED YET
                 ==================================================== */
              <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-muted-foreground shadow-sm">
                  <FileText className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Curated CVs &amp; Profiles
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    Formal role-tailored resumes are available upon request. You can also view the full ATS plain-text profile or reach out directly to receive an updated PDF copy.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Request CV / Contact</span>
                  </Link>

                  <Link
                    href="/resume"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-foreground hover:text-primary flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>View ATS Profile Sheet</span>
                  </Link>
                </div>
              </div>
            ) : activeResume ? (
              /* ====================================================
                 ACTIVE UPLOADED RESUME VIEWER
                 ==================================================== */
              <>
                {/* Profile Tabs (if multiple uploaded resumes) */}
                {resumesList.length > 1 && (
                  <div
                    data-lenis-prevent
                    className="px-4 sm:px-6 py-2 bg-surface-elevated/70 border-b border-border flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 touch-pan-x overscroll-contain"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground shrink-0 mr-1">
                      <Layers className="w-3 h-3 text-primary" />
                      <span>Uploaded Profiles ({resumesList.length}):</span>
                    </div>
                    {resumesList.map((res) => {
                      const isSelected = res.id === activeResume.id;
                      return (
                        <button
                          key={res.id}
                          onClick={() => setSelectedResumeId(res.id)}
                          className={`relative px-3 py-1 rounded-lg text-[11px] font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs ring-1 ring-white/20 font-bold'
                              : 'bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                          }`}
                        >
                          <span>{res.category || res.title}</span>
                          {res.isPrimary && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" title="Primary Resume" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Resume Meta & Actions Header */}
                <div className="px-4 sm:px-6 py-2.5 bg-surface border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                        {activeResume.title}
                      </h3>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {activeResume.category}
                      </span>
                      {activeResume.isPrimary && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/25">
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground flex-wrap">
                      {activeResume.fileSize && (
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-primary" />
                          <span>{activeResume.fileSize}</span>
                        </span>
                      )}
                      {activeResume.uploadedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary" />
                          <span>Uploaded {new Date(activeResume.uploadedAt).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Download this uploaded CV file"
                    >
                      {isDownloaded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download CV</span>
                        </>
                      )}
                    </button>

                    <a
                      href={activeResume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-foreground transition-all hover:scale-105 active:scale-95 shadow-xs"
                      title="Open full PDF in new window"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                </div>

                {/* PDF Viewer Frame */}
                <div className="flex-1 p-3 sm:p-5 overflow-hidden bg-slate-950 flex flex-col">
                  <iframe
                    src={activeResume.url}
                    title={activeResume.title}
                    className="w-full flex-1 min-h-[420px] rounded-xl border border-border/60 bg-slate-900"
                  />
                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Verified PDF Document • {activeResume.title}</span>
                    <a
                      href={activeResume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Full Window View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            ) : null}

            {/* Modal Footer */}
            <div className="px-5 py-2 border-t border-border bg-surface flex items-center justify-between text-[11px] font-mono text-muted-foreground shrink-0">
              <span>Rahul Raj • Official Resume</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ResumeModal;
