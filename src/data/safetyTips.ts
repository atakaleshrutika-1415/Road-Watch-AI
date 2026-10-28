export interface SafetyTip {
  id: string;
  category: 'potholes' | 'waterlogging' | 'damaged_roads' | 'broken_streetlights' | 'blocked_roads' | 'general';
  title: string;
  summary: string;
  dos: string[];
  donts: string[];
  urgency: 'high' | 'medium' | 'standard';
}

export interface EmergencyContact {
  label: string;
  number: string;
  hours: string;
  purpose: string;
}

export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: 'tip-potholes',
    category: 'potholes',
    title: 'Navigating Sudden Potholes & Cratering',
    summary:
      'Improper handling of potholes causes over $3 billion in vehicle suspension and tire damage annually. Never swerve abruptly into oncoming lanes.',
    dos: [
      'Firmly hold the steering wheel with both hands at 9 and 3 o’clock position.',
      'Brake firmly BEFORE the pothole, then release the brake pedal right before entering to allow suspension to absorb the impact.',
      'Check rear-view mirrors before reducing speed to prevent rear-end collisions.',
      'Inspect tire sidewalls for bubbles or rim bends as soon as safely parked.',
    ],
    donts: [
      'Do not brake hard while directly inside the pothole (locks suspension and concentrates force into the rim).',
      'Do not violently swerve without checking blind spots or oncoming traffic.',
      'Do not drive on low-profile tires over known high-distress road corridors.',
    ],
    urgency: 'high',
  },
  {
    id: 'tip-waterlogging',
    category: 'waterlogging',
    title: 'Standing Floodwater & Hydroplaning Prevention',
    summary:
      'Just 15cm (6 inches) of standing water can stall an engine and cause catalytic damage, while 30cm can float smaller passenger vehicles.',
    dos: [
      'Slow down significantly when approaching puddles or reflective lane surfaces.',
      'Drive in the highest crown of the road (usually the center lane) where water drains away first.',
      'Follow the tire tracks of vehicles ahead at a safe distance (minimum 4-second gap).',
      'Gently tap your brakes several times after clearing standing water to dry the brake pads.',
    ],
    donts: [
      'Never drive into moving floodwaters or puddles of unknown depth ("Turn Around, Don\'t Drown").',
      'Never use cruise control on wet or rain-soaked pavements.',
      'Do not restart an engine if stalled in deep water (causes catastrophic hydrolock).',
    ],
    urgency: 'high',
  },
  {
    id: 'tip-damaged-roads',
    category: 'damaged_roads',
    title: 'Fissured Pavement & Structural Edge Ruts',
    summary:
      'Longitudinal road tears and uneven milling can catch motorcycle and bicycle front tires, causing instant loss of control.',
    dos: [
      'Cross longitudinal pavement cracks and ruts at an angle of 45° to 90° whenever possible.',
      'Increase following distance to 4–6 seconds to see surface hazards through the car ahead.',
      'Report widening alligator cracking early before sub-base water infiltration destroys the foundation.',
    ],
    donts: [
      'Do not speed on newly milled surfaces or construction transitions.',
      'Do not ride along the road edge seam where shoulder drop-offs exceed 5cm.',
    ],
    urgency: 'medium',
  },
  {
    id: 'tip-streetlights',
    category: 'broken_streetlights',
    title: 'Blackout Intersections & Unlit Corridors',
    summary:
      'Over 40% of fatal pedestrian accidents occur on unlit or poorly illuminated roadway corridors during twilight and night.',
    dos: [
      'Reduce vehicle speed by 10–15 mph below daytime limits through unlit blocks.',
      'Scan crosswalks and bus stops actively with your peripheral vision.',
      'Use high beams only when no oncoming traffic or forward vehicles are within 500 feet.',
      'Clean windshields and headlights regularly to prevent glare distortion.',
    ],
    donts: [
      'Do not rely solely on automated driver-assist sensors in dark rain conditions.',
      'Do not assume pedestrians wearing dark clothing can see your approaching vehicle.',
    ],
    urgency: 'medium',
  },
  {
    id: 'tip-blocked-roads',
    category: 'blocked_roads',
    title: 'Obstacles, Fallen Trees & Storm Debris',
    summary:
      'Unmarked roadway debris creates severe chain-reaction collisions, especially on curved highway connectors and high-speed boulevards.',
    dos: [
      'Turn on hazard warning flashers immediately to alert following drivers.',
      'Stop in a safe location upstream and set up safety triangles if safe to do so.',
      'Report exact GPS coordinates to RoadWatch AI and notify local emergency services.',
    ],
    donts: [
      'Never attempt to drag heavy fallen branches or live power lines yourself.',
      'Never stand on an active roadway to film or inspect road debris.',
    ],
    urgency: 'high',
  },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    label: 'Emergency Police & Paramedics',
    number: '911',
    hours: '24/7 Toll-Free',
    purpose: 'Immediate life hazard, active collisions, or blocked expressways.',
  },
  {
    label: 'Municipal 311 Citizen Services',
    number: '311',
    hours: '24/7 Available',
    purpose: 'Non-emergency pothole reports, broken streetlights, clogged storm drains.',
  },
  {
    label: 'Highway Patrol Traffic Operations',
    number: '1-800-TELL-CHP',
    hours: '24/7 Monitoring',
    purpose: 'Interstate debris, fallen cargo, expressway shoulder hazards.',
  },
  {
    label: 'National Roadside Assistance (AAA)',
    number: '1-800-222-4357',
    hours: '24/7 Dispatch',
    purpose: 'Towing, flat tire replacement, wheel rim bent by road craters.',
  },
];

export const SUSTAINABILITY_INSIGHTS = [
  {
    title: 'The 15x Maintenance Cost Multiplier',
    stat: '15x',
    description:
      'A minor asphalt crack caught early costs ~$35 to seal with polymer bitumen. Left unaddressed for 6 months, water infiltrates the sub-base, causing deep potholing that requires a full-depth excavation costing $500–$8,500.',
  },
  {
    title: '78% Carbon Emission Reduction',
    stat: '-78% CO₂',
    description:
      'Preventive localized surface treatments avoid energy-intensive asphalt milling, hauling, and high-temperature bitumen production, reducing lifecycle highway emissions by over three-quarters.',
  },
  {
    title: 'Community Safety & Equity',
    stat: '42%',
    description:
      'AI crowd-mapping ensures low-income and transit-heavy neighborhoods receive equal municipal maintenance attention, eliminating the disparity in road repair response times.',
  },
];
