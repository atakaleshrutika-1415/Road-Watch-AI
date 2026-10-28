import { HazardCategory, HazardSeverity, AiAnalysisResult } from '../types/hazard';

export interface DetectionBox {
  id: string;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  description: string;
}

export interface DetailedAiScan {
  analysis: AiAnalysisResult;
  boxes: DetectionBox[];
  scanDurationMs: number;
  pavementDistressIndex: number; // 0-100 (higher = worse)
  surfaceTextureType: string;
  environmentalFactors: string[];
  sustainabilityBenefit: {
    estimatedEarlyRepairMaterialKg: number;
    delayedReconstructionMaterialKg: number;
    materialDivertedKg: number;
    estimatedEarlyRepairCost: string;
    delayedFailureCost: string;
    carbonSavingsPercentage: number;
    pavementLifeExtensionMonths: number;
    recommendedMitigation: string;
    benchmarkCitation: string;
  };
  technicalDiagnostic: string;
}

export const PRESET_DETECTIONS: Record<string, DetailedAiScan> = {
  pothole: {
    analysis: {
      confidence: 96.8,
      hazardType: 'potholes',
      severity: 'critical',
      detectedElements: [
        'Deep rim-impact cavity',
        'Sub-base layer exposure',
        'Radial fatigue cracking',
        'Loose asphalt aggregate',
      ],
      damageScore: 92,
      urgencyTimeline: 'Within 6 hours',
      suggestedAction: 'Rapid cold-patch polymer asphalt fill with 35% recycled aggregate (RAP) & vibratory compaction.',
      civicDepartment: 'Dept. of Public Works - Sustainable Pavement Repair',
      vehicleRisk: {
        twoWheelers: 'Severe',
        fourWheelers: 'High',
      },
      dimensionsEstimate: 'Approx. 38cm diameter × 8.5cm depth',
      isSimulated: true,
      materialWaste: {
        preventiveMaterialKg: 45,
        delayedReconstructionMaterialKg: 680,
        materialDivertedKg: 635,
        pavementLifeExtensionMonths: 24,
        recycledAsphaltEligible: true,
        benchmarkSource: 'FHWA Pavement Preservation Guideline (FHWA-HIF-19-026)',
      },
    },
    boxes: [
      {
        id: 'box-1',
        label: 'Primary Pothole Crater',
        confidence: 97.4,
        x: 28,
        y: 42,
        width: 44,
        height: 38,
        color: '#f97316',
        description: 'Core cavity with broken pavement edges and exposed gravel.',
      },
      {
        id: 'box-2',
        label: 'Asphalt Shear Fracture',
        confidence: 89.2,
        x: 22,
        y: 35,
        width: 25,
        height: 18,
        color: '#10b981',
        description: 'Transverse surface crack propagating toward vehicle wheel track.',
      },
      {
        id: 'box-3',
        label: 'Loose Aggregate Field',
        confidence: 91.0,
        x: 48,
        y: 68,
        width: 32,
        height: 20,
        color: '#f43f5e',
        description: 'Eroded stones creating tire slippage and projectile risks.',
      },
    ],
    scanDurationMs: 820,
    pavementDistressIndex: 88,
    surfaceTextureType: 'High-density porous asphalt (HMA)',
    environmentalFactors: ['Freeze-thaw expansion', 'Heavy axle loading', 'Sub-base moisture penetration'],
    sustainabilityBenefit: {
      estimatedEarlyRepairMaterialKg: 45,
      delayedReconstructionMaterialKg: 680,
      materialDivertedKg: 635,
      estimatedEarlyRepairCost: '$45 (Cold mix patch)',
      delayedFailureCost: '$3,800 (Excavation & sub-base replacement)',
      carbonSavingsPercentage: 84,
      pavementLifeExtensionMonths: 24,
      recommendedMitigation:
        'Immediate infrared seamless patch prevents rain from penetrating the sub-grade, avoiding full-lane mill-and-fill reconstruction.',
      benchmarkCitation:
        'Calculated from standard civil engineering pavement lifecycle models (FHWA-HIF-19-026). Simulated demo detection.',
    },
    technicalDiagnostic:
      'The automated vision filter identified a high-contrast depression with edge shadows consistent with class-3 road cavitation. Moisture intrusion has destabilized the binder layer. High risk of immediate tire blowout for passenger cars and severe balance loss for two-wheelers.',
  },
  waterlogging: {
    analysis: {
      confidence: 94.6,
      hazardType: 'waterlogging',
      severity: 'high',
      detectedElements: [
        'Standing surface waterpool',
        'Submerged lane demarcation',
        'Catch basin reflux',
        'Specular reflection hazard',
      ],
      damageScore: 84,
      urgencyTimeline: 'Within 12 hours',
      suggestedAction: 'Dispatch high-flow suction vacuum and clear storm drain catchment to protect pavement foundation.',
      civicDepartment: 'Municipal Water & Stormwater Management',
      vehicleRisk: {
        twoWheelers: 'Severe',
        fourWheelers: 'Moderate',
      },
      dimensionsEstimate: 'Puddle expanse ~120m² × 12cm depth',
      isSimulated: true,
      materialWaste: {
        preventiveMaterialKg: 15,
        delayedReconstructionMaterialKg: 1200,
        materialDivertedKg: 1185,
        pavementLifeExtensionMonths: 36,
        recycledAsphaltEligible: true,
        benchmarkSource: 'AASHTO Drainage & Pavement Moisture Manual',
      },
    },
    boxes: [
      {
        id: 'box-wl-1',
        label: 'Submerged Roadway Area',
        confidence: 95.8,
        x: 18,
        y: 35,
        width: 64,
        height: 48,
        color: '#10b981',
        description: 'Deep standing water completely masking road markings and potholes.',
      },
      {
        id: 'box-wl-2',
        label: 'Clogged Storm Drain Inlet',
        confidence: 88.5,
        x: 8,
        y: 55,
        width: 22,
        height: 30,
        color: '#f97316',
        description: 'Debris mat restricting gravity drainage into city stormwater line.',
      },
    ],
    scanDurationMs: 760,
    pavementDistressIndex: 76,
    surfaceTextureType: 'Bituminous surface under hydrostatic pressure',
    environmentalFactors: ['Blocked drainage culverts', 'Excess runoff rate', 'Zero surface cross-slope'],
    sustainabilityBenefit: {
      estimatedEarlyRepairMaterialKg: 15,
      delayedReconstructionMaterialKg: 1200,
      materialDivertedKg: 1185,
      estimatedEarlyRepairCost: '$120 (Catch basin jetting)',
      delayedFailureCost: '$14,500 (Sub-base water saturation failure)',
      carbonSavingsPercentage: 92,
      pavementLifeExtensionMonths: 36,
      recommendedMitigation:
        'Rapid unblocking stops prolonged standing water from saturating and liquefying the sub-base layer, preserving road foundation integrity.',
      benchmarkCitation:
        'Calculated from standard civil engineering pavement lifecycle models (AASHTO Drainage Manual). Simulated demo detection.',
    },
    technicalDiagnostic:
      'Computer vision spectral reflection analysis detected mirror-like water surface reflecting overcast sky, indicating depth exceeding 8cm. Prolonged immersion softens asphalt binder and increases hydroplaning risk above 35 mph.',
  },
  damaged_roads: {
    analysis: {
      confidence: 92.3,
      hazardType: 'damaged_roads',
      severity: 'high',
      detectedElements: [
        'Alligator fatigue cracking',
        'Longitudinal seam separation',
        'Edge crumbling & ravelling',
      ],
      damageScore: 78,
      urgencyTimeline: 'Within 24 hours',
      suggestedAction: 'Rubberized bio-bitumen crack sealing to lock out moisture before winter freeze cycles.',
      civicDepartment: 'State Highway Administration - Preservation Division',
      vehicleRisk: {
        twoWheelers: 'High',
        fourWheelers: 'Moderate',
      },
      dimensionsEstimate: 'Crack network across 45m linear lane',
      isSimulated: true,
      materialWaste: {
        preventiveMaterialKg: 30,
        delayedReconstructionMaterialKg: 850,
        materialDivertedKg: 820,
        pavementLifeExtensionMonths: 30,
        recycledAsphaltEligible: true,
        benchmarkSource: 'Asphalt Institute MS-16 Pavement Preservation',
      },
    },
    boxes: [
      {
        id: 'box-dr-1',
        label: 'Structural Fatigue Cracking',
        confidence: 93.1,
        x: 25,
        y: 40,
        width: 50,
        height: 52,
        color: '#10b981',
        description: 'Interconnected web of fractures caused by repetitive heavy vehicle cycles.',
      },
      {
        id: 'box-dr-2',
        label: 'Edge Shoulder Erosion',
        confidence: 87.4,
        x: 68,
        y: 25,
        width: 28,
        height: 60,
        color: '#f97316',
        description: 'Loss of lateral road support threatening asphalt edge breakaway.',
      },
    ],
    scanDurationMs: 890,
    pavementDistressIndex: 82,
    surfaceTextureType: 'Aged Asphalt Concrete with oxidized binder',
    environmentalFactors: ['Thermal contraction', 'Sub-base soil deflection', 'Oxidized asphalt binder'],
    sustainabilityBenefit: {
      estimatedEarlyRepairMaterialKg: 30,
      delayedReconstructionMaterialKg: 850,
      materialDivertedKg: 820,
      estimatedEarlyRepairCost: '$180 (Crack sealing & chip seal)',
      delayedFailureCost: '$9,200 (Full-depth reclamation)',
      carbonSavingsPercentage: 76,
      pavementLifeExtensionMonths: 30,
      recommendedMitigation:
        'Hot-pour rubberized sealant locks out rain infiltration before cracks expand into full cavities, saving up to 820 kg of virgin asphalt per section.',
      benchmarkCitation:
        'Calculated from standard civil engineering pavement lifecycle models (Asphalt Institute MS-16). Simulated demo detection.',
    },
    technicalDiagnostic:
      'Linear morphology analysis traced interconnected tensile fractures. Pavement is transitioning from micro-fissuring into block degradation. Immediate crack filling prevents winter freeze-thaw crumbling.',
  },
  blocked_roads: {
    analysis: {
      confidence: 97.9,
      hazardType: 'blocked_roads',
      severity: 'critical',
      detectedElements: [
        'Physical timber obstruction',
        'Lane impassability',
        'Blind turn collision hazard',
      ],
      damageScore: 95,
      urgencyTimeline: 'Immediate (under 1 hour)',
      suggestedAction: 'Emergency crew with chainsaw, winch line, and directional arrow board. Wood debris to municipal mulch facility.',
      civicDepartment: 'Urban Forestry & Emergency Road Services',
      vehicleRisk: {
        twoWheelers: 'Severe',
        fourWheelers: 'Severe',
      },
      dimensionsEstimate: 'Obstruction width ~7.5 meters',
      isSimulated: true,
      materialWaste: {
        preventiveMaterialKg: 0,
        delayedReconstructionMaterialKg: 320,
        materialDivertedKg: 320,
        pavementLifeExtensionMonths: 12,
        recycledAsphaltEligible: false,
        benchmarkSource: 'TRB Highway Maintenance Circular',
      },
    },
    boxes: [
      {
        id: 'box-br-1',
        label: 'Major Tree Limb Obstruction',
        confidence: 98.2,
        x: 10,
        y: 35,
        width: 78,
        height: 55,
        color: '#f43f5e',
        description: 'Heavy solid timber blocking full traffic lane and pedestrian path.',
      },
      {
        id: 'box-br-2',
        label: 'Secondary Leaf & Debris Scatter',
        confidence: 91.5,
        x: 45,
        y: 70,
        width: 48,
        height: 25,
        color: '#10b981',
        description: 'Wet slippery organic debris reducing braking friction.',
      },
    ],
    scanDurationMs: 650,
    pavementDistressIndex: 94,
    surfaceTextureType: 'Asphalt with high-mass foreign body',
    environmentalFactors: ['Storm wind gust shear', 'Decayed urban canopy'],
    sustainabilityBenefit: {
      estimatedEarlyRepairMaterialKg: 0,
      delayedReconstructionMaterialKg: 320,
      materialDivertedKg: 320,
      estimatedEarlyRepairCost: '$150 (Rapid clearance & mulch recycle)',
      delayedFailureCost: '$18,000+ (Collision damage & prolonged detour delay)',
      carbonSavingsPercentage: 89,
      pavementLifeExtensionMonths: 12,
      recommendedMitigation:
        'Immediate recovery eliminates traffic idling emissions and prevents road scraping and secondary vehicular accidents.',
      benchmarkCitation:
        'Calculated from standard civil engineering pavement lifecycle models. Simulated demo detection.',
    },
    technicalDiagnostic:
      'Spatial segmentation detected an elevated 3D structure crossing roadway centerline. High velocity impact risk for approaching vehicles. Requires immediate directional diversion cones.',
  },
  broken_streetlights: {
    analysis: {
      confidence: 91.2,
      hazardType: 'broken_streetlights',
      severity: 'moderate',
      detectedElements: [
        'Luminaire circuit outage',
        'Low ambient lux level',
        'Unlit crosswalk boundary',
      ],
      damageScore: 68,
      urgencyTimeline: 'Within 48 hours',
      suggestedAction: 'Bucket truck inspection of circuit fuse & energy-efficient LED luminaire module replacement.',
      civicDepartment: 'Bureau of Street Lighting & Power',
      vehicleRisk: {
        twoWheelers: 'Moderate',
        fourWheelers: 'Low',
      },
      dimensionsEstimate: 'Dark corridor ~120 meters',
      isSimulated: true,
      materialWaste: {
        preventiveMaterialKg: 4,
        delayedReconstructionMaterialKg: 65,
        materialDivertedKg: 61,
        pavementLifeExtensionMonths: 60,
        recycledAsphaltEligible: false,
        benchmarkSource: 'DOE Municipal Solid-State Lighting Program',
      },
    },
    boxes: [
      {
        id: 'box-sl-1',
        label: 'Inactive Luminaire Mast',
        confidence: 92.4,
        x: 35,
        y: 15,
        width: 30,
        height: 70,
        color: '#10b981',
        description: 'Overhead light fixture failing to illuminate roadway corridor.',
      },
    ],
    scanDurationMs: 710,
    pavementDistressIndex: 65,
    surfaceTextureType: 'Night roadway with zero direct lux illumination',
    environmentalFactors: ['Electrical grid surge', 'Photocell failure', 'Blown fuse'],
    sustainabilityBenefit: {
      estimatedEarlyRepairMaterialKg: 4,
      delayedReconstructionMaterialKg: 65,
      materialDivertedKg: 61,
      estimatedEarlyRepairCost: '$85 (LED luminaire swap)',
      delayedFailureCost: '$6,500 (Vandalism & nocturnal accident liability)',
      carbonSavingsPercentage: 65,
      pavementLifeExtensionMonths: 60,
      recommendedMitigation:
        'Dark-sky compliant high-efficiency LED replacement cuts municipal wattage by 45% while safeguarding pedestrians.',
      benchmarkCitation:
        'Calculated from standard municipal lighting lifecycle benchmarks. Simulated demo detection.',
    },
    technicalDiagnostic:
      'Computer vision nocturnal lux analysis detected critical darkness corridor below 2 lux. Critical hazard for vulnerable road users (cyclists and pedestrians) crossing at night.',
  },
};

export async function analyzeRoadImage(
  imageSrc: string,
  userSelectedHint?: HazardCategory
): Promise<DetailedAiScan> {
  if (imageSrc.includes('pothole')) {
    return { ...PRESET_DETECTIONS.pothole };
  }
  if (imageSrc.includes('flooding') || imageSrc.includes('water')) {
    return { ...PRESET_DETECTIONS.waterlogging };
  }
  if (imageSrc.includes('fissure') || imageSrc.includes('damaged')) {
    return { ...PRESET_DETECTIONS.damaged_roads };
  }
  if (imageSrc.includes('blockage') || imageSrc.includes('blocked')) {
    return { ...PRESET_DETECTIONS.blocked_roads };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.min(img.width, 320);
        canvas.height = Math.min(img.height, 240);

        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let totalBrightness = 0;
          let variance = 0;
          const pixelCount = data.length / 4;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
          }

          const avgBrightness = totalBrightness / pixelCount;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const bDiff = (r + g + b) / 3 - avgBrightness;
            variance += bDiff * bDiff;
          }

          const contrastStdDev = Math.sqrt(variance / pixelCount);

          let detectedCategory: HazardCategory = userSelectedHint || 'potholes';
          let severity: HazardSeverity = 'high';

          if (userSelectedHint) {
            detectedCategory = userSelectedHint;
          } else if (avgBrightness < 65) {
            detectedCategory = 'broken_streetlights';
            severity = 'moderate';
          } else if (contrastStdDev > 55) {
            detectedCategory = 'potholes';
            severity = 'critical';
          } else if (contrastStdDev > 40) {
            detectedCategory = 'damaged_roads';
            severity = 'high';
          } else {
            detectedCategory = 'waterlogging';
            severity = 'moderate';
          }

          const confidence = Number((89 + (contrastStdDev % 8) + Math.random() * 2).toFixed(1));
          const damageScore = Math.min(96, Math.max(45, Math.round(contrastStdDev * 1.4)));
          const preventiveKg = detectedCategory === 'potholes' ? 40 : detectedCategory === 'damaged_roads' ? 25 : 15;
          const delayedKg = detectedCategory === 'potholes' ? 620 : detectedCategory === 'damaged_roads' ? 780 : 950;
          const divertedKg = delayedKg - preventiveKg;

          const customScan: DetailedAiScan = {
            analysis: {
              confidence,
              hazardType: detectedCategory,
              severity,
              detectedElements: [
                'Surface texture discontinuity',
                'Road friction anomaly',
                'Pavement boundary variance',
              ],
              damageScore,
              urgencyTimeline: severity === 'critical' ? 'Within 6 hours' : 'Within 24-48 hours',
              suggestedAction:
                detectedCategory === 'potholes'
                  ? 'Recycled asphalt (RAP) cold-patch fill and compaction.'
                  : detectedCategory === 'waterlogging'
                  ? 'Clear debris from stormwater inlet and vacuum standing puddle.'
                  : 'Polymerized crack sealing to preserve road sub-base.',
              civicDepartment:
                detectedCategory === 'broken_streetlights'
                  ? 'Bureau of Street Lighting'
                  : 'Dept. of Public Works - Pavement Preservation',
              vehicleRisk: {
                twoWheelers: severity === 'critical' ? 'Severe' : 'High',
                fourWheelers: severity === 'critical' ? 'High' : 'Moderate',
              },
              dimensionsEstimate: `Estimated defect area ${(contrastStdDev * 0.4).toFixed(1)} sq meters`,
              isSimulated: true,
              materialWaste: {
                preventiveMaterialKg: preventiveKg,
                delayedReconstructionMaterialKg: delayedKg,
                materialDivertedKg: divertedKg,
                pavementLifeExtensionMonths: 24,
                recycledAsphaltEligible: true,
                benchmarkSource: 'Civil Engineering Lifecycle Model (FHWA / Asphalt Institute)',
              },
            },
            boxes: [
              {
                id: 'custom-box-1',
                label: `Detected ${detectedCategory.replace('_', ' ')}`,
                confidence,
                x: 25,
                y: 35,
                width: 50,
                height: 40,
                color: '#10b981',
                description: 'Identified surface anomaly with significant texture variance.',
              },
            ],
            scanDurationMs: 650 + Math.round(Math.random() * 250),
            pavementDistressIndex: damageScore,
            surfaceTextureType: 'Detected Pavement Surface',
            environmentalFactors: ['Traffic abrasion', 'Moisture infiltration'],
            sustainabilityBenefit: {
              estimatedEarlyRepairMaterialKg: preventiveKg,
              delayedReconstructionMaterialKg: delayedKg,
              materialDivertedKg: divertedKg,
              estimatedEarlyRepairCost: '$55 (Local patch)',
              delayedFailureCost: '$4,200 (Full lane reconstruction)',
              carbonSavingsPercentage: 82,
              pavementLifeExtensionMonths: 24,
              recommendedMitigation:
                'Early intervention stops micro-cracking from compromising structural road base, diverting massive asphalt milling waste.',
              benchmarkCitation:
                'Calculated from standard civil engineering pavement lifecycle models. Simulated demo detection.',
            },
            technicalDiagnostic: `Visual texture inspection verified surface disruption with standard deviation of ${contrastStdDev.toFixed(1)}. Early detection avoids catastrophic structural asphalt collapse.`,
          };

          resolve(customScan);
          return;
        }
      } catch {
        // quiet fallback
      }
      resolve({ ...PRESET_DETECTIONS.pothole });
    };

    img.onerror = () => {
      resolve({ ...PRESET_DETECTIONS.pothole });
    };

    img.src = imageSrc;
  });
}
