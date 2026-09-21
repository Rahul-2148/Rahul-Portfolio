'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Search, Menu, X, User, Briefcase } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/interactive/ThemeToggle';
import { VisitorAuthModal } from '@/components/interactive/VisitorAuthModal';
import { navItems, personalInfo } from '@/lib/data/portfolio';

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [visitorUser, setVisitorUser] = useState<{ name: string; company: string } | null>(null);

  useEffect(() => {
    async function checkVisitor() {
      try {
        const res = await fetch('/api/visitor/auth');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setVisitorUser(data.user);
        }
      } catch {
        // Not signed in
      }
    }
    checkVisitor();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-background/85 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            data-cursor="HOME"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                Rahul Raj
              </span>
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
                Full-Stack &amp; AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface border border-border px-3 py-1.5 rounded-full backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-border-accent shadow-xs shadow-primary/10 font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  data-cursor="NAV"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Command Palette, Terminal, Status */}
          <div className="flex items-center gap-2.5">
            {/* Live status dot */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium">Available</span>
            </div>

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Command Palette Trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-colors text-xs font-mono"
              title="Open Command Palette (Ctrl+K)"
              data-cursor="SEARCH"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1 py-0.5 text-[9px] bg-muted rounded text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            {/* Terminal Toggle */}
            <button
              onClick={toggleTerminal}
              className="p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-primary transition-colors"
              title="Open Developer Terminal"
              data-cursor="CLI"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Recruiter / Visitor Pass Button */}
            <button
              onClick={() => setVisitorModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                visitorUser
                  ? 'bg-primary/15 text-primary border-border-accent shadow-xs font-semibold'
                  : 'bg-surface hover:bg-surface-elevated border-border text-muted-foreground hover:text-foreground'
              }`}
              title={visitorUser ? `Signed in as ${visitorUser.name}` : 'Recruiter & Client Pass'}
            >
              {visitorUser ? (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">
                    {visitorUser.name.split(' ')[0]} ({visitorUser.company || 'Pass'})
                  </span>
                  <span className="sm:hidden">Pass</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden md:inline">Recruiter Pass</span>
                  <span className="md:hidden">Pass</span>
                </>
              )}
            </button>

            {/* GitHub link */}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-colors"
              title="GitHub Profile"
              data-cursor="GITHUB"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-2xl pt-20 px-6 pb-8 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-3 pt-4">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Navigation</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status</span>
              <span className="text-emerald-500 font-mono">Available for Opportunities</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCommandPalette();
                }}
                className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-xs font-mono text-center text-foreground flex items-center justify-center gap-2 hover:bg-surface-elevated transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-primary" /> Command Palette
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleTerminal();
                }}
                className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-xs font-mono text-center text-foreground flex items-center justify-center gap-2 hover:bg-surface-elevated transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-primary" /> Terminal
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setVisitorModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-primary/10 border border-border-accent text-xs font-mono text-primary flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-primary" />
              <span>{visitorUser ? `Active Pass: ${visitorUser.name}` : 'Recruiter & Visitor Pass'}</span>
            </button>
          </div>
        </div>
      )}

      <VisitorAuthModal
        isOpen={visitorModalOpen}
        onClose={() => setVisitorModalOpen(false)}
        onUserUpdate={(u) => setVisitorUser(u ? { name: u.name, company: u.company } : null)}
      />
    </>
  );
}
export default Navigation;
