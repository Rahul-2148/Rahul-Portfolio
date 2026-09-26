'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  FolderGit2,
  Cpu,
  Bot,
  User,
  Briefcase,
  Mail,
  ExternalLink,
  Copy,
  Check,
  X,
  Sun,
  FileText,
} from 'lucide-react';
import { personalInfo } from '@/lib/data/portfolio';
import { toggleTheme } from '@/lib/theme';

export function CommandPalette({ initialOpen = false }: { initialOpen?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1500);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsOpen(false);
  };

  const actions = [
    {
      id: 'home',
      label: 'Home',
      category: 'Navigation',
      icon: User,
      action: () => {
        router.push('/');
        setIsOpen(false);
      },
    },
    {
      id: 'work',
      label: 'Selected Work & Projects',
      category: 'Navigation',
      icon: FolderGit2,
      action: () => {
        router.push('/work');
        setIsOpen(false);
      },
    },
    {
      id: 'flagship-zosh',
      label: 'Zosh Bazaar — Enterprise Multi-Vendor Platform',
      category: 'Projects',
      icon: FolderGit2,
      action: () => {
        router.push('/work/zosh-bazaar');
        setIsOpen(false);
      },
    },
    {
      id: 'flagship-snapcart',
      label: 'Snapcart — 10-Min Delivery System',
      category: 'Projects',
      icon: FolderGit2,
      action: () => {
        router.push('/work/snapcart');
        setIsOpen(false);
      },
    },
    {
      id: 'engineering',
      label: 'System Architecture & Domains',
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        router.push('/engineering');
        setIsOpen(false);
      },
    },
    {
      id: 'ai-lab',
      label: 'AI Lab & Intelligence Systems',
      category: 'Navigation',
      icon: Bot,
      action: () => {
        router.push('/ai-lab');
        setIsOpen(false);
      },
    },
    {
      id: 'about',
      label: 'About & Engineering Mindset',
      category: 'Navigation',
      icon: User,
      action: () => {
        router.push('/about');
        setIsOpen(false);
      },
    },
    {
      id: 'experience',
      label: 'Experience & Milestones',
      category: 'Navigation',
      icon: Briefcase,
      action: () => {
        router.push('/experience');
        setIsOpen(false);
      },
    },
    {
      id: 'contact',
      label: 'Initiate Contact Transmission',
      category: 'Navigation',
      icon: Mail,
      action: () => {
        router.push('/contact');
        setIsOpen(false);
      },
    },
    {
      id: 'theme-toggle',
      label: 'Switch Theme (Dark / Light)',
      category: 'Preferences',
      icon: Sun,
      action: handleToggleTheme,
    },
    {
      id: 'copy-email',
      label: `Copy Email (${personalInfo.email})`,
      category: 'Actions',
      icon: copied ? Check : Copy,
      action: copyEmail,
    },
    {
      id: 'open-github',
      label: 'Open GitHub Profile',
      category: 'Actions',
      icon: ExternalLink,
      action: () => {
        window.open(personalInfo.github, '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'view-resumes',
      label: 'Download & View Curated CVs (Multi-Profile)',
      category: 'Actions',
      icon: FileText,
      action: () => {
        setIsOpen(false);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-resume-modal'));
        }, 100);
      },
    },
    {
      id: 'resume-page',
      label: 'ATS Printable Resume Document',
      category: 'Navigation',
      icon: FileText,
      action: () => {
        router.push('/resume');
        setIsOpen(false);
      },
    },
  ];

  const filtered = actions.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (selectedIndex + 1) % filtered.length;
      setSelectedIndex(nextIndex);
      document.getElementById(`cmd-item-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (selectedIndex - 1 + filtered.length) % filtered.length;
      setSelectedIndex(prevIndex);
      document.getElementById(`cmd-item-${prevIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-popover text-popover-foreground border border-border rounded-2xl shadow-2xl overflow-hidden font-sans cursor-default"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        data-cursor=""
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or jump to page..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Results */}
        <div
          data-lenis-prevent
          data-cursor=""
          className="relative max-h-80 overflow-y-auto p-2 space-y-1 overscroll-contain touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-mono">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  id={`cmd-item-${index}`}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className="group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium select-none outline-none focus:outline-none transition-colors duration-150"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="command-palette-hover-pill"
                      className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/25 pointer-events-none z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 600,
                        damping: 38,
                        mass: 0.5,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3 min-w-0 pointer-events-none">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span
                      className={`truncate transition-colors duration-150 ${
                        isSelected ? 'text-primary font-bold' : 'text-foreground'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <span
                    className={`relative z-10 text-[10px] font-mono uppercase shrink-0 ml-2 transition-colors duration-150 pointer-events-none ${
                      isSelected ? 'text-primary/80 font-medium' : 'text-muted-foreground/60'
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-border bg-surface flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Rahul Raj Studio</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
