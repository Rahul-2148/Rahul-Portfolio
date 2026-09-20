export type ThemeId = 'cyber-cyan' | 'synth-violet' | 'matrix-emerald' | 'solar-amber' | 'crimson-overdrive';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  accentRgb: string;
}

export const themes: ThemeConfig[] = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    label: 'Electric Cyan & Deep Cobalt',
    primaryColor: '#00f0ff',
    secondaryColor: '#3b82f6',
    accentRgb: '0, 240, 255',
  },
  {
    id: 'synth-violet',
    name: 'Synth Violet',
    label: 'Neon Purple & Radiant Pink',
    primaryColor: '#a855f7',
    secondaryColor: '#ec4899',
    accentRgb: '168, 85, 247',
  },
  {
    id: 'matrix-emerald',
    name: 'Matrix Emerald',
    label: 'Cybernetic Terminal Green',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    accentRgb: '16, 185, 129',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    label: 'High Voltage Gold & Flare',
    primaryColor: '#f59e0b',
    secondaryColor: '#f97316',
    accentRgb: '245, 158, 11',
  },
  {
    id: 'crimson-overdrive',
    name: 'Crimson Overdrive',
    label: 'High Performance Neon Red',
    primaryColor: '#ff2a5f',
    secondaryColor: '#fb923c',
    accentRgb: '255, 42, 95',
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
  localStorage.setItem('rahul-portfolio-theme', themeId);
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: themeId }));
}
