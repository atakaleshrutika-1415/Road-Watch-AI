export type HazardCategory =
  | 'potholes'
  | 'damaged_roads'
  | 'waterlogging'
  | 'broken_streetlights'
  | 'blocked_roads';

export type HazardSeverity = 'low' | 'moderate' | 'high' | 'critical';

export type HazardStatus = 'pending' | 'in_progress' | 'resolved';

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  landmark?: string;
}

export interface MaterialWasteAnalysis {
  preventiveMaterialKg: number; // e.g. 35 kg asphalt patch/seal
  delayedReconstructionMaterialKg: number; // e.g. 520 kg full excavation
  materialDivertedKg: number;
  pavementLifeExtensionMonths: number;
  recycledAsphaltEligible: boolean;
  benchmarkSource: string; // e.g. 'FHWA Pavement Preservation Guideline'
}

export interface AiAnalysisResult {
  confidence: number;
  hazardType: HazardCategory;
  severity: HazardSeverity;
  detectedElements: string[];
  damageScore: number; // 0-100
  urgencyTimeline: string;
  suggestedAction: string;
  civicDepartment: string;
  vehicleRisk: {
    twoWheelers: 'Low' | 'Moderate' | 'High' | 'Severe';
    fourWheelers: 'Low' | 'Moderate' | 'High' | 'Severe';
  };
  dimensionsEstimate?: string;
  isSimulated: boolean;
  materialWaste: MaterialWasteAnalysis;
}

export interface RepairDetails {
  scheduledDate?: string;
  assignedCrew?: string;
  materialsUsed?: string;
  recycledContentPercentage?: number; // e.g. 30% RAP (Recycled Asphalt Pavement)
  repairMethod?: string;
  verificationInspector?: string;
}

export interface StatusUpdate {
  id: string;
  timestamp: string;
  status: HazardStatus;
  note: string;
  author: string;
  repairDetails?: RepairDetails;
}

export interface HazardReport {
  id: string;
  title: string;
  category: HazardCategory;
  severity: HazardSeverity;
  status: HazardStatus;
  location: LocationData;
  description: string;
  photoUrl: string;
  reportedAt: string;
  updatedAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  reportedBy: string;
  civicDepartment: string;
  aiAnalysis: AiAnalysisResult;
  repairDetails?: RepairDetails;
  updates: StatusUpdate[];
}

export interface CategoryMeta {
  key: HazardCategory;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  pinColor: string;
}
