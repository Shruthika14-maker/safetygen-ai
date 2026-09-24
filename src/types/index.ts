export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn';

export type AccessibilityMode = 'standard' | 'child' | 'elderly' | 'low_literacy';

export type HazardType =
  | 'flood'
  | 'fire'
  | 'earthquake'
  | 'heavy_rain'
  | 'electrical'
  | 'damaged_building'
  | 'debris'
  | 'fallen_tree'
  | 'blocked_road'
  | 'crowd'
  | 'structural_unsafe';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type IncidentStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESPONDER_REVIEW' | 'RESOLVED';

export type SectionId =
  | 'home'
  | 'check_safety'
  | 'hazard_analysis'
  | 'pictogram_studio'
  | 'safety_card'
  | 'emergency_center'
  | 'response_center'
  | 'live_incidents'
  | 'incident_map'
  | 'safety_pamphlet'
  | 'clarity_lab'
  | 'analytics'
  | 'settings';

export interface HazardAnalysisResult {
  hazard: HazardType;
  hazardName: string;
  riskLevel: RiskLevel;
  explanation: string;
  evidence: string[];
  immediateActions: string[];
  dos: string[];
  donts: string[];
  pictograms: PictogramItem[];
  priorityScore: number;
  priorityReasons: string[];
  detectedAt: number;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  userReportText?: string;
  userImageUrl?: string;
  voiceTranscript?: string;
  sourceType: 'text' | 'voice' | 'image' | 'location' | 'multimodal';
}

export interface PictogramValidation {
  actionRepresented: boolean;
  dangerVisible: boolean;
  intendedActionClear: boolean;
  visualTooComplex: boolean;
  unnecessaryInfoRemoved: boolean;
  score: number; // 0 - 100
  status: 'VALIDATED' | 'SIMPLIFIED' | 'NEEDS_REVISION';
  feedbackNotes: string[];
}

export interface PictogramItem {
  id: string;
  category: string;
  hazard: HazardType;
  title: Record<LanguageCode, string>;
  caption: Record<LanguageCode, string>;
  actionType: 'prohibit' | 'action' | 'caution' | 'safe';
  symbolKey: string;
  simplifiedLevel?: number; // 1 = standard, 2 = simplified, 3 = ultra-simple
  validation: PictogramValidation;
  clarityStats: {
    understand: number;
    notSure: number;
    dontUnderstand: number;
    total: number;
  };
}

export interface Incident {
  id: string;
  timestamp: number;
  hazard: HazardType;
  severity: RiskLevel;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  source: 'text' | 'voice' | 'image' | 'multimodal';
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  originalReport: string;
  translatedSummary: string; // Responders view English translation
  status: IncidentStatus;
  imageUrl?: string;
  voiceTranscript?: string;
  analysis: HazardAnalysisResult;
  isSos: boolean;
  priorityScore: number;
  priorityReasons: string[];
  clusterId?: string;
  isDemo?: boolean;
}

export interface HotspotCluster {
  id: string;
  hazard: HazardType;
  name: string;
  reportCount: number;
  riskLevel: RiskLevel;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastActivity: string;
  coordinates: { lat: number; lng: number };
}

export interface SystemHealthItem {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'DEMO';
  note: string;
}
