import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Copy,
  Info,
  Shield,
  Eye,
  EyeOff,
  Leaf,
  Scale,
} from 'lucide-react';
import { HazardCategory, HazardReport } from '../types/hazard';
import {
  analyzeRoadImage,
  DetailedAiScan,
  PRESET_DETECTIONS,
} from '../utils/aiVisionSimulator';

interface AiAnalysisLabProps {
  onFileReportWithScan: (scanData: {
    photoUrl: string;
    category: HazardCategory;
    severity: string;
    title: string;
    description: string;
    aiAnalysis: DetailedAiScan['analysis'];
  }) => void;
  initialReport?: HazardReport | null;
}

const SAMPLE_PRESETS = [
  {
    id: 'pothole',
    name: 'Asphalt Pothole Crater',
    url: '/src/assets/images/hazard_pothole_asphalt_1793179533825.jpg',
    category: 'potholes' as HazardCategory,
    badge: 'Critical · 635kg Saved',
  },
  {
    id: 'damaged_roads',
    name: 'Asphalt Fissures & Cracks',
    url: '/src/assets/images/hazard_damaged_fissure_1793179534709.jpg',
    category: 'damaged_roads' as HazardCategory,
    badge: 'Crack Seal · 820kg Saved',
  },
  {
    id: 'waterlogging',
    name: 'Waterlogging & Runoff',
    url: '/src/assets/images/hazard_road_flooding_1793179533715.jpg',
    category: 'waterlogging' as HazardCategory,
    badge: 'Drainage · Sub-Base Safe',
  },
  {
    id: 'blocked_roads',
    name: 'Tree Debris Obstruction',
    url: '/src/assets/images/hazard_road_blockage_1793179534659.jpg',
    category: 'blocked_roads' as HazardCategory,
    badge: 'Organic Mulch Diversion',
  },
];

export const AiAnalysisLab: React.FC<AiAnalysisLabProps> = ({
  onFileReportWithScan,
  initialReport,
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    initialReport?.photoUrl || SAMPLE_PRESETS[0].url
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pothole');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<DetailedAiScan | null>(
    PRESET_DETECTIONS.pothole
  );
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runScan = async (imgUrl: string, categoryHint?: HazardCategory) => {
    setIsScanning(true);
    setScanResult(null);
    setSelectedBoxId(null);

    try {
      const result = await analyzeRoadImage(imgUrl, categoryHint);
      setTimeout(() => {
        setScanResult(result);
        setIsScanning(false);
      }, result.scanDurationMs);
    } catch {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (initialReport) {
      setCurrentImageUrl(initialReport.photoUrl);
      setSelectedPresetId('');
      runScan(initialReport.photoUrl, initialReport.category);
    }
  }, [initialReport]);

  const handlePresetSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setCurrentImageUrl(preset.url);
    runScan(preset.url, preset.category);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setCurrentImageUrl(url);
      setSelectedPresetId('custom');
      runScan(url);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyReport = () => {
    if (!scanResult) return;
    const summary = `RoadWatch AI Sustainable Inspection Report
Hazard Type: ${scanResult.analysis.hazardType.toUpperCase()}
Severity: ${scanResult.analysis.severity.toUpperCase()}
Confidence: ${scanResult.analysis.confidence}%
Material Diverted: ${scanResult.sustainabilityBenefit.materialDivertedKg} kg of asphalt/aggregate
Pavement Lifespan Extension: +${scanResult.sustainabilityBenefit.pavementLifeExtensionMonths} Months
Recommended Mitigation: ${scanResult.analysis.suggestedAction}
Civic Department: ${scanResult.analysis.civicDepartment}
Note: Simulated AI detection demo. Impact formulas derived from standard civil engineering pavement lifecycle models.`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleFileReport = () => {
    if (!scanResult) return;
    const cat = scanResult.analysis.hazardType;
    const title = `AI-Detected ${cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Hazard`;
    const desc = `${scanResult.technicalDiagnostic} Timely repair saves ${scanResult.sustainabilityBenefit.materialDivertedKg} kg of reconstruction asphalt. Recommended action: ${scanResult.analysis.suggestedAction}`;

    onFileReportWithScan({
      photoUrl: currentImageUrl,
      category: cat,
      severity: scanResult.analysis.severity,
      title,
      description: desc,
      aiAnalysis: scanResult.analysis,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 tracking-wider uppercase">
              <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Sustainable Defect Vision · Potholes & Cracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Image-Based Pothole & Crack Detection
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
              Inspect pavement surface distress from photos. Automated edge and cavitation analysis
              estimates severity and computes virgin material savings from early localized sealing versus
              delayed full-depth asphalt reconstruction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-white border border-emerald-200 dark:border-slate-700 hover:bg-emerald-100"
            >
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Upload Road Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Clear Simulated AI Labeling Notice */}
        <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl flex items-start sm:items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
            <strong className="text-amber-800 dark:text-amber-300 font-mono mr-1.5">[SIMULATED AI VISION DEMO]</strong>
            Computer vision detection results in this prototype are simulated using client-side image processing.
            Environmental impact and material waste calculations are based on standard civil engineering pavement preservation lifecycle models (FHWA-HIF-19-026 / Asphalt Institute MS-16) rather than arbitrary metrics.
          </div>
        </div>
      </div>

      {/* Preset Photo Selector Bar */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-800 dark:text-slate-300">Choose a road damage sample to analyze:</span>
          <span>Click any thumbnail to run neural vision triage</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                selectedPresetId === preset.id
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1325]/60 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-[#0b1325]'
              }`}
            >
              <div className="h-24 w-full rounded-lg overflow-hidden bg-slate-950 mb-2 relative">
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-emerald-300">
                  {preset.badge}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Scanner Stage */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 relative shadow-xs dark:shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-slate-200">Neural Vision Scanner</span>
              <span className="font-mono text-slate-400">1280 × 960px</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Toggle detection boxes"
              >
                {showBoxes ? <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                <span className="text-[11px] font-medium">{showBoxes ? 'Hide Overlays' : 'Show Overlays'}</span>
              </button>

              <button
                onClick={() => runScan(currentImageUrl)}
                disabled={isScanning}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 transition-colors cursor-pointer"
                title="Re-run AI detection"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}`} />
                <span className="text-[11px] font-medium">Re-scan</span>
              </button>
            </div>
          </div>

          {/* Image Container with Dynamic Laser & Bounding Boxes */}
          <div className="mt-4 relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-slate-800/80">
            <img
              src={currentImageUrl}
              alt="Road surface to analyze"
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />

            {/* Scanning Laser Beam Effect */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scanline z-20 pointer-events-none" />
            )}

            {/* Scanning overlay message */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <div className="text-center">
                  <div className="text-sm font-semibold text-white">Extracting Pavement Fissures & Depth...</div>
                  <div className="text-xs text-emerald-300 font-mono mt-1">Estimating sub-base water risk & material waste</div>
                </div>
              </div>
            )}

            {/* Bounding Box Overlays */}
            {!isScanning && showBoxes && scanResult?.boxes && (
              <div className="absolute inset-0 pointer-events-none">
                {scanResult.boxes.map((box) => {
                  const isSelected = selectedBoxId === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBoxId(box.id)}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                        borderColor: box.color,
                      }}
                      className={`absolute border-2 pointer-events-auto cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black bg-emerald-500/15'
                          : 'bg-black/10 hover:bg-black/25'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: box.color }}
                        className="absolute -top-6 left-0 px-1.5 py-0.5 rounded-t text-[10px] font-bold text-black whitespace-nowrap shadow-sm flex items-center gap-1"
                      >
                        <span>{box.label}</span>
                        <span className="font-mono font-medium">({box.confidence}%)</span>
                      </div>
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Bounding Box Pill List */}
          {scanResult && !isScanning && (
            <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800/80">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-2">Detected Structural Features:</div>
              <div className="flex flex-wrap gap-2">
                {scanResult.boxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBoxId(selectedBoxId === box.id ? null : box.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-2 cursor-pointer ${
                      selectedBoxId === box.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: box.color }} />
                    <span className="font-medium">{box.label}</span>
                    <span className="font-mono text-slate-500">{box.confidence}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Severity & Sustainability Waste Diagnostic */}
        <div className="lg:col-span-5 space-y-5">
          {scanResult && !isScanning ? (
            <>
              {/* Primary Diagnostic Card */}
              <div className="bg-white dark:bg-[#0b1325] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Classified Defect</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                      {scanResult.analysis.hazardType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Inference Confidence</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      {scanResult.analysis.confidence}%
                    </span>
                  </div>
                </div>

                {/* Severity Meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Severity Assessment</span>
                    <span
                      className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded font-mono ${
                        scanResult.analysis.severity === 'critical'
                          ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                          : scanResult.analysis.severity === 'high'
                          ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                      }`}
                    >
                      {scanResult.analysis.severity}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 ${
                        scanResult.analysis.severity === 'critical'
                          ? 'w-full bg-gradient-to-r from-orange-500 to-rose-500'
                          : scanResult.analysis.severity === 'high'
                          ? 'w-3/4 bg-orange-500'
                          : 'w-1/2 bg-amber-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Plain English AI Explanation */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
                    <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Neural Vision Explanation</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {scanResult.technicalDiagnostic}
                  </p>
                </div>

                {/* Sustainable Material Waste Comparison */}
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <Scale className="w-4 h-4" />
                      <span>Pavement Material Waste Impact</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                      +{scanResult.sustainabilityBenefit.pavementLifeExtensionMonths} Mo Life
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Early Localized Patch</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                        {scanResult.sustainabilityBenefit.estimatedEarlyRepairMaterialKg} kg
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Asphalt/sealant</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Delayed Reconstruction</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">
                        {scanResult.sustainabilityBenefit.delayedReconstructionMaterialKg} kg
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Full-depth waste</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Material Waste Diverted:</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {scanResult.sustainabilityBenefit.materialDivertedKg} kg
                    </span>
                  </div>
                </div>

                {/* Suggested Action & Department */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Target Municipal Agency:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{scanResult.analysis.civicDepartment}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 block text-[11px] mb-0.5">
                      Recommended Sustainable Mitigation:
                    </span>
                    {scanResult.analysis.suggestedAction}
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleFileReport}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <span>File Civic Report With AI Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCopyReport}
                    className="px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                    title="Copy diagnostic text"
                  >
                    {copiedNotification ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedNotification ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1325] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Analyzing Surface Fissures & Cavities...</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Computing material waste diversion ratios</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
