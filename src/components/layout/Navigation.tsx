'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Search, Menu, X } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/interactive/ThemeToggle';
import { navItems, personalInfo } from '@/lib/data/portfolio';

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </div>
        </div>
      )}
    </>
  );
}
export default Navigation;
