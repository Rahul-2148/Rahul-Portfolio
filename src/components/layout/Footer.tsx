'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUp, Copy, Check, Terminal, ExternalLink, Heart } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterXIcon,
  InstagramIcon,
  LeetcodeIcon,
  CodeforcesIcon,
} from '@/components/ui/Icons';
import { personalInfo, navItems } from '@/lib/data/portfolio';

export function Footer() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // Standalone Documentation page does not render public footer
  if (pathname === '/docs' || pathname?.startsWith('/docs')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };

  const socialLinks = [
    {
      name: 'GitHub',
      label: 'GitHub',
      handle: '@Rahul-2148',
      href: personalInfo.github || 'https://github.com/Rahul-2148',
      icon: GithubIcon,
      badgeClass:
        'bg-[#24292F] hover:bg-[#1B1F23] border border-slate-700/80 text-white shadow-md shadow-black/40 hover:border-slate-400 hover:shadow-[0_0_18px_rgba(255,255,255,0.25)]',
    },
    {
      name: 'LinkedIn',
      label: 'LinkedIn',
      handle: 'rahulraj2148',
      href: personalInfo.linkedin || 'https://linkedin.com/in/rahulraj2148',
      icon: LinkedinIcon,
      badgeClass:
        'bg-[#0A66C2] hover:bg-[#004182] border border-[#0A66C2] text-white shadow-md shadow-[#0A66C2]/40 hover:shadow-[0_0_20px_rgba(10,102,194,0.6)]',
    },
    {
      name: 'Twitter (X)',
      label: 'X (Twitter)',
      handle: '@rahulraj2148',
      href: personalInfo.twitter || 'https://x.com/rahulraj2148',
      icon: TwitterXIcon,
      badgeClass:
        'bg-black hover:bg-neutral-900 border border-neutral-800 text-white shadow-md shadow-black/50 hover:border-neutral-500 hover:shadow-[0_0_18px_rgba(255,255,255,0.2)]',
    },
    {
      name: 'Instagram',
      label: 'Instagram',
      handle: '@rahulraj2148',
      href: personalInfo.instagram || 'https://instagram.com/rahulraj2148',
      icon: InstagramIcon,
      badgeClass:
        'bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] border border-white/20 text-white shadow-md shadow-[#bc1888]/40 hover:shadow-[0_0_22px_rgba(214,36,159,0.7)]',
    },
    {
      name: 'LeetCode',
      label: 'LeetCode',
      handle: 'rahulraj2148',
      href: personalInfo.leetcode || 'https://leetcode.com/u/rahulraj2148',
      icon: LeetcodeIcon,
      badgeClass:
        'bg-[#262626] hover:bg-[#1f1f1f] border border-[#FFA116]/50 text-white shadow-md shadow-[#FFA116]/25 hover:border-[#FFA116] hover:shadow-[0_0_18px_rgba(255,161,22,0.5)]',
    },
    {
      name: 'Codeforces',
      label: 'Codeforces',
      handle: 'rahulraj2148',
      href: personalInfo.codeforces || 'https://codeforces.com/profile/rahulraj2148',
      icon: CodeforcesIcon,
      badgeClass:
        'bg-[#181B26] hover:bg-[#202534] border border-[#1878F3]/50 text-white shadow-md shadow-[#1878F3]/25 hover:border-[#1878F3] hover:shadow-[0_0_18px_rgba(24,120,243,0.5)]',
    },
  ];

  return (
    <footer className="border-t border-border bg-surface relative overflow-hidden pt-5 pb-20 sm:pt-6 sm:pb-5">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 pb-4 sm:pb-4.5 border-b border-border">
          {/* Col 1: Identity & Socials */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm shadow-md shadow-primary/20">
                R
              </div>
              <div>
                <span className="font-semibold text-foreground tracking-tight text-base sm:text-lg block">
                  Rahul Raj
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Full-Stack Engineer &amp; Systems Architect
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              Engineering high-throughput distributed architectures, real-time event-driven applications, and modern MERN/Next.js platforms.
            </p>

            <div className="flex items-center gap-2.5 pt-0.5 flex-wrap">
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-muted border border-border text-xs font-mono text-foreground hover:text-primary transition-all duration-200 cursor-pointer hover:scale-102"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                <span>{copied ? 'Copied to Clipboard' : personalInfo.email}</span>
              </button>

              <button
                onClick={toggleTerminal}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-100 dark:bg-purple-950/80 dark:hover:bg-purple-900 dark:text-purple-200 border border-slate-700/80 dark:border-purple-500/60 text-xs font-mono font-bold transition-all duration-300 ease-out hover:scale-105 hover:shadow-md hover:shadow-purple-500/20 active:scale-95 cursor-pointer"
                title="Open Developer Terminal"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out" />
                <span>CLI Terminal</span>
              </button>
            </div>

            {/* Social & Competitive Programming Icons Row with Real Authentic Colors */}
            <div className="pt-1">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                Profiles &amp; Coding Handles
              </p>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${item.name} (${item.handle})`}
                      className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-110 active:scale-95 inline-flex items-center justify-center shrink-0 shadow-sm ${item.badgeClass}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Navigation
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary transition-colors inline-block py-0.5">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors inline-flex items-center gap-1 py-0.5 text-cyan-600 dark:text-cyan-400 font-medium">
                  <span>API Docs (Swagger)</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Availability & Direct Connect */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
              Availability &amp; Location
            </p>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                <span>Open for Full-Time &amp; Contracts</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary/70 inline-block shrink-0" />
                <span>India • Available for Global Remote</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block shrink-0" />
                <span>Typical Response: Under 24 Hours</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-md shadow-purple-600/25 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-purple-600/35 active:scale-95"
              >
                <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
                <span>Start a conversation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar with Author Credits */}
        <div className="pt-3 sm:pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
            <p className="text-foreground/90 font-medium inline-flex items-center justify-center sm:justify-start gap-1">
              <span>Designed &amp; Developed by</span>
              <span className="text-primary font-bold">Rahul Raj</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline ml-0.5" />
            </p>
            <span className="hidden sm:inline text-muted-foreground/60">•</span>
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Rahul Raj Modi. All rights reserved.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group cursor-pointer py-1 px-2 rounded-md hover:bg-surface-elevated"
            title="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
