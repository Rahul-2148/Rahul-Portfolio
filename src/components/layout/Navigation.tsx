'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Terminal,
  Search,
  Menu,
  X,
  FileText,
  ChevronDown,
  GraduationCap,
  Cpu,
  Sparkles,
  ArrowRight,
  Home,
  Briefcase,
  User,
  Mail,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/interactive/ThemeToggle';
import { personalInfo } from '@/lib/data/portfolio';

// Core essential pages displayed directly in the navbar
const primaryNavItems = [
  { label: 'Work', href: '/work', icon: Briefcase },
  { label: 'Experience', href: '/experience', icon: Briefcase },
  { label: 'About', href: '/about', icon: User },
  { label: 'Contact', href: '/contact', icon: Mail },
];

// Extended / secondary pages placed neatly under the "More" dropdown
const extendedNavItems = [
  {
    label: 'Education',
    href: '/education',
    description: 'Academic degrees, distinction scores & coursework',
    icon: GraduationCap,
    badge: 'Degrees',
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:border-sky-500/40',
  },
  {
    label: 'Engineering',
    href: '/engineering',
    description: 'System design principles, standards & tech stack',
    icon: Cpu,
    badge: 'Architecture',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/40',
  },
  {
    label: 'AI Lab',
    href: '/ai-lab',
    description: 'Interactive LLM agents, live sandboxes & tools',
    icon: Sparkles,
    badge: 'AI Sandbox',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40',
  },
  {
    label: 'Resume Web View',
    href: '/resume',
    description: 'Interactive digital CV & printable format',
    icon: FileText,
    badge: 'Interactive',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/40',
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse hover handlers for instant yet smooth desktop dropdown
  const handleDropdownMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setMoreOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 160);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Click outside and escape key listener for More dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const router = useRouter();
  const logoClicksRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  const handleLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - logoClicksRef.current.lastTime < 800) {
      logoClicksRef.current.count += 1;
    } else {
      logoClicksRef.current.count = 1;
    }
    logoClicksRef.current.lastTime = now;

    if (logoClicksRef.current.count >= 3) {
      e.preventDefault();
      logoClicksRef.current.count = 0;
      router.push('/admin');
    }
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const toggleTerminal = () => {
    window.dispatchEvent(new CustomEvent('toggle-terminal'));
  };

  // Check if any extended item is currently active
  const isExtendedActive = extendedNavItems.some(
    (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  );

  // Standalone Documentation page has its own dedicated full-width header
  if (pathname === '/docs' || pathname.startsWith('/docs')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-background/80 backdrop-blur-xl border-b border-border shadow-xs'
            : 'py-3 sm:py-3.5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group shrink-0"
            data-cursor="HOME"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                Rahul Raj
              </span>
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
                Systems Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Streamlined & Uncluttered */}
          <nav className="hidden md:flex items-center gap-1 bg-surface/90 border border-border px-3 py-1.5 rounded-full backdrop-blur-md shadow-xs">
            {primaryNavItems.slice(0, 3).map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`px-3.5 py-1 text-xs font-medium rounded-full border transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary/15 text-primary border-border-accent shadow-xs'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40'
                  }`}
                  data-cursor="NAV"
                >
                  {item.label}
                </Link>
              );
            })}

            {/* "More" Interactive Dropdown Button (Hover & Click Supported) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-expanded={moreOpen}
                className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer select-none ${
                  isExtendedActive || moreOpen
                    ? 'bg-primary/15 text-primary border-border-accent shadow-xs'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40'
                }`}
                data-cursor="MORE"
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                    moreOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                  }`}
                />
              </button>

              {/* Animated Glassmorphism Dropdown Menu */}
              {moreOpen && (
                <div
                  data-lenis-prevent
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-80 sm:w-96 rounded-2xl bg-card/95 backdrop-blur-2xl border border-border shadow-2xl shadow-primary/10 p-2.5 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto overscroll-contain touch-pan-y"
                  role="menu"
                >
                  {/* Subtle top glow highlight bar */}
                  <div className="absolute -top-[1px] left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent rounded-full" />

                  <div className="px-3 py-2 flex items-center justify-between border-b border-border/50 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                      Explore More
                    </span>
                    <span className="text-[10px] font-mono text-primary/80">
                      4 Specialized Pages
                    </span>
                  </div>

                  <div className="space-y-1">
                    {extendedNavItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150 group border ${
                            isActive
                              ? 'bg-primary/10 border-primary/30 text-primary'
                              : 'border-transparent hover:bg-surface-elevated hover:border-border text-foreground'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-105 ${item.color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-xs font-bold font-mono group-hover:text-primary transition-colors truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface border border-border text-muted-foreground shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Link */}
            {primaryNavItems.slice(3).map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1 text-xs font-medium rounded-full border transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary/15 text-primary border-border-accent shadow-xs'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40'
                  }`}
                  data-cursor="NAV"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Affordances */}
          <div className="flex items-center gap-2">
            {/* Quick Command Palette Button */}
            <button
              onClick={openCommandPalette}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-xs text-muted-foreground hover:text-foreground transition-all shadow-xs cursor-pointer"
              title="Command Palette (Cmd+K / Ctrl+K)"
              data-cursor="SEARCH"
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-[11px]">⌘K</span>
            </button>

            {/* Prominent Download CV Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-resume-modal'))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-sm shadow-purple-500/25 hover:shadow-md hover:scale-105 active:scale-95 group cursor-pointer"
              title="View & Download Resume"
              data-cursor="CV"
            >
              <FileText className="w-3.5 h-3.5 text-purple-200 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Download CV</span>
              <span className="inline sm:hidden">CV</span>
            </button>

            {/* Terminal Button */}
            <button
              onClick={toggleTerminal}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-primary transition-all shadow-xs cursor-pointer"
              title="Developer Terminal"
              data-cursor="CLI"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* GitHub */}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="hidden min-[480px]:flex items-center justify-center w-8 h-8 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-all shadow-xs"
              title="GitHub Profile"
              data-cursor="GITHUB"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* Theme Toggle (Dark/Light) */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-border text-foreground hover:bg-surface-elevated transition-colors ml-1 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation — Elegantly Partitioned */}
      {mobileMenuOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-2xl pt-20 px-5 pb-8 flex flex-col justify-between overflow-y-auto overscroll-contain touch-pan-y animate-in fade-in duration-200"
        >
          <div className="space-y-5">
            {/* Core Navigation Section */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2 px-1 font-semibold">
                Core Pages
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  prefetch={true}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                    pathname === '/'
                      ? 'bg-primary/15 text-primary border border-border-accent'
                      : 'text-foreground bg-surface/70 hover:bg-surface border border-border/50'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-primary" />
                  <span>Home</span>
                </Link>
                {primaryNavItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-primary/15 text-primary border border-border-accent'
                          : 'text-foreground bg-surface/70 hover:bg-surface border border-border/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Extended Repertoire Section */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2 px-1 font-semibold">
                Extended Repertoire
              </span>
              <div className="space-y-1.5">
                {extendedNavItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all border ${
                        isActive
                          ? 'bg-primary/15 text-primary border-primary/30 font-bold'
                          : 'text-foreground hover:bg-surface border-border/40'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted-foreground">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Mobile Action Buttons */}
          <div className="pt-4 border-t border-border space-y-2 mt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-resume-modal'));
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-xs font-mono font-bold shadow-md shadow-purple-500/20 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-200" />
                <span>View &amp; Download Resume</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/20">PDF</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCommandPalette();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground font-mono cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Search (⌘K)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleTerminal();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground font-mono cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>CLI Terminal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
