import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'midnight-eco' | 'civic-light' | 'forest-obsidian' | 'industrial-safety';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  tagline: string;
  isDark: boolean;
  bgMain: string;
  bgCard: string;
  bgCardSubtle: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSecondary: string;
  leafletTiles: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  'midnight-eco': {
    id: 'midnight-eco',
    name: 'Midnight Eco',
    tagline: 'Deep navy background with emerald and safety orange accents',
    isDark: true,
    bgMain: 'bg-[#070e1c]',
    bgCard: 'bg-[#0b1325]',
    bgCardSubtle: 'bg-[#0f1b33]',
    border: 'border-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    accentPrimary: 'emerald',
    accentSecondary: 'orange',
    leafletTiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
  'civic-light': {
    id: 'civic-light',
    name: 'Civic Daylight',
    tagline: 'Clean high-contrast daytime mode for outdoor field road inspectors',
    isDark: false,
    bgMain: 'bg-[#f8fafc]',
    bgCard: 'bg-white',
    bgCardSubtle: 'bg-[#f1f5f9]',
    border: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accentPrimary: 'emerald',
    accentSecondary: 'orange',
    leafletTiles: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  },
  'forest-obsidian': {
    id: 'forest-obsidian',
    name: 'Forest Obsidian',
    tagline: 'Deep obsidian and bio-green sustainable maintenance theme',
    isDark: true,
    bgMain: 'bg-[#040c08]',
    bgCard: 'bg-[#081710]',
    bgCardSubtle: 'bg-[#0d2218]',
    border: 'border-emerald-900/40',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-100',
    textMuted: 'text-emerald-300/60',
    accentPrimary: 'emerald',
    accentSecondary: 'amber',
    leafletTiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
  'industrial-safety': {
    id: 'industrial-safety',
    name: 'Industrial Safety',
    tagline: 'Charcoal dark slate with bold highway-grade safety amber & orange',
    isDark: true,
    bgMain: 'bg-[#090a0f]',
    bgCard: 'bg-[#12141c]',
    bgCardSubtle: 'bg-[#1a1d28]',
    border: 'border-zinc-800',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textMuted: 'text-zinc-400',
    accentPrimary: 'orange',
    accentSecondary: 'emerald',
    leafletTiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
};

interface ThemeContextType {
  theme: AppTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AppTheme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('civic-light');

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('roadwatch_theme', newTheme);
  };

  const cycleTheme = () => {
    const list: AppTheme[] = ['civic-light', 'midnight-eco', 'forest-obsidian', 'industrial-safety'];
    const nextIndex = (list.indexOf(theme) + 1) % list.length;
    setTheme(list[nextIndex]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('roadwatch_theme') as AppTheme;
    if (saved && THEMES[saved]) {
      setThemeState(saved);
    } else {
      setThemeState('civic-light');
      localStorage.setItem('roadwatch_theme', 'civic-light');
    }
  }, []);

  useEffect(() => {
    const isDark = THEMES[theme].isDark;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEMES[theme],
        setTheme,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
