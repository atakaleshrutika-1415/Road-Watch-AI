import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme, THEMES, AppTheme } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
          themeConfig.isDark
            ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80'
            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
        }`}
        title="Switch Interface Theme"
      >
        <Palette className="w-3.5 h-3.5 text-emerald-500" />
        <span className="hidden sm:inline font-medium">{themeConfig.name}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-xl border p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 ${
            themeConfig.isDark
              ? 'bg-[#0b1325] border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
            Select Visual Theme
          </div>

          <div className="space-y-1 mt-1">
            {(Object.keys(THEMES) as AppTheme[]).map((tKey) => {
              const item = THEMES[tKey];
              const isSelected = theme === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => {
                    setTheme(tKey);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? themeConfig.isDark
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                      : themeConfig.isDark
                      ? 'hover:bg-slate-900/80 text-slate-300'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                        item.id === 'midnight-eco'
                          ? 'bg-[#070e1c] border border-emerald-400'
                          : item.id === 'civic-light'
                          ? 'bg-[#f8fafc] border border-slate-400'
                          : item.id === 'forest-obsidian'
                          ? 'bg-[#040c08] border border-emerald-500'
                          : 'bg-[#090a0f] border border-orange-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-xs leading-none">{item.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.tagline}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
