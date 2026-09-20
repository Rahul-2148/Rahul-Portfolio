'use client';

import React, { useState } from 'react';
import { Mail, MapPin, CheckCircle2, AlertCircle, Copy, Check, Send, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { personalInfo } from '@/lib/data/portfolio';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to deliver message. Please reach out directly via email.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error occurred. Please reach out directly via email.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent border border-border-accent text-accent-foreground text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Direct Channel</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Initiate Contact
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mt-3 leading-relaxed">
          Looking for a senior full-stack architect, high-throughput real-time systems builder, or AI product engineer? Send a direct transmission below or reach out via email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Info & Status */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Transmission Details</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground block">Direct Email</span>
                  <a href={`mailto:${personalInfo.email}`} className="text-foreground hover:text-primary transition-colors font-medium">
                    {personalInfo.email}
                  </a>
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-1.5 text-xs text-primary mt-1 hover:underline font-mono"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy email'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground block">GitHub Profile</span>
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    github.com/Rahul-2148
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-muted-foreground block">Location</span>
                  <span className="text-foreground">India (Available globally / remote)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <span className="text-xs font-mono uppercase text-muted-foreground block mb-2">Availability Notice</span>
              <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Actively considering Full-Stack, Backend &amp; AI opportunities.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-surface-elevated border border-border-accent rounded-2xl p-6 sm:p-10 shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Transmission Delivered</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Thank you for reaching out. Your message has been received and I will respond to you promptly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-surface hover:bg-muted border border-border text-xs font-mono text-foreground transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Your Name / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins or TechCorp Engineering"
                  className="w-full bg-surface border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full bg-surface border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Project Brief or Inquiry *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about the role, project requirements, architectural challenge, or engineering vision..."
                  className="w-full bg-surface border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-accent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
