import React from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  MapPin,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { HazardCategory, HazardReport, HazardStatus } from '../types/hazard';
import { CATEGORIES } from '../data/sampleHazards';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  reports: HazardReport[];
  onSelectTab: (tab: NavTab) => void;
  onSelectReport: (report: HazardReport) => void;
  onOpenReportModal: () => void;
  onFilterCategoryFromDashboard: (cat: HazardCategory) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onSelectTab,
  onSelectReport,
  onOpenReportModal,
  onFilterCategoryFromDashboard,
}) => {
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const criticalCount = reports.filter((r) => r.severity === 'critical' && r.status !== 'resolved').length;

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Welcome / Civic Intelligence Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1427] via-[#0d162d] to-[#141b31] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Civic Road Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Proactive Road Safety, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Zero Fatalities from Preventable Hazards.
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Harness deep computer vision to identify potholes, pavement fractures, and flood hazards
            before they cause blown tires or serious collisions. Join citizens and municipal road crews
            in keeping our roadways resilient and sustainable.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('ai-lab')}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Vision Scanner</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <span>+ Report Road Hazard</span>
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-8 hidden md:block">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 blur-3xl" />
        </div>
      </div>

      {/* Primary KPI Metrics Bar (Strict Tabular Figures) */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Civic Operations Overview
          </span>
          <span className="font-mono text-slate-500">Live Network Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Reports */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Hazards</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-mono">100%</span>
              <span>geotagged</span>
            </div>
          </div>

          {/* Pending Triage */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              {pendingCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {criticalCount > 0 ? (
                <span className="text-rose-400 font-semibold">{criticalCount} critical urgency</span>
              ) : (
                <span>Awaiting city dispatch</span>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Crews</span>
              <AlertTriangle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
              {inProgressCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>On-site mitigation underway</span>
            </div>
          </div>

          {/* Resolved Hazards */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Resolved Hazards</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {resolvedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-mono">Avg 24h</span>
              <span> resolution turnaround</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hazard Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Hazards by Category
          </span>
          <button
            onClick={() => onSelectTab('reports')}
            className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All in Reports</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const count = reports.filter((r) => r.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  onFilterCategoryFromDashboard(cat.key);
                  onSelectTab('reports');
                }}
                className="bg-[#0b101c] border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 p-4 rounded-2xl text-left transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.pinColor }}
                  />
                  <span className="text-lg font-bold font-mono tabular-nums text-white group-hover:text-orange-400 transition-colors">
                    {count}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                  {cat.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Recent Reports vs Interactive Features */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Hazard Reports */}
        <div className="lg:col-span-7 bg-[#0b101c] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Recent Road Hazard Feed</h2>
              <span className="text-xs text-slate-400">Latest crowd-sourced road distress updates</span>
            </div>
            <button
              onClick={() => onSelectTab('reports')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
            >
              Browse All ({totalCount}) →
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => onSelectReport(rep)}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-slate-950 overflow-hidden shrink-0">
                    <img
                      src={rep.photoUrl}
                      alt={rep.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{rep.id}</span>
                      <span
                        className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded ${
                          rep.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : rep.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {rep.severity}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-orange-400 transition-colors truncate">
                      {rep.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{rep.location.address}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                      rep.status === 'resolved'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : rep.status === 'in_progress'
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-amber-400 bg-amber-500/10'
                    }`}
                  >
                    {rep.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {rep.reportedAt.split(' ')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Map Shortcut & Sustainability ROI */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Map Preview Card */}
          <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Geospatial Hazard Radar</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                {reports.length} Pins Placed
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Explore the city grid with color-coded severity markers. Click on any section of the road network to pinpoint damage or view municipal crew dispatch routes.
            </p>

            <button
              onClick={() => onSelectTab('map')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Full Interactive Map</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
          </div>

          {/* Sustainability & Civic Savings Card */}
          <div className="bg-gradient-to-br from-emerald-950/25 to-[#0b101c] border border-emerald-800/30 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Civic Sustainability Multiplier</span>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>The 15x Maintenance Curve:</strong> Patching an asphalt micro-fracture early costs
                approx. <span className="text-emerald-400 font-mono font-bold">$35</span>. Delaying by months lets water infiltrate the sub-base, causing cratering that demands full-depth reconstruction costing{' '}
                <span className="text-rose-400 font-mono font-bold">$3,500–$8,500</span> per lane segment.
              </p>
              <div className="pt-2 border-t border-emerald-800/30 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Carbon Reduction:</span>
                <span className="text-emerald-400 font-bold">-78% Lifecycle CO₂</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('safety')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Read Safety Guidelines & Eco Insights</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
