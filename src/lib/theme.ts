export type ThemeMode = 'dark' | 'light';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  label: string;
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentRgb: string;
}

export const themes: Record<ThemeMode, ThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    label: 'Deep Neural Slate',
    mode: 'dark',
    primaryColor: '#6366f1',
    secondaryColor: '#38bdf8',
    accentRgb: '99, 102, 241',
  },
  light: {
    id: 'light',
    name: 'Light',
    label: 'Clean Architectural Paper',
    mode: 'light',
    primaryColor: '#4338ca',
    secondaryColor: '#0284c7',
    accentRgb: '67, 56, 202',
  },
};

export const DEFAULT_THEME: ThemeMode = 'dark';

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const docTheme = document.documentElement.getAttribute('data-theme') as ThemeMode | null;
    if (docTheme === 'dark' || docTheme === 'light') {
      return docTheme;
    }
    const stored = localStorage.getItem('rahul-portfolio-theme') as ThemeMode | null;
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // LocalStorage access might be blocked
  }
  return DEFAULT_THEME;
}

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

export function setTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  
  if (transitionTimer) {
    clearTimeout(transitionTimer);
  }

  // Smoothly transition colors during explicit user clicks
  root.classList.add('theme-transitioning');
  root.setAttribute('data-theme', theme);
  
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
  
  try {
    localStorage.setItem('rahul-portfolio-theme', theme);
  } catch {
    // Ignore storage quota or disabled storage
  }
  
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));

  transitionTimer = setTimeout(() => {
    root.classList.remove('theme-transitioning');
    transitionTimer = null;
  }, 250);
}

export function toggleTheme(): ThemeMode {
  const current = getStoredTheme();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
