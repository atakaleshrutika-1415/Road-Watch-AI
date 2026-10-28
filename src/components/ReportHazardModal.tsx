import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  MapPin,
  AlertTriangle,
  Sparkles,
  Camera,
  CheckCircle2,
  Navigation,
  Check,
} from 'lucide-react';
import { HazardCategory, HazardReport, HazardSeverity } from '../types/hazard';
import { CATEGORIES } from '../data/sampleHazards';
import { analyzeRoadImage } from '../utils/aiVisionSimulator';

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newReport: Omit<HazardReport, 'id' | 'reportedAt' | 'updatedAt' | 'upvotes' | 'updates'>) => void;
  initialCoords?: { lat: number; lng: number; address: string } | null;
  initialScanData?: {
    photoUrl: string;
    category: HazardCategory;
    severity: string;
    title: string;
    description: string;
  } | null;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Pothole Crater',
    url: '/src/assets/images/hazard_pothole_asphalt_1793179533825.jpg',
    category: 'potholes' as HazardCategory,
  },
  {
    name: 'Road Flooding',
    url: '/src/assets/images/hazard_road_flooding_1793179533715.jpg',
    category: 'waterlogging' as HazardCategory,
  },
  {
    name: 'Asphalt Fissure',
    url: '/src/assets/images/hazard_damaged_fissure_1793179534709.jpg',
    category: 'damaged_roads' as HazardCategory,
  },
  {
    name: 'Fallen Debris Blockage',
    url: '/src/assets/images/hazard_road_blockage_1793179534659.jpg',
    category: 'blocked_roads' as HazardCategory,
  },
];

export const ReportHazardModal: React.FC<ReportHazardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCoords,
  initialScanData,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HazardCategory>('potholes');
  const [severity, setSeverity] = useState<HazardSeverity>('high');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [reportedBy, setReportedBy] = useState('Citizen Reporter');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // AI Pre-scan states
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    detectedCategory: HazardCategory;
    severity: HazardSeverity;
    confidence: number;
    summary: string;
  } | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle incoming props
  useEffect(() => {
    if (initialCoords) {
      setAddress(initialCoords.address);
      setLat(initialCoords.lat);
      setLng(initialCoords.lng);
    }
  }, [initialCoords]);

  useEffect(() => {
    if (initialScanData) {
      setPhotoUrl(initialScanData.photoUrl);
      setCategory(initialScanData.category);
      setSeverity((initialScanData.severity as HazardSeverity) || 'high');
      setTitle(initialScanData.title);
      setDescription(initialScanData.description);
    }
  }, [initialScanData]);

  if (!isOpen) return null;

  // Run AI pre-scan whenever photo changes
  const runAiPreScan = async (imgUrl: string) => {
    setIsAiScanning(true);
    setAiSuggestion(null);

    try {
      const scan = await analyzeRoadImage(imgUrl);
      setAiSuggestion({
        detectedCategory: scan.analysis.hazardType,
        severity: scan.analysis.severity,
        confidence: scan.analysis.confidence,
        summary: scan.technicalDiagnostic,
      });
    } catch {
      // quiet fail
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setCategory(aiSuggestion.detectedCategory);
    setSeverity(aiSuggestion.severity);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setPhotoUrl(url);
      runAiPreScan(url);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setPhotoUrl(preset.url);
    runAiPreScan(preset.url);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          // Fallback to simulated metropolitan address
          setAddress('Corner of 8th St & Mission Blvd');
          setLat(37.7792);
          setLng(-122.4135);
        }
      );
    } else {
      setAddress('Corner of 8th St & Mission Blvd');
      setLat(37.7792);
      setLng(-122.4135);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a brief title describing the hazard.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please provide a road location or click "Use Current Location".');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a short description for civic crews.');
      return;
    }

    const defaultImg =
      photoUrl || '/src/assets/images/hazard_pothole_asphalt_1793179533825.jpg';

    // Map department
    const deptMap: Record<HazardCategory, string> = {
      potholes: 'Dept. of Public Works - Pavement Repair',
      damaged_roads: 'State Highway Administration',
      waterlogging: 'Municipal Water & Stormwater Management',
      broken_streetlights: 'Bureau of Street Lighting & Power',
      blocked_roads: 'Urban Forestry & Traffic Control',
    };

    onSubmit({
      title: title.trim(),
      category,
      severity,
      status: 'pending',
      location: {
        address: address.trim(),
        lat,
        lng,
        neighborhood: 'Metro Civic Zone',
      },
      description: description.trim(),
      photoUrl: defaultImg,
      reportedBy: isAnonymous ? 'Anonymous Citizen' : reportedBy.trim() || 'Civic Reporter',
      civicDepartment: deptMap[category],
      aiAnalysis: {
        confidence: aiSuggestion?.confidence || 94.5,
        hazardType: category,
        severity,
        detectedElements: ['Pavement anomaly', 'Surface distress verified by citizen'],
        damageScore: severity === 'critical' ? 90 : severity === 'high' ? 75 : 50,
        urgencyTimeline: severity === 'critical' ? 'Within 6 hours' : 'Within 24-48 hours',
        suggestedAction: `Inspect and execute emergency triage for ${category.replace('_', ' ')}.`,
        civicDepartment: deptMap[category],
        vehicleRisk: {
          twoWheelers: severity === 'critical' ? 'Severe' : 'High',
          fourWheelers: severity === 'critical' ? 'High' : 'Moderate',
        },
        isSimulated: true,
        materialWaste: {
          preventiveMaterialKg: category === 'potholes' ? 45 : category === 'damaged_roads' ? 30 : 15,
          delayedReconstructionMaterialKg: category === 'potholes' ? 680 : category === 'damaged_roads' ? 850 : 1200,
          materialDivertedKg: category === 'potholes' ? 635 : category === 'damaged_roads' ? 820 : 1185,
          pavementLifeExtensionMonths: 24,
          recycledAsphaltEligible: true,
          benchmarkSource: 'FHWA Pavement Preservation Guideline',
        },
      },
      repairDetails: {
        scheduledDate: 'Scheduled upon intake',
        assignedCrew: 'Eco-Maintenance Dispatch',
        materialsUsed: 'Recycled asphalt / Bio-sealant',
        recycledContentPercentage: 35,
        repairMethod: 'Localized eco-compaction',
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#0b101c] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Report Road Defect & Hazard</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Civic reporting with automated AI visual triage & material savings calculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 text-slate-900 dark:text-white">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {formError}
            </div>
          )}

          {/* Hazard Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Hazard Category <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/15 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{cat.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{cat.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Upload & AI Pre-Scan Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">
                Road Hazard Photo <span className="text-slate-400 font-normal">(Optional, unlocks AI triage)</span>
              </label>
              <span className="text-[11px] text-orange-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" />
                <span>Simulated AI Analysis Ready</span>
              </span>
            </div>

            {/* Photo drop/preview box */}
            <div className="border border-dashed border-slate-700 rounded-xl p-4 bg-slate-950/50 hover:bg-slate-950 transition-colors text-center relative">
              {photoUrl ? (
                <div className="relative group max-h-48 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                  <img
                    src={photoUrl}
                    alt="Hazard preview"
                    className="max-h-48 w-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-800 text-xs font-semibold text-white rounded-lg hover:bg-slate-700"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setAiSuggestion(null);
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-xs font-semibold text-white rounded-lg hover:bg-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center">
                  <Camera className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="text-xs font-medium text-slate-300">
                    Drag and drop a road photo or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-orange-400 underline hover:text-orange-300 cursor-pointer"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Supports JPG, PNG, WEBP</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Quick sample photo presets */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Or pick sample:</span>
              {SAMPLE_PHOTO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className="px-2 py-1 text-[11px] font-medium rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* AI Pre-Scan Suggestion Banner */}
            {isAiScanning && (
              <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 flex items-center gap-3 text-xs text-orange-200">
                <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin shrink-0" />
                <span>AI Vision Pre-Scan analyzing image features and depth...</span>
              </div>
            )}

            {!isAiScanning && aiSuggestion && (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Detection: {aiSuggestion.detectedCategory.toUpperCase()} ({aiSuggestion.confidence}%)</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Estimated Severity: <strong className="text-orange-400 uppercase">{aiSuggestion.severity}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Apply AI Prediction
                </button>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Report Title <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole crater near pedestrian crosswalk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Severity Radio Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Severity Level <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'moderate', 'high', 'critical'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSeverity(lvl)}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                    severity === lvl
                      ? lvl === 'critical'
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : lvl === 'high'
                        ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                        : 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Location Input with Geolocation */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <label className="font-semibold text-slate-300">
                Road Location & Coordinates <span className="text-orange-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>Use Current GPS</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, cross-street or landmark"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-mono">
              <span>Latitude: {lat.toFixed(4)}</span>
              <span>Longitude: {lng.toFixed(4)}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hazard Details & Impact Description <span className="text-orange-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe crater depth, standing water extent, lane blockage, or vehicle damage seen..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Reporter info */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="anon" className="text-slate-300 cursor-pointer">
                Submit as Anonymous Reporter
              </label>
            </div>

            {!isAnonymous && (
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="Your Name / Handle"
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs w-44 focus:outline-none focus:border-orange-500"
              />
            )}
          </div>

          {/* Modal Footer / Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-lg shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              Submit Civic Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
