'use client';

import React, { useState, useEffect } from 'react';
import { User, Briefcase, Mail, Building2, CheckCircle2, Sparkles, LogOut, X, Shield } from 'lucide-react';

interface VisitorUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  purpose?: string;
}

interface VisitorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: (user: VisitorUser | null) => void;
}

export function VisitorAuthModal({ isOpen, onClose, onUserUpdate }: VisitorAuthModalProps) {
  const [currentUser, setCurrentUser] = useState<VisitorUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [_checking, setChecking] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Technical Recruiter');
  const [purpose, setPurpose] = useState<'hiring' | 'freelance' | 'networking' | 'viewing'>('hiring');
  const [notes, setNotes] = useState('');

  // Check if visitor is already logged in
  useEffect(() => {
    async function checkVisitorSession() {
      try {
        const res = await fetch('/api/visitor/auth');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          if (onUserUpdate) onUserUpdate(data.user);
        }
      } catch {
        // Not signed in
      } finally {
        setChecking(false);
      }
    }
    if (isOpen) {
      checkVisitorSession();
    }
  }, [isOpen, onUserUpdate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !email.trim()) {
      setFeedback({ type: 'error', text: 'Please provide both your name and email address.' });
      return;
    }

    setLoading(true);
    try {
      const visitorId = localStorage.getItem('pv_guest_id') || undefined;

      const res = await fetch('/api/visitor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          role,
          purpose,
          notes,
          visitorId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        if (onUserUpdate) onUserUpdate(data.user);
        setFeedback({ type: 'success', text: `Welcome, ${data.user.name}! Recruiter pass activated.` });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to sign in.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/visitor/auth', { method: 'DELETE' });
      setCurrentUser(null);
      if (onUserUpdate) onUserUpdate(null);
      setFeedback({ type: 'success', text: 'Signed out from recruiter pass.' });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div
        data-lenis-prevent
        className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl text-foreground card-beam relative max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground bg-surface hover:bg-surface-elevated transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-border-accent">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {currentUser ? 'Recruiter & Client Pass' : 'Visitor / Recruiter Sign-in'}
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {currentUser
                ? 'Your verified portfolio pass is currently active'
                : 'Introduce yourself to Rahul for priority hiring & collaboration'}
            </p>
          </div>
        </div>

        {currentUser ? (
          // Active Recruiter Pass Card
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-surface border border-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-muted-foreground">Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Recruiter Pass
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-bold text-foreground">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Work Email</span>
                <span className="text-foreground">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Company / Organization</span>
                <span className="text-primary font-bold">{currentUser.company || 'Independent'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role / Title</span>
                <span className="text-foreground">{currentUser.role}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-primary/10 border border-border-accent text-xs font-mono text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>
                Your visits and interactions are recorded in Rahul&apos;s VIP Client Intelligence dashboard.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={handleSignOut}
                className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-destructive flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Pass</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          // Registration / Sign-in Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3 text-primary" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (e.g. Engineering Lead)"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3 text-primary" />
                  <span>Work Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-primary" />
                  <span>Company / Organization</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Vercel, Startup"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  <span>Your Role</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground font-mono focus:outline-none focus:border-border-accent"
                >
                  <option value="Technical Recruiter">Technical Recruiter</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="Founder / CEO">Founder / CEO</option>
                  <option value="Client (Freelance / Contract)">Client (Freelance / Contract)</option>
                  <option value="Software Engineer / Peer">Software Engineer / Peer</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Primary Purpose</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'hiring', label: 'Hiring Role' },
                    { id: 'freelance', label: 'Freelance Project' },
                    { id: 'networking', label: 'Networking' },
                    { id: 'viewing', label: 'Just Exploring' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPurpose(p.id as typeof purpose)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                        purpose === p.id
                          ? 'bg-primary text-primary-foreground border-primary font-bold'
                          : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-muted-foreground">Quick Note / Inquiry (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any role description, budget, or message for Rahul..."
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-input text-foreground font-sans text-xs placeholder:text-muted-foreground focus:outline-none focus:border-border-accent"
                />
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <X className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[11px] font-mono text-muted-foreground">
                Zero spam. Directly alerts Rahul.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Activating Pass...' : 'Get Recruiter Pass'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
