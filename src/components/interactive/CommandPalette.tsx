'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FolderGit2,
  Cpu,
  Bot,
  User,
  Briefcase,
  Mail,
  ExternalLink,
  Terminal,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { personalInfo } from '@/lib/data/portfolio';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
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
      label: 'Engineering Architecture & Stack',
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
      id: 'resume',
      label: 'View / Download Resume',
      category: 'Actions',
      icon: FileText,
      action: () => {
        router.push('/resume');
        setIsOpen(false);
      },
    },
    {
      id: 'terminal',
      label: 'Open Developer Terminal',
      category: 'Developer Tools',
      icon: Terminal,
      action: () => {
        window.dispatchEvent(new CustomEvent('toggle-terminal'));
        setIsOpen(false);
      },
    },
    {
      id: 'copy-email',
      label: copied ? 'Copied Email to Clipboard!' : 'Copy Direct Email (rahulraj2148@gmail.com)',
      category: 'Actions',
      icon: copied ? Check : Copy,
      action: () => {
        navigator.clipboard.writeText(personalInfo.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      id: 'github',
      label: 'Open GitHub Profile (Rahul-2148)',
      category: 'External',
      icon: ExternalLink,
      action: () => {
        window.open(personalInfo.github, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
      },
    },
    {
      id: 'contact',
      label: 'Send Direct Message',
      category: 'Navigation',
      icon: Mail,
      action: () => {
        router.push('/contact');
        setIsOpen(false);
      },
    },
  ];

  const filtered = actions.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0d0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, section, or project..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-white placeholder:text-neutral-500 text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-neutral-500 hover:text-white p-1 rounded-md"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">
              No matching commands or routes found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'hover:bg-white/5 text-neutral-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-neutral-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#08080c] border-t border-white/5 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 text-[10px]">↑↓</span>
            <span>Navigate</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 text-[10px]">↵</span>
            <span>Select</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 text-[10px]">ESC</span>
            <span>Close</span>
          </div>
          <span className="text-cyan-400/80">Command Palette Active</span>
        </div>
      </div>
    </div>
  );
}
export default CommandPalette;
