export type ThemeId =
  | 'cyber-cyan'
  | 'synth-violet'
  | 'matrix-emerald'
  | 'solar-amber'
  | 'crimson-overdrive'
  | 'studio-light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  label: string;
  mode: 'dark' | 'light';
  primaryColor: string;
  secondaryColor: string;
  accentRgb: string;
}

export const themes: ThemeConfig[] = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    label: 'Electric Cyan & Deep Cobalt',
    mode: 'dark',
    primaryColor: '#00f0ff',
    secondaryColor: '#3b82f6',
    accentRgb: '0, 240, 255',
  },
  {
    id: 'synth-violet',
    name: 'Synth Violet',
    label: 'Neon Purple & Radiant Pink',
    mode: 'dark',
    primaryColor: '#a855f7',
    secondaryColor: '#ec4899',
    accentRgb: '168, 85, 247',
  },
  {
    id: 'matrix-emerald',
    name: 'Matrix Emerald',
    label: 'Cybernetic Terminal Green',
    mode: 'dark',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    accentRgb: '16, 185, 129',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    label: 'High Voltage Gold & Flare',
    mode: 'dark',
    primaryColor: '#f59e0b',
    secondaryColor: '#f97316',
    accentRgb: '245, 158, 11',
  },
  {
    id: 'crimson-overdrive',
    name: 'Crimson Overdrive',
    label: 'High Performance Neon Red',
    mode: 'dark',
    primaryColor: '#ff2a5f',
    secondaryColor: '#fb923c',
    accentRgb: '255, 42, 95',
  },
  {
    id: 'studio-light',
    name: 'Studio Light',
    label: 'Clean Editorial Studio White',
    mode: 'light',
    primaryColor: '#0066cc',
    secondaryColor: '#0284c7',
    accentRgb: '0, 102, 204',
  },
];

export const DEFAULT_THEME: ThemeId = 'cyber-cyan';

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem('rahul-portfolio-theme') as ThemeId | null;
  if (stored && themes.some((t) => t.id === stored)) {
    return stored;
  }
  return DEFAULT_THEME;
}

export function setTheme(themeId: ThemeId) {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', themeId);
  const config = themes.find((t) => t.id === themeId);
  if (config?.mode === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
  localStorage.setItem('rahul-portfolio-theme', themeId);
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: themeId }));
}
