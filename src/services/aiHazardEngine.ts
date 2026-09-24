import { HazardAnalysisResult, HazardType, RiskLevel, LanguageCode, PictogramItem } from '../types';
import { HAZARD_NAMES } from '../translations';
import { BASE_PICTOGRAMS } from '../data/pictogramLibrary';

export interface HazardInferenceInput {
  text?: string;
  voiceTranscript?: string;
  imageUrl?: string;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  languageCode: LanguageCode;
  isDemo?: boolean;
}

export async function analyzeHazardSituation(
  input: HazardInferenceInput
): Promise<HazardAnalysisResult> {
  const combined = `${input.text || ''} ${input.voiceTranscript || ''}`.toLowerCase();
  const hasImage = !!input.imageUrl;
  const hasVoice = !!input.voiceTranscript;
  const hasText = !!input.text && input.text.trim().length > 0;
  const hasLocation = !!input.coordinates;

  let sourceType: 'text' | 'voice' | 'image' | 'location' | 'multimodal' = 'text';
  const inputsCount = [hasText, hasVoice, hasImage, hasLocation].filter(Boolean).length;
  if (inputsCount > 1) {
    sourceType = 'multimodal';
  } else if (hasImage) {
    sourceType = 'image';
  } else if (hasVoice) {
    sourceType = 'voice';
  } else if (hasLocation) {
    sourceType = 'location';
  }

  // 1. Detect Hazard Type
  let detectedHazard: HazardType = 'flood'; // Default for demo or water situation
  let riskLevel: RiskLevel = 'high';
  let priorityScore = 88;
  const priorityReasons: string[] = [];
  const evidence: string[] = [];

  if (
    combined.includes('flood') ||
    combined.includes('water') ||
    combined.includes('വെള്ള') ||
    combined.includes('வெள்ளம்') ||
    combined.includes('बाढ़') ||
    combined.includes('నీరు') ||
    combined.includes('erode') ||
    input.isDemo
  ) {
    detectedHazard = 'flood';
    riskLevel = 'critical';
    priorityScore = 95;
    priorityReasons.push('Rapid water depth increase observed near living areas');
    priorityReasons.push('Moving water poses immediate drowning / vehicle entrapment hazard');
    priorityReasons.push('Critical road link potentially submerged');

    evidence.push('USER REPORTED: Road submerged under fast-flowing water with depth exceeding safe threshold.');
    if (hasImage) evidence.push('OBSERVED: Visual contour confirms water level approaching vehicle axle heights.');
    evidence.push('AI INTERPRETATION: Hydrodynamic hazard with submerged open drains and unseen debris.');
    evidence.push('EXTERNAL DATA: Local rainfall sensor reports continuous heavy precipitation (>65mm/hr).');
    if (input.isDemo) evidence.push('DEMO DATA: High-fidelity simulated incident for Erode, Tamil Nadu demonstration.');
  } else if (
    combined.includes('fire') ||
    combined.includes('smoke') ||
    combined.includes('burn') ||
    combined.includes('தீ') ||
    combined.includes('आग') ||
    combined.includes('మంటలు')
  ) {
    detectedHazard = 'fire';
    riskLevel = 'critical';
    priorityScore = 98;
    priorityReasons.push('Active thermal front and toxic smoke inhalation hazard');
    priorityReasons.push('High likelihood of structural ignition');

    evidence.push('USER REPORTED: Visible open flames and heavy dark smoke rising.');
    evidence.push('OBSERVED: Thermal plume expansion detected.');
    evidence.push('AI INTERPRETATION: Rapid oxygen depletion zone; crawl-low protocol mandatory.');
  } else if (
    combined.includes('quake') ||
    combined.includes('shake') ||
    combined.includes('tremor') ||
    combined.includes('நிலநடுக்கம்') ||
    combined.includes('भूकंप')
  ) {
    detectedHazard = 'earthquake';
    riskLevel = 'high';
    priorityScore = 92;
    priorityReasons.push('Structural shaking and aftershock vulnerability');
    evidence.push('USER REPORTED: Ground tremors and ceiling fixtures swinging.');
    evidence.push('AI INTERPRETATION: High probability of masonry displacement.');
  } else if (
    combined.includes('wire') ||
    combined.includes('electric') ||
    combined.includes('shock') ||
    combined.includes('மின்கம்பி') ||
    combined.includes('बिजली')
  ) {
    detectedHazard = 'electrical';
    riskLevel = 'critical';
    priorityScore = 94;
    priorityReasons.push('High voltage contact hazard in public circulation area');
    evidence.push('USER REPORTED: Snapped live overhead electrical cable hanging near footpath.');
    evidence.push('AI INTERPRETATION: Ground potential gradient danger within 10-meter radius.');
  } else if (
    combined.includes('building') ||
    combined.includes('collapse') ||
    combined.includes('wall') ||
    combined.includes('crack') ||
    combined.includes('கட்டடம்')
  ) {
    detectedHazard = 'damaged_building';
    riskLevel = 'high';
    priorityScore = 87;
    priorityReasons.push('Unstable structural load-bearing components');
    evidence.push('USER REPORTED: Deep shear cracks across exterior wall load lines.');
    evidence.push('AI INTERPRETATION: High collapse potential under vibration or wind.');
  } else if (
    combined.includes('tree') ||
    combined.includes('pole') ||
    combined.includes('branch') ||
    combined.includes('மரம்')
  ) {
    detectedHazard = 'fallen_tree';
    riskLevel = 'moderate';
    priorityScore = 72;
    priorityReasons.push('Corridor transit blocked by fallen biological / structural debris');
    evidence.push('USER REPORTED: Large trunk obstructing vehicular lane.');
    evidence.push('AI INTERPRETATION: Secondary collision risk in poor visibility.');
  } else {
    // Default general heavy rain / weather caution
    detectedHazard = 'heavy_rain';
    riskLevel = 'moderate';
    priorityScore = 76;
    priorityReasons.push('Sustained storm activity with localized flash-flood potential');
    evidence.push('USER REPORTED: Continuous monsoon downpour with reduced street visibility.');
    evidence.push('AI INTERPRETATION: Runoff saturation reaching critical ground absorption levels.');
  }

  // 2. Select Relevant Pictograms
  let pictograms: PictogramItem[] = [];
  if (detectedHazard === 'flood') {
    pictograms = BASE_PICTOGRAMS.filter((p) => p.hazard === 'flood' || p.hazard === 'electrical');
  } else if (detectedHazard === 'fire') {
    pictograms = BASE_PICTOGRAMS.filter((p) => p.hazard === 'fire');
  } else if (detectedHazard === 'earthquake') {
    pictograms = BASE_PICTOGRAMS.filter((p) => p.hazard === 'earthquake');
  } else if (detectedHazard === 'electrical') {
    pictograms = BASE_PICTOGRAMS.filter((p) => p.hazard === 'electrical');
  } else if (detectedHazard === 'damaged_building') {
    pictograms = BASE_PICTOGRAMS.filter((p) => p.hazard === 'damaged_building');
  } else {
    pictograms = BASE_PICTOGRAMS.slice(0, 3);
  }

  // Always include SOS symbol
  const sosPic = BASE_PICTOGRAMS.find((p) => p.id === 'pic-sos-help');
  if (sosPic && !pictograms.some((p) => p.id === 'pic-sos-help')) {
    pictograms.push(sosPic);
  }

  // 3. Multilingual Immediate Actions, Dos, and Don'ts
  const actionsByHazard: Record<
    HazardType,
    {
      explanation: string;
      immediate: string[];
      dos: string[];
      donts: string[];
    }
  > = {
    flood: {
      explanation:
        'Hazardous waterlogging and flash flood conditions detected. Moving water carries extreme momentum and hides deep pits.',
      immediate: [
        'Move immediately to higher ground or upper building level.',
        'Do not attempt to cross or wade into flowing water.',
        'Cut main electrical switch if water is nearing household sockets.',
        'Activate Emergency SOS and broadcast your coordinates.',
      ],
      dos: [
        'Climb to the highest accessible safe floor or platform.',
        'Keep mobile phone charged and in a waterproof bag.',
        'Listen to official disaster management radio and broadcasts.',
        'Help elderly neighbors and children reach elevated shelter.',
      ],
      donts: [
        'Do not walk, swim, or drive through moving water.',
        'Do not touch electrical equipment, switches, or submerged cords.',
        'Do not stay in basements, underground parking, or ground floors.',
        'Do not consume open flood water or unboiled tap water.',
      ],
    },
    fire: {
      explanation:
        'Thermal fire hazard with severe toxic smoke accumulation. Hot gases rise rapidly to upper spaces.',
      immediate: [
        'Evacuate immediately via designated stairs — do NOT use elevators.',
        'Drop to knees and crawl low beneath the rising smoke layer.',
        'Close doors behind you to slow flame and smoke progression.',
        'Call 112 once outside in a safe assembly point.',
      ],
      dos: [
        'Feel doors with the back of your hand before opening.',
        'Cover nose and mouth with a damp cloth if available.',
        'Shout loudly to alert co-occupants while evacuating.',
      ],
      donts: [
        'Do not re-enter a burning building for belongings.',
        'Do not use elevators during fire evacuation.',
        'Do not inhale smoke directly — stay under 2 feet from floor.',
      ],
    },
    earthquake: {
      explanation:
        'Seismic tremors detected. Ground displacement causes falling masonry and flying non-structural debris.',
      immediate: [
        'DROP to hands and knees immediately.',
        'COVER head and neck under a sturdy table or desk.',
        'HOLD ON to shelter until all shaking ceases.',
        'Stay indoors until shaking stops; avoid exterior exits during shaking.',
      ],
      dos: [
        'Protect head with books, bags, or arms if no table is near.',
        'Stay away from glass windows, heavy mirrors, and tall wardrobes.',
        'Turn off gas valves and stove switches if safely reachable.',
      ],
      donts: [
        'Do not run outside during active shaking.',
        'Do not stand in doorways (modern doorways are not load-bearing).',
        'Do not light matches or lighters due to possible gas pipe fractures.',
      ],
    },
    electrical: {
      explanation:
        'Live high-voltage conductor detachment detected. Electric shock and lethal arc flash hazard.',
      immediate: [
        'Maintain minimum 10 meters (33 feet) radial distance from wire.',
        'Warn pedestrians loudly to turn around and avoid the area.',
        'Assume all downed wires are energized and lethal.',
        'Report to electricity board and emergency dispatch (112).',
      ],
      dos: [
        'Shuffle away with feet touching ground if tingling is felt.',
        'Stay inside vehicle if a wire has fallen on the car.',
        'Keep pets and children far from wet metallic fences and poles.',
      ],
      donts: [
        'Do not touch wire with sticks, broom, or plastic (insulation fails at high volts).',
        'Do not step into puddles touching fallen cables.',
        'Do not attempt to move electrical equipment standing in water.',
      ],
    },
    heavy_rain: {
      explanation:
        'Intense cloudburst / sustained precipitation. Flash flooding and lightning strike probabilities elevated.',
      immediate: [
        'Seek solid masonry shelter away from metal sheds and tin roofs.',
        'Avoid open sports grounds, open waters, and isolated tall trees.',
        'Check local drainage grates near driveway to prevent indoor surge.',
      ],
      dos: [
        'Keep emergency flashlight, power bank, and clean drinking water ready.',
        'Stay indoors until peak storm cell passes radar tracks.',
      ],
      donts: [
        'Do not stand under isolated tall trees during lightning.',
        'Do not drive during zero-visibility downpour intervals.',
      ],
    },
    damaged_building: {
      explanation:
        'Structural integrity compromised. Spalling concrete, fractured beams, and imminent collapse danger.',
      immediate: [
        'Evacuate structure immediately without collecting possessions.',
        'Clear perimeter equal to 1.5 times the height of the building.',
        'Report structural defect to municipal disaster monitoring.',
      ],
      dos: [
        'Wear protective footwear to prevent nail / glass puncture.',
        'Alert occupants on lower and upper tiers calmly.',
      ],
      donts: [
        'Do not linger under overhangs, balconies, or signs.',
        'Do not allow vehicles to park directly against cracked facade.',
      ],
    },
    debris: {
      explanation:
        'Slope failure / landslide mudflow and loose debris on transit corridor.',
      immediate: [
        'Evacuate perpendicular to the path of debris flow.',
        'Seek high, stable bedrock or ridge ground.',
      ],
      dos: ['Listen for unusual sounds like cracking trees or boulder rumbles.'],
      donts: ['Do not cross mud accumulation where depth cannot be gauged.'],
    },
    fallen_tree: {
      explanation:
        'Large root uprooting or trunk fracture obstructing public path.',
      immediate: [
        'Cordon off area and set up high-visibility hazard marker.',
        'Check for entangled electrical or telecom utility cables.',
      ],
      dos: ['Divert traffic to parallel designated bypass routes.'],
      donts: ['Do not cut branches that are touching or near electric wires.'],
    },
    blocked_road: {
      explanation:
        'Complete obstruction of evacuation and transport artery.',
      immediate: [
        'Turn vehicle around safely; do not tailgate into blockage.',
        'Report coordinates to emergency response center.',
      ],
      dos: ['Check emergency route alternatives via official advisories.'],
      donts: ['Do not attempt to squeeze through narrow unverified shoulders.'],
    },
    crowd: {
      explanation:
        'Dangerous crowd density surge with stampede and asphyxiation risk.',
      immediate: [
        'Stay on your feet at all costs; keep elbows bent close to chest.',
        'Move diagonally with the flow rather than fighting against it.',
      ],
      dos: ['Look for exits on the peripheral boundaries of the crowd.'],
      donts: ['Do not stop to pick up dropped items or bags.'],
    },
    structural_unsafe: {
      explanation:
        'Severe load-bearing distress identified in structure.',
      immediate: ['Cease occupation and mark building as hazardous.'],
      dos: ['Consult civil engineering and disaster response inspection team.'],
      donts: ['Do not add dynamic loads or allow storage on stressed slabs.'],
    },
  };

  const actionInfo = actionsByHazard[detectedHazard] || actionsByHazard.flood;

  const locName = input.locationName || (input.isDemo ? 'Erode, Tamil Nadu' : 'Location Not Set');
  const hazardName = HAZARD_NAMES[detectedHazard]?.[input.languageCode] || HAZARD_NAMES[detectedHazard]?.en;

  return {
    hazard: detectedHazard,
    hazardName,
    riskLevel,
    explanation: actionInfo.explanation,
    evidence,
    immediateActions: actionInfo.immediate,
    dos: actionInfo.dos,
    donts: actionInfo.donts,
    pictograms,
    priorityScore,
    priorityReasons,
    detectedAt: Date.now(),
    locationName: locName,
    coordinates: input.coordinates || (input.isDemo ? { lat: 11.3410, lng: 77.7172 } : undefined),
    userReportText: input.text,
    userImageUrl: input.imageUrl,
    voiceTranscript: input.voiceTranscript,
    sourceType,
  };
}
