import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { SustainabilityDashboard } from './components/SustainabilityDashboard';
import { AiAnalysisLab } from './components/AiAnalysisLab';
import { MapView } from './components/MapView';
import { ReportsView } from './components/ReportsView';
import { SafetyTipsView } from './components/SafetyTipsView';
import { ReportHazardModal } from './components/ReportHazardModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { DemoGuideModal } from './components/DemoGuideModal';
import { INITIAL_HAZARD_REPORTS } from './data/sampleHazards';
import { HazardCategory, HazardReport, HazardStatus } from './types/hazard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CheckCircle2, AlertCircle, X, Leaf } from 'lucide-react';

function RoadWatchApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('sustainability');
  const [reports, setReports] = useState<HazardReport[]>(INITIAL_HAZARD_REPORTS);
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [reportModalCoords, setReportModalCoords] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [reportModalScanData, setReportModalScanData] = useState<{
    photoUrl: string;
    category: HazardCategory;
    severity: string;
    title: string;
    description: string;
  } | null>(null);

  // Direct AI Lab deep scan state
  const [labDeepScanReport, setLabDeepScanReport] = useState<HazardReport | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const { themeConfig } = useTheme();

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Upvote report handler
  const handleUpvoteReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const hasVoted = rep.hasUpvoted;
          const newCount = hasVoted ? rep.upvotes - 1 : rep.upvotes + 1;
          const updated = { ...rep, upvotes: newCount, hasUpvoted: !hasVoted };
          if (selectedReport?.id === reportId) {
            setSelectedReport(updated);
          }
          return updated;
        }
        return rep;
      })
    );
    showToast('Hazard report endorsed by community.', 'info');
  };

  // Update status handler (e.g. Pending -> In Progress -> Resolved)
  const handleUpdateStatus = (
    reportId: string,
    newStatus: HazardStatus,
    note?: string,
    repairDetails?: HazardReport['repairDetails']
  ) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const newUpdate = {
            id: `u-${Date.now()}`,
            timestamp,
            status: newStatus,
            note: note || `Civic repair status adjusted to ${newStatus.replace('_', ' ')}.`,
            author: 'Civic Dispatch Lead',
          };
          const mergedRepair = repairDetails
            ? { ...rep.repairDetails, ...repairDetails }
            : rep.repairDetails;

          const updated = {
            ...rep,
            status: newStatus,
            updatedAt: timestamp,
            repairDetails: mergedRepair,
            updates: [newUpdate, ...rep.updates],
          };
          if (selectedReport?.id === reportId) {
            setSelectedReport(updated);
          }
          return updated;
        }
        return rep;
      })
    );
    showToast(`Repair status updated to ${newStatus.replace('_', ' ').toUpperCase()}!`, 'success');
  };

  // Submit new report handler
  const handleSubmitReport = (
    newReportData: Omit<HazardReport, 'id' | 'reportedAt' | 'updatedAt' | 'upvotes' | 'updates'>
  ) => {
    const newId = `RW-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const newReport: HazardReport = {
      ...newReportData,
      id: newId,
      reportedAt: timestamp,
      updatedAt: timestamp,
      upvotes: 1,
      hasUpvoted: true,
      updates: [
        {
          id: `u-${Date.now()}`,
          timestamp,
          status: 'pending',
          note: 'Report submitted by citizen and queued for sustainable municipal review.',
          author: newReportData.reportedBy,
        },
      ],
    };

    setReports((prev) => [newReport, ...prev]);
    showToast(`Report ${newId} logged successfully! Waste savings calculated.`, 'success');

    setReportModalCoords(null);
    setReportModalScanData(null);
  };

  const handleFileReportFromScan = (scanData: {
    photoUrl: string;
    category: HazardCategory;
    severity: string;
    title: string;
    description: string;
  }) => {
    setReportModalScanData(scanData);
    setReportModalCoords(null);
    setIsReportModalOpen(true);
  };

  const handleReportAtLocation = (coords: { lat: number; lng: number; address: string }) => {
    setReportModalCoords(coords);
    setReportModalScanData(null);
    setIsReportModalOpen(true);
  };

  const handleInspectInAiLab = (report: HazardReport) => {
    setLabDeepScanReport(report);
    setActiveTab('ai-lab');
  };

  const handleOpenReportModal = () => {
    setReportModalCoords(null);
    setReportModalScanData(null);
    setIsReportModalOpen(true);
  };

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white ${
        themeConfig.bgMain
      } ${themeConfig.textPrimary}`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/80 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar Contract with Theme Switcher */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={handleOpenReportModal}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        pendingCount={pendingReportsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'sustainability' && (
          <SustainabilityDashboard
            reports={reports}
            onSelectTab={setActiveTab}
            onSelectReport={(rep) => setSelectedReport(rep)}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {activeTab === 'ai-lab' && (
          <AiAnalysisLab
            onFileReportWithScan={handleFileReportFromScan}
            initialReport={labDeepScanReport}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            reports={reports}
            onSelectReport={(rep) => setSelectedReport(rep)}
            onReportAtLocation={handleReportAtLocation}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            reports={reports}
            onSelectReport={(rep) => setSelectedReport(rep)}
            onUpvoteReport={handleUpvoteReport}
            onUpdateStatus={handleUpdateStatus}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {activeTab === 'safety' && <SafetyTipsView />}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 px-4 sm:px-6 lg:px-8 text-xs transition-colors ${
          themeConfig.isDark
            ? 'border-slate-800/80 bg-[#060a14] text-slate-400'
            : 'border-slate-200 bg-slate-100 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className={`font-bold ${themeConfig.isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              RoadWatch AI
            </span>
            <span aria-hidden="true">·</span>
            <span>Sustainable Road Maintenance & Waste Reduction</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsDemoGuideOpen(true)}
              className="text-emerald-500 hover:text-emerald-400 font-medium cursor-pointer"
            >
              Track Presentation Guide
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('safety')}
              className="hover:text-slate-200 cursor-pointer"
            >
              Pavement Preservation Handbook
            </button>
            <span aria-hidden="true">·</span>
            <span>FHWA Pavement Preservation Baseline</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportModalCoords(null);
          setReportModalScanData(null);
        }}
        onSubmit={handleSubmitReport}
        initialCoords={reportModalCoords}
        initialScanData={reportModalScanData}
      />

      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpvote={handleUpvoteReport}
        onUpdateStatus={handleUpdateStatus}
        onInspectInAiLab={handleInspectInAiLab}
      />

      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onOpenAiLab={() => setActiveTab('ai-lab')}
        onOpenMap={() => setActiveTab('map')}
        onOpenReportModal={handleOpenReportModal}
        onOpenSustainability={() => setActiveTab('sustainability')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RoadWatchApp />
    </ThemeProvider>
  );
}
