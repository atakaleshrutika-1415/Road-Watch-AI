import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ThumbsUp,
  Download,
  Eye,
  Leaf,
  Scale,
  Wrench,
  RotateCcw,
} from 'lucide-react';
import { HazardCategory, HazardReport, HazardSeverity, HazardStatus } from '../types/hazard';
import { CATEGORIES } from '../data/sampleHazards';

interface ReportsViewProps {
  reports: HazardReport[];
  onSelectReport: (report: HazardReport) => void;
  onUpvoteReport: (reportId: string) => void;
  onUpdateStatus: (
    reportId: string,
    newStatus: HazardStatus,
    note?: string,
    repairDetails?: HazardReport['repairDetails']
  ) => void;
  onOpenReportModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onSelectReport,
  onUpvoteReport,
  onUpdateStatus,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HazardStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<HazardCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<HazardSeverity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'waste' | 'severity' | 'upvotes'>('newest');

  // Filter logic
  const filteredReports = reports.filter((rep) => {
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && rep.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && rep.severity !== severityFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = rep.title.toLowerCase().includes(q);
      const matchAddress = rep.location.address.toLowerCase().includes(q);
      const matchId = rep.id.toLowerCase().includes(q);
      const matchCategory = rep.category.toLowerCase().includes(q);
      const matchCrew = rep.repairDetails?.assignedCrew?.toLowerCase().includes(q);
      if (!matchTitle && !matchAddress && !matchId && !matchCategory && !matchCrew) return false;
    }
    return true;
  });

  // Sort logic
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    }
    if (sortBy === 'waste') {
      const wasteA = a.aiAnalysis?.materialWaste?.materialDivertedKg || 0;
      const wasteB = b.aiAnalysis?.materialWaste?.materialDivertedKg || 0;
      return wasteB - wasteA;
    }
    if (sortBy === 'severity') {
      const weights: Record<HazardSeverity, number> = {
        critical: 4,
        high: 3,
        moderate: 2,
        low: 1,
      };
      return weights[b.severity] - weights[a.severity];
    }
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  // Export CSV handler
  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Title',
      'Category',
      'Severity',
      'Status',
      'Address',
      'Material_Diverted_Kg',
      'Assigned_Crew',
      'ReportedAt',
    ];
    const rows = sortedReports.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.severity,
      r.status,
      `"${r.location.address.replace(/"/g, '""')}"`,
      r.aiAnalysis?.materialWaste?.materialDivertedKg || 0,
      `"${r.repairDetails?.assignedCrew || 'Unassigned'}"`,
      r.reportedAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roadwatch_repair_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 tracking-wider uppercase">
            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Civic Maintenance Triage & Material Savings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Repair Tracking & Defect Queue
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Prioritize and track sustainable road fixes. Log crew dispatch, recycled materials (RAP), and verified landfill waste diverted.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
            title="Download CSV database"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export Repair Log</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            + Log Defect
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs dark:shadow-lg">
        {/* Status segmented tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Records ({reports.length})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending Review ({pendingCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'in_progress'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>In Progress / Scheduled ({inProgressCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Repaired & Diverted ({resolvedCount})</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="waste">Most Material Diverted</option>
              <option value="severity">Highest Severity</option>
              <option value="upvotes">Most Endorsed</option>
            </select>
          </div>
        </div>

        {/* Secondary filters: Search, Category, Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by street, title, crew, or ID (e.g. RW-8041)..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {sortedReports.length === 0 ? (
        <div className="h-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1325] flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <AlertCircle className="w-10 h-10 text-slate-400 mb-2" />
          <p className="font-semibold text-slate-800 dark:text-slate-300 text-sm">No maintenance records found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Try adjusting your search query, status filters, or log a new road hazard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedReports.map((report) => {
            const isResolved = report.status === 'resolved';
            const isInProgress = report.status === 'in_progress';
            const isPending = report.status === 'pending';
            const divertedKg = report.aiAnalysis?.materialWaste?.materialDivertedKg || 0;

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs dark:shadow-lg hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={report.photoUrl}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[11px] font-bold uppercase font-mono px-2 py-0.5 rounded shadow-md ${
                        isResolved
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                          : isInProgress
                          ? 'bg-blue-950/90 text-blue-300 border border-blue-500/40'
                          : 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Material Diverted Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded shadow-md bg-black/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-400" />
                      <span>{divertedKg} kg Saved</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-3 text-[11px] font-mono font-medium text-slate-300 bg-black/75 px-1.5 py-0.5 rounded">
                    {report.id}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Crew & Eco Info Box */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Assigned Crew:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                        {report.repairDetails?.assignedCrew || 'Pending Dispatch'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Eco-Material:</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-300 font-semibold truncate max-w-[140px]">
                        {report.repairDetails?.materialsUsed || 'Standard cold mix'}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Status Changer & Upvote */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onUpvoteReport(report.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        report.hasUpvoted
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                      title="Endorse this hazard report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">{report.upvotes}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {isPending && (
                        <button
                          onClick={() =>
                            onUpdateStatus(
                              report.id,
                              'in_progress',
                              'Eco-patching crew dispatched with 35% RAP mix.',
                              {
                                assignedCrew: 'Rapid Eco-Patch Crew #2',
                                materialsUsed: '35% RAP Polymerized cold mix',
                                scheduledDate: new Date().toLocaleDateString(),
                                recycledContentPercentage: 35,
                              }
                            )
                          }
                          className="px-2 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-lg transition-colors cursor-pointer"
                          title="Simulate Dispatching Crew"
                        >
                          Dispatch Crew
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          onClick={() =>
                            onUpdateStatus(
                              report.id,
                              'resolved',
                              'Pavement repaired with recycled asphalt mix. Zero depression verified.',
                              {
                                verificationInspector: 'Inspector Verified (Passed)',
                                scheduledDate: new Date().toLocaleDateString(),
                              }
                            )
                          }
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-lg transition-colors cursor-pointer"
                          title="Simulate Resolving Defect"
                        >
                          Mark Repaired
                        </button>
                      )}

                      <button
                        onClick={() => onSelectReport(report)}
                        className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="View Full Repair Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
