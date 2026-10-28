import React from 'react';
import { Leaf, Sparkles, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

export type NavTab = 'sustainability' | 'ai-lab' | 'map' | 'reports' | 'safety';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReportModal: () => void;
  onOpenDemoGuide: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenReportModal,
  onOpenDemoGuide,
  pendingCount,
}) => {
  const { themeConfig } = useTheme();

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 transition-colors border-b ${
        themeConfig.isDark
          ? 'bg-[#070e1c]/95 border-emerald-950/40 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark with Leaf motif */}
        <button
          onClick={() => onSelectTab('sustainability')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-lg font-bold tracking-tight whitespace-nowrap shrink-0 ${
              themeConfig.isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            RoadWatch <span className="text-emerald-500">AI</span>
          </span>
        </button>

        {/* Zone 2: 5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('sustainability')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'sustainability'
                ? 'text-emerald-500 font-semibold border-b-2 border-emerald-500'
                : themeConfig.isDark
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sustainability Dashboard
          </button>

          <button
            onClick={() => onSelectTab('ai-lab')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'ai-lab'
                ? 'text-emerald-500 font-semibold border-b-2 border-emerald-500'
                : themeConfig.isDark
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Defect Vision</span>
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'map'
                ? 'text-emerald-500 font-semibold border-b-2 border-emerald-500'
                : themeConfig.isDark
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Hazard Map
          </button>

          <button
            onClick={() => onSelectTab('reports')}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'reports'
                ? 'text-emerald-500 font-semibold border-b-2 border-emerald-500'
                : themeConfig.isDark
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Repair Tracker</span>
            {pendingCount > 0 && (
              <span className="text-xs font-mono font-medium text-orange-400">
                ({pendingCount})
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('safety')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'safety'
                ? 'text-emerald-500 font-semibold border-b-2 border-emerald-500'
                : themeConfig.isDark
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Eco & Safety Guide
          </button>
        </nav>

        {/* Zone 3: 1 primary CTA + Theme Switcher + Track Guide */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeSwitcher />

          <button
            onClick={onOpenDemoGuide}
            title="Environment & Sustainability Track Guide"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              themeConfig.isDark
                ? 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border-slate-700/80'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Track Guide</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-md shadow-emerald-600/30 transition-all whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span>+ Report Defect</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div
        className={`flex md:hidden items-center justify-around gap-1 pt-3 mt-2 border-t text-xs ${
          themeConfig.isDark ? 'border-slate-800/60' : 'border-slate-200'
        }`}
      >
        <button
          onClick={() => onSelectTab('sustainability')}
          className={`px-2 py-1 rounded ${
            activeTab === 'sustainability' ? 'text-emerald-500 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Eco Metrics
        </button>
        <button
          onClick={() => onSelectTab('ai-lab')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            activeTab === 'ai-lab' ? 'text-emerald-500 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span>AI Vision</span>
        </button>
        <button
          onClick={() => onSelectTab('map')}
          className={`px-2 py-1 rounded ${
            activeTab === 'map' ? 'text-emerald-500 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => onSelectTab('reports')}
          className={`px-2 py-1 rounded ${
            activeTab === 'reports' ? 'text-emerald-500 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Repairs ({pendingCount})
        </button>
        <button
          onClick={() => onSelectTab('safety')}
          className={`px-2 py-1 rounded ${
            activeTab === 'safety' ? 'text-emerald-500 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Eco Guide
        </button>
      </div>
    </header>
  );
};
