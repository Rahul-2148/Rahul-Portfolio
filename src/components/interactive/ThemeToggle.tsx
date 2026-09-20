'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check } from 'lucide-react';
import { themes, ThemeId, getStoredTheme, setTheme } from '@/lib/theme';

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('cyber-cyan');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getStoredTheme();
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);

    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<ThemeId>).detail;
      if (detail) {
        setCurrentTheme(detail);
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectTheme = (themeId: ThemeId) => {
    setTheme(themeId);
    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  const activeConfig = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white transition-all"
        title="Switch Color Theme"
        data-cursor="THEME"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-sm"
          style={{ backgroundColor: activeConfig.primaryColor }}
        />
        <Palette className="w-3.5 h-3.5 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0e0e18] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-mono text-xs">
          <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-neutral-500 border-b border-white/5 mb-1">
            Color Themes
          </div>

          <div className="space-y-1">
            {themes.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs">{theme.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default ThemeToggle;
