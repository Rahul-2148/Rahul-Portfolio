'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode, getStoredTheme, toggleTheme } from '@/lib/theme';

export function ThemeToggle() {
  const [theme, setLocalTheme] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getStoredTheme();
    setLocalTheme(initial);

    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<ThemeMode>).detail;
      if (detail === 'dark' || detail === 'light') {
        setLocalTheme(detail);
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setLocalTheme(next);
  };

  const isLight = theme === 'light';

  return (
    <button
      onClick={handleToggle}
      suppressHydrationWarning
      className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-foreground transition-all duration-200 hover:border-border-accent shadow-xs active:scale-95 group"
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      data-cursor="THEME"
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`w-4 h-4 absolute inset-0 text-amber-500 transition-all duration-300 transform ${
            isLight
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        />
        <Moon
          className={`w-4 h-4 absolute inset-0 text-primary transition-all duration-300 transform ${
            !isLight
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-50 pointer-events-none'
          }`}
        />
      </div>
      <span className="sr-only">
        {mounted ? `Current theme: ${theme}. Click to switch.` : 'Toggle theme'}
      </span>
    </button>
  );
}

export default ThemeToggle;
