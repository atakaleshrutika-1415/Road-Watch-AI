import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  ThumbsUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Shield,
  Leaf,
  Scale,
  Wrench,
  RotateCcw,
} from 'lucide-react';
import { HazardReport, HazardStatus } from '../types/hazard';

interface ReportDetailModalProps {
  report: HazardReport | null;
  onClose: () => void;
  onUpvote: (reportId: string) => void;
  onUpdateStatus: (
    reportId: string,
    newStatus: HazardStatus,
    note?: string,
    repairDetails?: HazardReport['repairDetails']
  ) => void;
  onInspectInAiLab: (report: HazardReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onUpvote,
  onUpdateStatus,
  onInspectInAiLab,
}) => {
  const [newStatus, setNewStatus] = useState<HazardStatus>('in_progress');
  const [updateNote, setUpdateNote] = useState('');
  const [assignedCrew, setAssignedCrew] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('35% RAP cold-mix asphalt');
  const [recycledPercentage, setRecycledPercentage] = useState<number>(35);
  const [showStatusChanger, setShowStatusChanger] = useState(false);

  if (!report) return null;

  const handleApplyStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    const repairInfo = {
      scheduledDate: new Date().toLocaleDateString(),
      assignedCrew: assignedCrew.trim() || 'Municipal Eco-Patch Crew',
      materialsUsed: materialsUsed.trim(),
      recycledContentPercentage: recycledPercentage,
      repairMethod: 'Infrared localized patch & compaction',
      verificationInspector: newStatus === 'resolved' ? 'City Inspector Verified' : undefined,
    };

    onUpdateStatus(
      report.id,
      newStatus,
      updateNote.trim() || `Civic status adjusted to ${newStatus.replace('_', ' ')}.`,
      repairInfo
    );
    setUpdateNote('');
    setShowStatusChanger(false);
  };

  const materialDiverted = report.aiAnalysis?.materialWaste?.materialDivertedKg || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
              {report.id}
            </span>
            <span
              className={`text-xs font-bold uppercase font-mono px-2 py-0.5 rounded ${
                report.status === 'resolved'
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                  : report.status === 'in_progress'
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30'
                  : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
              }`}
            >
              {report.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpvote(report.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                report.hasUpvoted
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">{report.upvotes}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Title & Location */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{report.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {report.location.address}
              </span>
              <span className="font-mono text-slate-500">
                GPS: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
              </span>
              <span>Reported: {report.reportedAt}</span>
              <span>By {report.reportedBy}</span>
            </div>
          </div>

          {/* Photo & Deep Scan Action */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-16/9 max-h-80 border border-slate-800">
            <img
              src={report.photoUrl}
              alt={report.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => {
                  onInspectInAiLab(report);
                  onClose();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Scan in AI Vision Lab</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Field Hazard Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{report.description}</p>
          </div>

          {/* Material Waste & Sustainability Savings Card */}
          <div className="bg-emerald-50/70 dark:bg-gradient-to-br dark:from-[#071526] dark:to-[#0c1f36] border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-950/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                <Leaf className="w-4 h-4" />
                <span>Material Waste Diversion Analysis</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {report.aiAnalysis.confidence}% AI Confidence (Simulated)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Material Diverted</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">{materialDiverted} kg</span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Severity Tier</span>
                <span className="font-bold text-orange-700 dark:text-orange-400 uppercase font-mono">
                  {report.aiAnalysis.severity}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Response Target</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 font-mono">
                  {report.aiAnalysis.urgencyTimeline}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Life Extension</span>
                <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">
                  +{report.aiAnalysis.materialWaste?.pavementLifeExtensionMonths || 24} Mo
                </span>
              </div>
            </div>

            {/* Repair & Eco Crew Details */}
            {report.repairDetails && (
              <div className="p-3 bg-white dark:bg-slate-950/60 rounded-lg text-xs space-y-1.5 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Assigned Crew:</span>
                  <strong className="text-slate-900 dark:text-white">{report.repairDetails.assignedCrew}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Materials Specified:</span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-mono">{report.repairDetails.materialsUsed}</strong>
                </div>
                {report.repairDetails.verificationInspector && (
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span>Verified By:</span>
                    <strong className="text-teal-700 dark:text-teal-300">{report.repairDetails.verificationInspector}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Civic Response Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Civic Repair Timeline ({report.updates.length})
              </h4>
              <button
                onClick={() => setShowStatusChanger(!showStatusChanger)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                {showStatusChanger ? 'Cancel Status Update' : '+ Update Repair Status'}
              </button>
            </div>

            {/* Interactive Status Changer */}
            {showStatusChanger && (
              <form
                onSubmit={handleApplyStatusChange}
                className="p-4 bg-slate-50 dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 rounded-xl space-y-3 text-xs"
              >
                <div className="font-semibold text-slate-900 dark:text-white">Log Municipal Repair Action</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['pending', 'in_progress', 'resolved'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={`py-1.5 px-2 rounded-lg border font-bold capitalize transition-colors cursor-pointer ${
                        newStatus === s
                          ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={assignedCrew}
                    onChange={(e) => setAssignedCrew(e.target.value)}
                    placeholder="Assigned Crew (e.g. Eco-Patch Squad #4)"
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <input
                    type="text"
                    value={materialsUsed}
                    onChange={(e) => setMaterialsUsed(e.target.value)}
                    placeholder="Eco-Material (e.g. 35% RAP cold mix)"
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <input
                  type="text"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Repair action log note..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Commit Repair Log
                  </button>
                </div>
              </form>
            )}

            {/* Updates list */}
            <div className="space-y-2.5">
              {report.updates.map((update) => (
                <div
                  key={update.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 text-xs flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">
                        {update.status.replace('_', ' ')} Update
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{update.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{update.note}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">By {update.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
