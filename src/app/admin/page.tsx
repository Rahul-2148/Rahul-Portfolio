'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  Database,
  Briefcase,
  GraduationCap,
  Code2,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Save,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Search as SearchIcon,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  Settings,
  FolderKanban,
  Activity,
  BarChart3,
} from 'lucide-react';
import { Project, Experience, Education, Skill, PersonalInfo } from '@/types';
import { ProjectModal } from '@/components/admin/ProjectModal';
import { LiveVisitorsView } from '@/components/admin/LiveVisitorsView';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { SkillsView } from '@/components/admin/SkillsView';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'skills' | 'live' | 'analytics' | 'experience' | 'education' | 'settings' | 'security' | 'audit'
  >('overview');

  // Gate State (Login vs Emergency Recovery vs Email OTP)
  const [authMode, setAuthMode] = useState<'login' | 'recovery' | 'email_otp'>('login');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPasscodeReset, setNewPasscodeReset] = useState('');
  const [confirmPasscodeReset, setConfirmPasscodeReset] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  // Email OTP Reset State
  const adminEmail = 'rahulraj2148@gmail.com';
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPasscode, setOtpNewPasscode] = useState('');
  const [otpConfirmPasscode, setOtpConfirmPasscode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Security Tab State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingPasscode, setIsUpdatingPasscode] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Reusable Skills State
  const [skills, setSkills] = useState<Skill[]>([]);

  // Live Presence State
  const [onlineCount, setOnlineCount] = useState(0);

  // Audit Logs State
  interface AuditLogItem {
    action: string;
    resource: string;
    details?: Record<string, unknown>;
    timestamp: string;
  }
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Portfolio Experience, Education, Settings State
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ isConnected: boolean; message: string; source: string }>({
    isConnected: false,
    message: 'Checking database...',
    source: 'unknown',
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: 'Rahul Raj',
    role: 'Full-Stack Engineer',
    tagline: 'AI × Product × Real-Time Systems',
    bio: '',
    github: 'https://github.com/Rahul-2148',
    email: 'rahulraj2148@gmail.com',
    location: 'India',
    available: true,
    resumeUrl: '',
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

  // 1. Check existing session on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/admin/portfolio');
        if (res.ok) {
          setIsAuthenticated(true);
          const json = await res.json();
          if (json.data) {
            setPersonalInfo(json.data.personalInfo || personalInfo);
            setExperiences(json.data.experiences || []);
            setEducations(json.data.educations || []);
          }
          setDbStatus({
            isConnected: json.isConnected,
            message: json.message || '',
            source: json.source || '',
          });
        }
      } catch {
        // Not authenticated
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, []);

  // 2. Fetch Projects, Skills, Presence, and Audit Logs once authenticated
  const fetchAllAdminData = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingProjects(true);
      // Fetch Projects
      const projRes = await fetch('/api/admin/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }

      // Fetch Skills
      const skillRes = await fetch('/api/admin/skills');
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        setSkills(skillData.skills || []);
      }

      // Fetch Presence
      const presenceRes = await fetch('/api/analytics/presence');
      if (presenceRes.ok) {
        const presenceData = await presenceRes.json();
        setOnlineCount(presenceData.onlineCount || 0);
      }

      // Fetch Audit Logs
      const auditRes = await fetch('/api/admin/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }
    } catch {
      // Fail safely
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData();
      // Presence polling
      const presenceInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/analytics/presence');
          if (res.ok) {
            const data = await res.json();
            setOnlineCount(data.onlineCount || 0);
          }
        } catch {}
      }, 5000);
      return () => clearInterval(presenceInterval);
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid passcode');
      }
    } catch {
      setAuthError('Authentication request failed. Check server status.');
    }
  };

  // Handle Master Key Recovery
  const handleRecoveryReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setRecoverySuccess('');
    if (newPasscodeReset !== confirmPasscodeReset) {
      setAuthError('New passcodes do not match.');
      return;
    }
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_passcode',
          recoveryKey,
          newPasscode: newPasscodeReset,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecoverySuccess(data.message);
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1200);
      } else {
        setAuthError(data.error || 'Emergency recovery failed.');
      }
    } catch {
      setAuthError('Recovery request failed.');
    }
  };

  // Handle Email OTP Send
  const handleSendEmailOtp = async () => {
    setSendingOtp(true);
    setAuthError('');
    setOtpSentNotice(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_email_otp' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSentNotice(data.message);
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
        }
        setOtpCooldown(60);
      } else {
        setAuthError(data.error || 'Failed to dispatch OTP.');
      }
    } catch {
      setAuthError('Network error while requesting OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle Email OTP Verify & Reset
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!otpCode || otpCode.trim().length !== 6) {
      setAuthError('Please enter a 6-digit verification code.');
      return;
    }
    if (otpNewPasscode !== otpConfirmPasscode) {
      setAuthError('New passcodes do not match.');
      return;
    }
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_email_otp',
          otpCode: otpCode.trim(),
          newPasscode: otpNewPasscode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecoverySuccess(data.message);
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1200);
      } else {
        setAuthError(data.error || 'Invalid or expired OTP code.');
      }
    } catch {
      setAuthError('Verification failed.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    document.cookie = 'portfolio_admin_token=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Handle Project Save from Modal (Create or Edit)
  const handleSaveProjectFromModal = async (projectData: Partial<Project>) => {
    const isEdit = Boolean(selectedProjectForModal?._id || selectedProjectForModal?.slug);
    const url = isEdit
      ? `/api/admin/projects/${selectedProjectForModal?._id || selectedProjectForModal?.slug}`
      : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to save project');
    }

    setSaveStatus('Project saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
    await fetchAllAdminData();
  };

  // Handle Project Delete
  const handleDeleteProject = async (p: Project) => {
    if (!confirm(`Are you sure you want to delete project "${p.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSaveStatus(`Deleted ${p.name}`);
        setTimeout(() => setSaveStatus(null), 3000);
        await fetchAllAdminData();
      }
    } catch {
      alert('Failed to delete project');
    }
  };

  // Handle Project Status Toggle
  const handleToggleProjectStatus = async (p: Project, nextStatus: 'published' | 'draft' | 'archived') => {
    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await fetchAllAdminData();
      }
    } catch {}
  };

  // Handle Project Feature Toggle
  const handleToggleFeatured = async (p: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (res.ok) {
        await fetchAllAdminData();
      }
    } catch {}
  };

  // Handle Move Up / Move Down Ordering
  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((proj, idx) => ({
      id: proj._id || proj.slug,
      sortOrder: idx,
    }));

    setProjects(reordered);

    try {
      await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      await fetchAllAdminData();
    }
  };

  // Sync Initial Projects & Data
  const handleSyncInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_initial' }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus(data.message || 'Synced all projects and details into MongoDB Atlas!');
        setTimeout(() => setSaveStatus(null), 3000);
        await fetchAllAdminData();
      }
    } catch {
      setSaveStatus('Error syncing data.');
    } finally {
      setLoading(false);
    }
  };

  // Save Settings (PersonalInfo)
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalInfo),
      });
      if (res.ok) {
        setSaveStatus('Settings updated successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      setSaveStatus('Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton during auth check
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGIN / AUTH GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-foreground relative overflow-hidden">
        <div className="relative w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Portfolio Owner Panel</h1>
            <p className="text-xs font-mono text-muted-foreground">
              {authMode === 'login'
                ? 'Enter master administrative passkey'
                : authMode === 'email_otp'
                ? 'Verify 6-digit OTP sent to rahulraj2148@gmail.com'
                : 'Emergency Recovery via Master Key'}
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-mono text-center">
              {authError}
            </div>
          )}

          {recoverySuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center">
              {recoverySuccess}
            </div>
          )}

          {/* Mode 1: Standard Login */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Admin Passcode</label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passkey..."
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Control Studio</span>
              </button>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email_otp');
                    setAuthError('');
                  }}
                  className="text-primary hover:underline"
                >
                  📧 Reset via Email OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('recovery');
                    setAuthError('');
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Forgot Passcode?
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: Email OTP Reset */}
          {authMode === 'email_otp' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-surface-elevated/50 border border-border text-xs font-mono space-y-2">
                <div className="text-muted-foreground">Target Recipient:</div>
                <div className="font-bold text-foreground">{adminEmail}</div>
                <button
                  type="button"
                  disabled={sendingOtp || otpCooldown > 0}
                  onClick={handleSendEmailOtp}
                  className="w-full mt-2 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-bold transition-colors disabled:opacity-50"
                >
                  {sendingOtp
                    ? 'Dispatching OTP...'
                    : otpCooldown > 0
                    ? `Resend available in ${otpCooldown}s`
                    : 'Send 6-Digit OTP Email'}
                </button>
              </div>

              {otpSentNotice && (
                <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                  {otpSentNotice}
                </div>
              )}

              {devOtpHint && (
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                  <strong>Simulated OTP Code:</strong> {devOtpHint}
                </div>
              )}

              <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-center text-base tracking-widest font-mono focus:outline-none focus:border-primary"
                />
                <input
                  type="password"
                  value={otpNewPasscode}
                  onChange={(e) => setOtpNewPasscode(e.target.value)}
                  placeholder="New Admin Passcode"
                  className="w-full px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
                <input
                  type="password"
                  value={otpConfirmPasscode}
                  onChange={(e) => setOtpConfirmPasscode(e.target.value)}
                  placeholder="Confirm New Passcode"
                  className="w-full px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono font-bold text-xs transition-all shadow-md shadow-primary/20"
                >
                  Verify &amp; Unlock Panel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className="w-full py-1 text-center text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  ← Back to Login
                </button>
              </form>
            </div>
          )}

          {/* Mode 3: Master Key Recovery */}
          {authMode === 'recovery' && (
            <form onSubmit={handleRecoveryReset} className="space-y-3">
              <input
                type="text"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="ADMIN_RECOVERY_KEY"
                className="w-full px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
              />
              <input
                type="password"
                value={newPasscodeReset}
                onChange={(e) => setNewPasscodeReset(e.target.value)}
                placeholder="New Passcode"
                className="w-full px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
              />
              <input
                type="password"
                value={confirmPasscodeReset}
                onChange={(e) => setConfirmPasscodeReset(e.target.value)}
                placeholder="Confirm New Passcode"
                className="w-full px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono font-bold text-xs"
              >
                Reset via Master Key
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="w-full py-1 text-center text-xs font-mono text-muted-foreground hover:text-foreground"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'published') return p.status === 'published';
    if (projectFilter === 'draft') return p.status === 'draft';
    if (projectFilter === 'archived') return p.status === 'archived';
    if (!projectSearch.trim()) return true;
    const term = projectSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.technologies?.some((t) => t.toLowerCase().includes(term))
    );
  });

  // =========================================================================
  // AUTHENTICATED SAAS-GRADE DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top SaaS Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-foreground text-sm hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono font-black text-xs">
              RR
            </div>
            <span className="hidden sm:inline">Rahul Raj — Portfolio Studio</span>
          </Link>

          {/* Real-time Online Badge */}
          <button
            onClick={() => setActiveTab('live')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
            title="View Live Online Visitors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold">{onlineCount} Online</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 animate-in fade-in">
              {saveStatus}
            </span>
          )}

          <button
            onClick={() => {
              setSelectedProjectForModal(null);
              setIsProjectModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Project</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-foreground transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-destructive transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main SaaS Layout: Sidebar + Viewport */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 shrink-0 space-y-1 font-mono text-xs select-none">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            System Operations
          </div>

          {[
            { id: 'overview', label: 'Overview & KPIs', icon: Layers },
            { id: 'projects', label: 'Projects Manager', icon: FolderKanban, badge: projects.length },
            { id: 'skills', label: 'Skills Catalog', icon: Code2, badge: skills.length },
            { id: 'live', label: 'Live Visitors', icon: Activity, live: true },
            { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.live && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-black/20 text-white' : 'bg-surface-elevated text-muted-foreground'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
            Resume &amp; Content
          </div>

          {[
            { id: 'settings', label: 'Portfolio Settings', icon: Settings },
            { id: 'experience', label: 'Experience History', icon: Briefcase },
            { id: 'education', label: 'Education & Scores', icon: GraduationCap },
            { id: 'security', label: 'Security & Passkey', icon: KeyRound },
            { id: 'audit', label: 'Audit Log', icon: Clock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Viewport Content */}
        <main className="flex-1 min-w-0">
          {/* ====================================================
              TAB: OVERVIEW
              ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SaaS Portfolio Control Center</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Welcome back, Rahul
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                    Manage your production projects, master skills catalog, and monitor real-time visitor telemetry in one unified internal studio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedProjectForModal(null);
                      setIsProjectModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Project</span>
                  </button>

                  <button
                    onClick={handleSyncInitialData}
                    className="px-4 py-2.5 rounded-xl bg-surface hover:bg-muted border border-border text-xs font-mono text-foreground flex items-center justify-center gap-2"
                    title="Seed static portfolio data to MongoDB Atlas"
                  >
                    <Database className="w-4 h-4 text-primary" />
                    <span>Sync Initial Projects</span>
                  </button>
                </div>
              </div>

              {/* Quick KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Live Online</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {onlineCount}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">Active in last 45s</div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Published Projects</span>
                    <FolderKanban className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
                    {projects.filter((p) => p.status === 'published').length}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {projects.filter((p) => p.status === 'draft').length} drafts in progress
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Master Skills</span>
                    <Code2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                    {skills.length}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">Reusable stack items</div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Database Status</span>
                    <Database className="w-4 h-4 text-primary" />
                  </div>
                  <div className={`text-base font-bold font-mono truncate ${dbStatus.isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dbStatus.isConnected ? 'Atlas Live' : 'Fallback Mode'}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground truncate">
                    {dbStatus.message || 'Zero-crash fallback'}
                  </div>
                </div>
              </div>

              {/* Projects Quick Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold">
                    Active Projects Catalog ({projects.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-mono text-primary hover:underline"
                  >
                    View All in Manager →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.slice(0, 6).map((p) => (
                    <div
                      key={p.slug}
                      className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-3 shadow-sm hover:border-border-accent transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-primary font-bold">{p.category}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              p.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-foreground mt-1">{p.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.tagline}</p>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                        <button
                          onClick={() => {
                            setSelectedProjectForModal(p);
                            setIsProjectModalOpen(true);
                          }}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <a
                          href={`/work/${p.slug}?preview=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: PROJECTS MANAGER (FULL CRUD + REORDERING)
              ==================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Action Toolbar */}
              <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                {/* Status filter pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  {[
                    { id: 'all', label: `All (${projects.length})` },
                    { id: 'published', label: `Published (${projects.filter((p) => p.status === 'published').length})` },
                    { id: 'draft', label: `Drafts (${projects.filter((p) => p.status === 'draft').length})` },
                    { id: 'archived', label: `Archived (${projects.filter((p) => p.status === 'archived').length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setProjectFilter(f.id as typeof projectFilter)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        projectFilter === f.id
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'bg-surface text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search & Add */}
                <div className="flex items-center gap-2">
                  {loadingProjects && (
                    <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                  )}
                  <div className="relative">
                    <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Filter projects..."
                      className="pl-9 pr-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProjectForModal(null);
                      setIsProjectModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Project</span>
                  </button>
                </div>
              </div>

              {/* Projects List with Reordering */}
              <div className="space-y-3">
                {filteredProjects.length === 0 ? (
                  <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-2 text-xs font-mono text-muted-foreground">
                    <p>No projects match your current filter.</p>
                    <button
                      onClick={() => {
                        setSelectedProjectForModal(null);
                        setIsProjectModalOpen(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      + Create a new project →
                    </button>
                  </div>
                ) : (
                  filteredProjects.map((p, idx) => (
                    <div
                      key={p.slug}
                      className="p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-border-accent flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm"
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-4">
                        {/* Up/Down order controls */}
                        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                          <button
                            onClick={() => handleMoveProject(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono text-muted-foreground font-bold">
                            #{p.sortOrder ?? idx + 1}
                          </span>
                          <button
                            onClick={() => handleMoveProject(idx, 'down')}
                            disabled={idx === filteredProjects.length - 1}
                            className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail or placeholder */}
                        <div className="w-16 h-12 rounded-xl bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <FolderKanban className="w-5 h-5 text-muted-foreground/50" />
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-bold text-foreground truncate">{p.name}</h4>
                            <span className="text-xs font-mono text-muted-foreground">/work/{p.slug}</span>

                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1 rounded-md transition-colors ${
                                p.featured ? 'text-amber-400' : 'text-muted-foreground/40 hover:text-muted-foreground'
                              }`}
                              title={p.featured ? 'Featured on homepage' : 'Mark as featured'}
                            >
                              <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                            <span>Tier {p.tier}</span>
                            <span>•</span>
                            <span>{p.category}</span>
                            <span>•</span>
                            <span>{p.year}</span>
                            {p.technologies && p.technologies.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-foreground font-semibold truncate max-w-xs">
                                  {p.technologies.slice(0, 4).join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        {/* Status selector */}
                        <select
                          value={p.status || 'published'}
                          onChange={(e) =>
                            handleToggleProjectStatus(p, e.target.value as 'published' | 'draft' | 'archived')
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : p.status === 'draft'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-muted border-border text-muted-foreground'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>

                        <a
                          href={`/work/${p.slug}?preview=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-muted border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                          title="Preview case study"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span className="hidden sm:inline">Preview</span>
                        </a>

                        <button
                          onClick={() => {
                            setSelectedProjectForModal(p);
                            setIsProjectModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-mono text-primary font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(p)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: REUSABLE SKILLS CATALOG
              ==================================================== */}
          {activeTab === 'skills' && (
            <SkillsView skills={skills} onRefresh={fetchAllAdminData} />
          )}

          {/* ====================================================
              TAB: LIVE VISITORS (REALTIME PRESENCE)
              ==================================================== */}
          {activeTab === 'live' && <LiveVisitorsView />}

          {/* ====================================================
              TAB: ANALYTICS & CHARTS
              ==================================================== */}
          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {/* ====================================================
              TAB: SETTINGS (PERSONAL INFO)
              ==================================================== */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  <span>Portfolio Global Settings &amp; Personal Info</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize the headline, bio, availability status, resume file URL, and social links.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Role Title</label>
                  <input
                    type="text"
                    value={personalInfo.role}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-muted-foreground">Hero Tagline</label>
                  <input
                    type="text"
                    value={personalInfo.tagline}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-muted-foreground">Bio / Narrative</label>
                  <textarea
                    rows={3}
                    value={personalInfo.bio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm leading-relaxed focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Contact Email</label>
                  <input
                    type="text"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">GitHub URL</label>
                  <input
                    type="text"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Resume PDF URL (Optional override)</label>
                  <input
                    type="text"
                    value={personalInfo.resumeUrl || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, resumeUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={personalInfo.available}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, available: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Available for Engineering Roles / Select Contracts</span>
                </label>

                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: EXPERIENCE HISTORY
              ==================================================== */}
          {activeTab === 'experience' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Work Experience ({experiences.length})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Engineering roles, companies, and achievements.</p>
                </div>
              </div>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm">{exp.role} @ {exp.company}</span>
                      <span className="text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-muted-foreground">{exp.description}</p>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.technologies.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-surface-elevated text-[10px] text-primary">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: EDUCATION
              ==================================================== */}
          {activeTab === 'education' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div>
                <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>Education &amp; Credentials ({educations.length})</span>
                </h3>
                <p className="text-xs text-muted-foreground">Degrees, university details, and distinction scores.</p>
              </div>

              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm">{edu.degree}</span>
                      <span className="text-muted-foreground">{edu.duration}</span>
                    </div>
                    <div className="text-primary">{edu.institution} • {edu.score}</div>
                    {edu.achievements && (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground pt-1">
                        {edu.achievements.map((ach, aIdx) => (
                          <li key={aIdx}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: SECURITY & PASSKEY
              ==================================================== */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div>
                <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <span>Security, Passkey &amp; Access Control</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update your active admin passkey or configure email OTP recovery.
                </p>
              </div>

              {securityMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    securityMsg.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-destructive/15 border border-destructive/30 text-destructive'
                  }`}
                >
                  {securityMsg.text}
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPasscode !== confirmPasscode) {
                    setSecurityMsg({ type: 'error', text: 'New passcodes do not match.' });
                    return;
                  }
                  setIsUpdatingPasscode(true);
                  try {
                    const res = await fetch('/api/admin/auth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'change_passcode',
                        currentPasscode,
                        newPasscode,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      setSecurityMsg({ type: 'success', text: data.message });
                      setCurrentPasscode('');
                      setNewPasscode('');
                      setConfirmPasscode('');
                    } else {
                      setSecurityMsg({ type: 'error', text: data.error || 'Failed to update passcode.' });
                    }
                  } catch {
                    setSecurityMsg({ type: 'error', text: 'Request failed.' });
                  } finally {
                    setIsUpdatingPasscode(false);
                  }
                }}
                className="max-w-md space-y-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <label className="text-muted-foreground">Current Passcode</label>
                  <input
                    type="password"
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground">New Passcode</label>
                  <input
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground">Confirm New Passcode</label>
                  <input
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPasscode}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold disabled:opacity-50"
                >
                  {isUpdatingPasscode ? 'Updating...' : 'Update Passcode'}
                </button>
              </form>
            </div>
          )}

          {/* ====================================================
              TAB: AUDIT LOG
              ==================================================== */}
          {activeTab === 'audit' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Administrative Audit Trail ({auditLogs.length})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Historical record of project additions, edits, deletions, and settings mutations.
                  </p>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-elevated border-b border-border text-muted-foreground uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          No audit logs recorded yet. Mutations will be logged here.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-card/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-foreground capitalize">
                            {log.action.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4 text-primary">{log.resource}</td>
                          <td className="py-3 px-4 text-muted-foreground truncate max-w-xs">
                            {JSON.stringify(log.details || {})}
                          </td>
                          <td className="py-3 px-4 text-right text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Studio Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        project={selectedProjectForModal}
        skillsList={skills}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProjectFromModal}
      />
    </div>
  );
}
