'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  Database,
  Briefcase,
  GraduationCap,
  FileText,
  Code2,
  User,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Save,
  Sparkles,
  Layers,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Project, Experience, Education, Skill, PersonalInfo } from '@/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience' | 'education' | 'cv' | 'profile'>('overview');

  // Portfolio State
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Editing state for modals/forms
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);

  // Check initial auth status via cookie
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchPortfolioData();
        }
      } catch {
        // Not authenticated
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuthStatus();
  }, []);

  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio');
      if (res.ok) {
        const result = await res.json();
        setDbStatus({
          isConnected: result.isConnected,
          message: result.message,
          source: result.source,
        });
        if (result.data) {
          if (result.data.personalInfo) setPersonalInfo(result.data.personalInfo);
          if (result.data.projects) setProjects(result.data.projects);
          if (result.data.experiences) setExperiences(result.data.experiences);
          if (result.data.educations) setEducations(result.data.educations);
          if (result.data.skills) setSkills(result.data.skills);
        }
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Passcode Submission
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
      if (res.ok) {
        setIsAuthenticated(true);
        fetchPortfolioData();
      } else {
        setAuthError(data.error || 'Invalid passcode');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    }
  };

  // Save changes to database
  const saveSection = async (section: string, data: unknown) => {
    setSaveStatus('Saving...');
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_section', section, data }),
      });
      const result = await res.json();
      if (res.ok) {
        setSaveStatus('Saved successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus(result.message || 'Error saving to MongoDB');
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } catch {
      setSaveStatus('Failed to save. Check server logs.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // Sync initial static data to MongoDB Atlas
  const handleSyncInitialData = async () => {
    if (!confirm('This will seed your MongoDB Atlas database with all existing portfolio data. Proceed?')) return;
    setSaveStatus('Seeding MongoDB Atlas...');
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_initial' }),
      });
      const result = await res.json();
      if (res.ok) {
        setSaveStatus('Database Seeded Successfully!');
        fetchPortfolioData();
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        alert(result.message || 'Failed to seed MongoDB Atlas.');
        setSaveStatus(null);
      }
    } catch {
      alert('Sync failed. Please verify MONGODB_URI in .env.local.');
      setSaveStatus(null);
    }
  };

  // ----------------------------------------------------
  // PASSCODE GATE SCREEN
  // ----------------------------------------------------
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 font-mono text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
          <span>Verifying studio credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground relative overflow-hidden">
        <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-2xl space-y-6 relative z-10 card-beam">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-border-accent flex items-center justify-center text-primary mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Studio</h1>
            <p className="text-xs text-muted-foreground font-mono">
              Protected Developer Portal // Restricted Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground block">
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter secret PIN (e.g. rahul2148)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-ring transition-all pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs font-mono text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Portfolio</span>
            </Link>
            <span>Passcode configured in .env.local</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED ADMIN STUDIO DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-xl border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Return to Main Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">Rahul Raj — Admin Studio</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-border-accent text-primary">
                v2.0
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus.isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-mono text-muted-foreground">
                {dbStatus.isConnected ? 'MongoDB Atlas Online' : 'Offline / Static Fallback Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-primary/15 border border-border-accent text-primary animate-in fade-in">
              {saveStatus}
            </div>
          )}

          <button
            onClick={handleSyncInitialData}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-foreground transition-colors"
            title="Seed existing projects and data to MongoDB Atlas"
          >
            <Database className="w-3.5 h-3.5 text-primary" />
            <span>Sync Initial Data</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto select-none font-mono text-xs">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: Layers },
            { id: 'profile', label: 'Profile & Bio', icon: User },
            { id: 'cv', label: 'CV & Resume', icon: FileText },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'projects', label: 'Projects & Works', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <main className="mt-8 space-y-8">
          {/* ====================================================
              TAB 1: OVERVIEW & STATS
              ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs card-beam">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Total Projects</span>
                  <div className="text-3xl font-bold text-foreground mt-1">{projects.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projects.filter((p) => p.tier === 'S').length} Tier S Flagships
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs card-beam">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Work Milestones</span>
                  <div className="text-3xl font-bold text-primary mt-1">{experiences.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Career positions & roles</p>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs card-beam">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Education Degrees</span>
                  <div className="text-3xl font-bold text-foreground mt-1">{educations.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Academic qualifications</p>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs card-beam">
                  <span className="text-xs font-mono text-muted-foreground uppercase">Technical Skills</span>
                  <div className="text-3xl font-bold text-emerald-500 mt-1">{skills.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Core proficiencies cataloged</p>
                </div>
              </div>

              {/* Database Connection Card */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary border border-border-accent">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">MongoDB Atlas Cloud Connection</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {dbStatus.message}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      dbStatus.isConnected
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {dbStatus.isConnected ? 'CONNECTED' : 'ACTION REQUIRED'}
                  </span>
                </div>

                {!dbStatus.isConnected && (
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs text-muted-foreground leading-relaxed">
                    <p className="font-semibold text-foreground">How to connect your free MongoDB Atlas cluster:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create a free cluster on <a href="https://mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-primary underline">MongoDB Atlas</a>.</li>
                      <li>Copy your connection URI (e.g. <code className="font-mono text-primary">mongodb+srv://user:pass@cluster0.mongodb.net/portfolio</code>).</li>
                      <li>Paste it into <code className="font-mono text-primary">.env.local</code> under <code className="font-mono text-primary">MONGODB_URI</code>.</li>
                      <li>Restart your dev server. The dashboard will automatically switch to Live Database Mode!</li>
                    </ol>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSyncInitialData}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sync Initial Portfolio Data to Atlas</span>
                  </button>
                  <button
                    onClick={fetchPortfolioData}
                    className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-foreground transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Status</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 2: PROFILE & BIO
              ==================================================== */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Personal Profile & Bio</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Update your display name, engineering title, bio, and social credentials.
                  </p>
                </div>
                <button
                  onClick={() => saveSection('personalInfo', personalInfo)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Engineering Role / Title</label>
                  <input
                    type="text"
                    value={personalInfo.role}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Tagline</label>
                  <input
                    type="text"
                    value={personalInfo.tagline}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Contact Email</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <label className="text-muted-foreground">Engineering Bio</label>
                <textarea
                  rows={4}
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent font-sans text-sm"
                  placeholder="Describe your engineering philosophy, specializations, and focus..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="availableCheckbox"
                  checked={personalInfo.available}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, available: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-ring"
                />
                <label htmlFor="availableCheckbox" className="text-xs font-mono text-foreground cursor-pointer">
                  Show &quot;Available for Opportunities&quot; status badge on website
                </label>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 3: CV & RESUME
              ==================================================== */}
          {activeTab === 'cv' && (
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">CV &amp; Resume Configuration</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Configure your direct PDF download link and preview the live digital resume page.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/resume"
                    target="_blank"
                    className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-foreground flex items-center gap-1.5"
                  >
                    <span>View Digital Resume</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => saveSection('personalInfo', personalInfo)}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Resume Settings</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Resume PDF Download Link (Direct URL or Google Drive / Cloudinary)</label>
                  <input
                    type="url"
                    value={personalInfo.resumeUrl || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, resumeUrl: e.target.value })}
                    placeholder="https://example.com/rahul-raj-resume.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-input text-foreground focus:outline-none focus:border-border-accent"
                  />
                  <p className="text-[11px] text-muted-foreground/80">
                    When visitors click &quot;Download PDF&quot; on your portfolio, this URL will be downloaded.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 4: EDUCATION & DEGREES
              ==================================================== */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Academic Education</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Manage college degrees, engineering institutions, GPA, and coursework.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingEdu({
                      institution: '',
                      degree: '',
                      field: 'Computer Science & Engineering',
                      duration: '2021 — 2025',
                      score: '',
                      location: 'India',
                      achievements: [],
                    });
                    setIsEduModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-card border border-border flex items-start justify-between gap-4 card-beam"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <h3 className="text-base font-bold text-foreground">{edu.degree}</h3>
                        {edu.field && (
                          <span className="text-xs font-mono text-muted-foreground">in {edu.field}</span>
                        )}
                      </div>
                      <p className="text-sm text-primary font-mono">{edu.institution}</p>
                      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                        <span>{edu.duration}</span>
                        {edu.score && <span>• {edu.score}</span>}
                        {edu.location && <span>• {edu.location}</span>}
                      </div>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul className="list-disc pl-5 text-xs text-muted-foreground pt-2 space-y-1">
                          {edu.achievements.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingEdu(edu);
                          setIsEduModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${edu.degree}?`)) {
                            const updated = educations.filter((_, i) => i !== idx);
                            setEducations(updated);
                            saveSection('educations', updated);
                          }
                        }}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 5: EXPERIENCE & CAREER
              ==================================================== */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Work Experience &amp; Positions</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Manage companies, engineering roles, durations, and key technical accomplishments.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingExp({
                      company: '',
                      role: '',
                      duration: '2024 — Present',
                      description: '',
                      technologies: [],
                      achievements: [],
                      current: true,
                    });
                    setIsExpModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-card border border-border flex items-start justify-between gap-4 card-beam"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <h3 className="text-base font-bold text-foreground">{exp.role}</h3>
                        <span className="text-sm font-mono text-primary font-semibold">@ {exp.company}</span>
                        {exp.current && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{exp.description}</p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 pt-1">
                          {exp.achievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      )}
                      {exp.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.technologies.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingExp(exp);
                          setIsExpModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${exp.role} at ${exp.company}?`)) {
                            const updated = experiences.filter((_, i) => i !== idx);
                            setExperiences(updated);
                            saveSection('experiences', updated);
                          }
                        }}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 6: PROJECTS & WORKS
              ==================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Projects &amp; Flagship Works</h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Add new engineering case studies, update tags, links, and tiers (Tier S Flagships / Tier A).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      slug: '',
                      name: '',
                      tagline: '',
                      description: '',
                      category: 'Full Stack',
                      tier: 'A',
                      type: 'Web Application',
                      technologies: [],
                      features: [],
                      links: { live: '', github: '' },
                      color: '#00f0ff',
                      year: '2025',
                      role: 'Lead Full-Stack Architect',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.slug || idx}
                    className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-4 card-beam"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            proj.tier === 'S'
                              ? 'bg-primary/20 text-primary border border-border-accent'
                              : 'bg-surface text-muted-foreground border border-border'
                          }`}
                        >
                          Tier {proj.tier} • {proj.category}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">{proj.year}</span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground">{proj.name}</h3>
                      <p className="text-xs font-mono text-primary">{proj.tagline}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        {proj.links.live && (
                          <a
                            href={proj.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {proj.links.github && (
                          <a
                            href={proj.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${proj.name}"?`)) {
                              const updated = projects.filter((_, i) => i !== idx);
                              setProjects(updated);
                              saveSection('projects', updated);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====================================================
          MODAL: PROJECT ADD / EDIT
          ==================================================== */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl text-foreground card-beam">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingProject.name ? `Edit: ${editingProject.name}` : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-muted-foreground">Project Name</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEditingProject({ ...editingProject, name, slug: editingProject.slug || slug });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  placeholder="e.g. Nexus AI"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">URL Slug</label>
                <input
                  type="text"
                  value={editingProject.slug}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  placeholder="nexus-ai"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-muted-foreground">Tagline</label>
                <input
                  type="text"
                  value={editingProject.tagline}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  placeholder="Real-Time Autonomous Agent Platform"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Tier</label>
                <select
                  value={editingProject.tier}
                  onChange={(e) => setEditingProject({ ...editingProject, tier: e.target.value as 'S' | 'A' | 'B' })}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                >
                  <option value="S">Tier S (Flagship Featured)</option>
                  <option value="A">Tier A (Core Production)</option>
                  <option value="B">Tier B (Supporting System)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Category</label>
                <input
                  type="text"
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  placeholder="Full Stack / Realtime / AI"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-muted-foreground">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  placeholder="React 19, Next.js, Node.js, Socket.IO"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Live URL</label>
                <input
                  type="url"
                  value={editingProject.links.live || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      links: { ...editingProject.links, live: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">GitHub URL</label>
                <input
                  type="url"
                  value={editingProject.links.github || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      links: { ...editingProject.links, github: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const existingIndex = projects.findIndex((p) => p.slug === editingProject.slug);
                  let updated: Project[];
                  if (existingIndex >= 0) {
                    updated = [...projects];
                    updated[existingIndex] = editingProject;
                  } else {
                    updated = [editingProject, ...projects];
                  }
                  setProjects(updated);
                  saveSection('projects', updated);
                  setIsProjectModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: EDUCATION ADD / EDIT
          ==================================================== */}
      {isEduModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl text-foreground card-beam">
            <h3 className="text-base font-bold text-foreground">
              {editingEdu.degree ? 'Edit Education' : 'Add Academic Qualification'}
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-muted-foreground">Degree / Certificate</label>
                <input
                  type="text"
                  value={editingEdu.degree}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="Bachelor of Technology (B.Tech)"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Institution / University</label>
                <input
                  type="text"
                  value={editingEdu.institution}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="APJ Abdul Kalam Technological University"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Duration</label>
                  <input
                    type="text"
                    value={editingEdu.duration}
                    onChange={(e) => setEditingEdu({ ...editingEdu, duration: e.target.value })}
                    placeholder="2021 — 2025"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Score / GPA</label>
                  <input
                    type="text"
                    value={editingEdu.score || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, score: e.target.value })}
                    placeholder="First Class with Distinction"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setIsEduModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = [...educations, editingEdu];
                  setEducations(updated);
                  saveSection('educations', updated);
                  setIsEduModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Save Qualification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL: EXPERIENCE ADD / EDIT
          ==================================================== */}
      {isExpModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl text-foreground card-beam">
            <h3 className="text-base font-bold text-foreground">
              {editingExp.company ? `Edit Role at ${editingExp.company}` : 'Add Work Experience'}
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-muted-foreground">Job Role</label>
                <input
                  type="text"
                  value={editingExp.role}
                  onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                  placeholder="Full-Stack Engineer"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Duration</label>
                <input
                  type="text"
                  value={editingExp.duration}
                  onChange={(e) => setEditingExp({ ...editingExp, duration: e.target.value })}
                  placeholder="2024 — Present"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Technologies Used (comma-separated)</label>
                <input
                  type="text"
                  value={editingExp.technologies.join(', ')}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Node.js, Next.js, Redis, MongoDB"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-mono text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = [...experiences, editingExp];
                  setExperiences(updated);
                  saveSection('experiences', updated);
                  setIsExpModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
