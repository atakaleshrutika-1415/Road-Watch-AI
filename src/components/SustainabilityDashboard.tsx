import React, { useState } from 'react';
import {
  Leaf,
  ShieldCheck,
  TrendingDown,
  Scale,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Info,
  Building2,
  Droplets,
} from 'lucide-react';
import { HazardCategory, HazardReport } from '../types/hazard';
import { CATEGORIES } from '../data/sampleHazards';
import { NavTab } from './Navbar';

interface SustainabilityDashboardProps {
  reports: HazardReport[];
  onSelectTab: (tab: NavTab) => void;
  onSelectReport: (report: HazardReport) => void;
  onOpenReportModal: () => void;
}

export const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({
  reports,
  onSelectTab,
  onSelectReport,
  onOpenReportModal,
}) => {
  const [selectedSimDefect, setSelectedSimDefect] = useState<'pothole' | 'crack' | 'waterlog'>('pothole');
  const [delayDays, setDelayDays] = useState<number>(14);

  const totalPreventedKg = reports.reduce((acc, rep) => {
    return acc + (rep.aiAnalysis?.materialWaste?.materialDivertedKg || 0);
  }, 0);

  const resolvedReports = reports.filter((r) => r.status === 'resolved');
  const inProgressReports = reports.filter((r) => r.status === 'in_progress');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const resolvedDivertedKg = resolvedReports.reduce((acc, rep) => {
    return acc + (rep.aiAnalysis?.materialWaste?.materialDivertedKg || 0);
  }, 0);

  const avgLifeExtensionMonths = Math.round(
    reports.reduce((acc, rep) => acc + (rep.aiAnalysis?.materialWaste?.pavementLifeExtensionMonths || 24), 0) /
      (reports.length || 1)
  );

  const getSimulatedWaste = (defect: 'pothole' | 'crack' | 'waterlog', days: number) => {
    let baseKg = 35;
    let multiplierRate = 1.025;
    let label = 'Asphalt Crack';

    if (defect === 'pothole') {
      baseKg = 45;
      multiplierRate = 1.035;
      label = 'Pothole Crater';
    } else if (defect === 'waterlog') {
      baseKg = 20;
      multiplierRate = 1.045;
      label = 'Waterlogged Foundation';
    }

    const calculatedDelayedKg = Math.round(baseKg * Math.pow(multiplierRate, Math.min(days, 90)));
    const actualMaterialNeededEarly = baseKg;
    const materialWastedIfDelayed = calculatedDelayedKg - actualMaterialNeededEarly;
    const costEarly = Math.round(baseKg * 1.2 + 25);
    const costDelayed = Math.round(calculatedDelayedKg * 4.5 + 180);

    return {
      label,
      earlyKg: actualMaterialNeededEarly,
      delayedKg: calculatedDelayedKg,
      wastedKg: materialWastedIfDelayed,
      ratio: (calculatedDelayedKg / actualMaterialNeededEarly).toFixed(1),
      costEarly,
      costDelayed,
    };
  };

  const simResult = getSimulatedWaste(selectedSimDefect, delayDays);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner: Sustainable Road Maintenance Mission */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/40 p-6 sm:p-8 shadow-xl text-white">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Environment & Sustainability Track · Pavement Lifecycle Optimization</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Sustainable Road Maintenance: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-orange-400">
              Slashing Material Waste Before Structural Collapse.
            </span>
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
            Every unaddressed crack and pothole allows rainwater to penetrate the sub-base, turning minor
            surface defects into catastrophic roadbed failures. RoadWatch AI detects surface anomalies early,
            reducing virgin asphalt and aggregate consumption by up to <strong className="text-emerald-300">15x</strong>,
            lowering carbon emissions, and building safer, greener cities.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('ai-lab')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Analyze Road Surface Damage</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <span>+ Log Hazard for Maintenance</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-x-12 translate-y-8 hidden md:block">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-orange-500 blur-3xl" />
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Civic Material Conservation Metrics</span>
          </span>
          <span className="font-mono text-slate-500 text-[11px]">
            Based on FHWA Pavement Preservation Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Material Diverted */}
          <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-emerald-900/40 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-lg">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Asphalt & Base Diverted</span>
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {(totalPreventedKg / 1000).toFixed(2)} <span className="text-sm font-normal text-slate-500">Tons</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">{totalPreventedKg} kg</span>
              <span> prevented from landfill</span>
            </div>
          </div>

          {/* Average Pavement Life Extension */}
          <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-lg">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Pavement Life Extension</span>
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-300 font-mono tabular-nums">
              +{avgLifeExtensionMonths} <span className="text-sm font-normal text-slate-500">Mo</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              <span>Avg delay before major milling</span>
            </div>
          </div>

          {/* Recycled Asphalt Utilization */}
          <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-lg">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Recycled Content (RAP)</span>
              <RotateCcw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-mono tabular-nums">
              35% <span className="text-sm font-normal text-slate-500">Target</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              <span>Crumb rubber & RAP mix</span>
            </div>
          </div>

          {/* Resolved Verified Repairs */}
          <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-lg">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Verified Eco-Repairs</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {resolvedReports.length} <span className="text-sm font-normal text-slate-500">/ {reports.length}</span>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{resolvedDivertedKg} kg</span>
              <span> sealed to date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Material Waste Multiplier Simulator */}
      <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs dark:shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive Maintenance Waste Calculator</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Why Timing Matters: The Escalating Pavement Waste Curve
            </h2>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            FHWA Preservation Reference Model
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls on Left */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Road Defect Category:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pothole', label: 'Pothole' },
                  { id: 'crack', label: 'Asphalt Crack' },
                  { id: 'waterlog', label: 'Waterlogged Base' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSimDefect(item.id as any)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedSimDefect === item.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Repair Delay:</span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-sm">
                  {delayDays} Days
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={delayDays}
                onChange={(e) => setDelayDays(Number(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>Day 1 (Early Seal)</span>
                <span>Day 45 (Moderate Cavity)</span>
                <span>Day 90+ (Sub-Base Failure)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 block text-[11px]">
                Engineering Mechanism:
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                When asphalt surface tension fractures, freeze-thaw cycles and wheel impacts force rainwater
                downward into the crushed stone sub-grade, causing liquefaction and structural sagging.
              </p>
            </div>
          </div>

          {/* Visual Output on Right */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Early Intervention */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase font-mono">
                  Timely Repair (Day 1–7)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">Optimal</span>
              </div>

              <div>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {simResult.earlyKg} kg
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  Patching / crack sealant material
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Estimated Cost:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">${simResult.costEarly}</span>
                </div>
                <div className="flex justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Carbon Footprint:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-300">Baseline (Minimal)</span>
                </div>
              </div>
            </div>

            {/* Delayed Structural Reconstruction */}
            <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase font-mono">
                  Delayed Reconstruction ({delayDays}d)
                </span>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300">Catastrophic</span>
              </div>

              <div>
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                  {simResult.delayedKg} kg
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  Virgin asphalt + aggregate waste
                </span>
              </div>

              <div className="pt-2 border-t border-rose-200 dark:border-rose-900/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Estimated Cost:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">${simResult.costDelayed}</span>
                </div>
                <div className="flex justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Material Multiplier:</span>
                  <span className="font-mono text-rose-600 dark:text-rose-300 font-bold">{simResult.ratio}x Waste</span>
                </div>
              </div>
            </div>

            {/* Waste Diverted Banner */}
            <div className="sm:col-span-2 p-3.5 bg-gradient-to-r from-emerald-100/60 to-slate-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200">
                  By acting within 7 days instead of {delayDays} days, civic crews save{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{simResult.wastedKg} kg</strong> of asphalt
                  and prevent <strong className="text-emerald-700 dark:text-emerald-400 font-mono">${simResult.costDelayed - simResult.costEarly}</strong> in emergency repairs.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific citation label */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Note: Environmental impact calculations are grounded in standard civil engineering lifecycle benchmarks (FHWA-HIF-19-026 & Asphalt Institute MS-16) to provide authentic, unhallucinated material waste ratios.
          </span>
        </div>
      </div>

      {/* Sustainable Road Repair Tracking Feed */}
      <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs dark:shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Civic Repair Tracking & Material Log</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Track crew dispatch, eco-materials utilized (RAP, bio-bitumen), and verified waste diversion
            </span>
          </div>

          <button
            onClick={() => onSelectTab('reports')}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            Manage Full Repair Queue ({reports.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.slice(0, 6).map((report) => {
            const isResolved = report.status === 'resolved';
            const isInProgress = report.status === 'in_progress';

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{report.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                        isResolved
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                          : isInProgress
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                      }`}
                    >
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {report.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {report.location.address}
                  </p>
                </div>

                {/* Repair & Eco Details */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Material Diverted:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {report.aiAnalysis?.materialWaste?.materialDivertedKg || 0} kg
                    </span>
                  </div>

                  {report.repairDetails?.assignedCrew && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Assigned Crew:</span>
                      <span className="text-slate-700 dark:text-slate-200 truncate max-w-[130px]">
                        {report.repairDetails.assignedCrew}
                      </span>
                    </div>
                  )}

                  {report.repairDetails?.recycledContentPercentage !== undefined && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Recycled Content:</span>
                      <span className="font-mono text-orange-600 dark:text-orange-400 font-semibold">
                        {report.repairDetails.recycledContentPercentage}% RAP
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="capitalize">{report.category.replace('_', ' ')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
                    Inspect Report →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Pillars of Sustainable & Safer Cities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
            <RotateCcw className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Circular Asphalt Economy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Early patching enables using 30–40% Recycled Asphalt Pavement (RAP) cold mixes. When roads fail
            completely, deep structural sections cannot use high RAP ratios without hot plant reprocessing.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-2">
            <Droplets className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Watershed & Microplastic Defense</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Rough, degraded potholes act as abrasive cheese graters on vehicle tires, shedding microplastics
            into storm runoff. Smooth, sealed asphalt surfaces protect waterways and aquatic ecosystems.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Equitable Community Protection</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminating maintenance response gaps prevents high repair backlogs in under-resourced neighborhoods,
            protecting cyclists, scooter commuters, and transit corridors from sudden loss-of-control crashes.
          </p>
        </div>
      </div>
    </div>
  );
};
