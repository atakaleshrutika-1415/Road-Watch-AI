import React from 'react';
import { X, Sparkles, Leaf, Scale, CheckCircle, MapPin, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiLab: () => void;
  onOpenMap: () => void;
  onOpenReportModal: () => void;
  onOpenSustainability: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenAiLab,
  onOpenMap,
  onOpenReportModal,
  onOpenSustainability,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-emerald-500/30 rounded-2xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                RoadWatch AI · Environment & Sustainability Track
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                Pavement Preservation & Material Waste Reduction
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Mission statement */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/40 space-y-1">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Core Environmental Innovation</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              Timely road maintenance is a powerful sustainability tool. A small asphalt crack requires just{' '}
              <strong className="text-emerald-700 dark:text-emerald-300 font-mono">~30 kg</strong> of localized crack sealant. Left unaddressed, rainwater infiltrates the sub-grade, causing catastrophic cratering that requires{' '}
              <strong className="text-rose-600 dark:text-rose-400 font-mono">~850 kg</strong> of virgin asphalt, crushed stone base, and heavy diesel equipment. RoadWatch AI uses automated computer vision to catch defects early, preventing up to 15x material waste.
            </p>
          </div>

          {/* 60-Second Demo Walkthrough */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              60-Second Hackathon Judge Walkthrough
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center justify-center">
                      1
                    </span>
                    <span>Test the Sustainability Waste Calculator</span>
                  </span>
                  <button
                    onClick={() => {
                      onOpenSustainability();
                      onClose();
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Open Dashboard →
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-6.5">
                  Adjust the "Repair Delay" slider on the Sustainability Dashboard to see the exponential material waste curve comparing early localized sealing vs. delayed full-depth reconstruction.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center justify-center">
                      2
                    </span>
                    <span>AI Vision Pothole & Crack Scanner</span>
                  </span>
                  <button
                    onClick={() => {
                      onOpenAiLab();
                      onClose();
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Open AI Lab →
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-6.5">
                  Click between pothole and fissure presets or upload your own road image. Observe the laser scan line, dynamic detection boxes, severity level, and calculated material diversion in kg.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center justify-center">
                      3
                    </span>
                    <span>Log a Defect & Dispatch Eco-Repair Crew</span>
                  </span>
                  <button
                    onClick={() => {
                      onOpenReportModal();
                      onClose();
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Open Form →
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-6.5">
                  Submit a report, inspect it on the Live Hazard Map, then in the Repair Tracker, click "Dispatch Crew" or "Mark Repaired" to simulate the municipal workflow using Recycled Asphalt Pavement (RAP).
                </p>
              </div>
            </div>
          </div>

          {/* Scientific Reference Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1 font-mono">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Scientific Benchmarking Transparency</span>
            </div>
            <p>
              Computer vision detection in this prototype is simulated for client-side evaluation without requiring paid APIs. Material waste ratios and cost multipliers are grounded in Federal Highway Administration (FHWA-HIF-19-026) and Asphalt Institute MS-16 pavement lifecycle benchmarks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Explore RoadWatch AI
          </button>
        </div>
      </div>
    </div>
  );
};
