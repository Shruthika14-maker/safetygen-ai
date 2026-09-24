import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  AccessibilityMode,
  SectionId,
  Incident,
  HazardAnalysisResult,
  HotspotCluster,
  PictogramItem,
  IncidentStatus,
  SystemHealthItem,
} from '../types';
import { INITIAL_INCIDENTS, INITIAL_HOTSPOTS } from '../data/initialIncidents';
import { BASE_PICTOGRAMS } from '../data/pictogramLibrary';
import { speechManager } from '../services/speech';
import { simplifyPictogram } from '../services/pictogramGenerator';

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  accessibilityMode: AccessibilityMode;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  incidents: Incident[];
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  hotspots: HotspotCluster[];
  activeAnalysis: HazardAnalysisResult | null;
  setActiveAnalysis: (analysis: HazardAnalysisResult | null) => void;
  isOnline: boolean;
  emergencyNumber: string;
  setEmergencyNumber: (num: string) => void;
  pictograms: PictogramItem[];
  submitClarityRating: (id: string, rating: 'understand' | 'notSure' | 'dontUnderstand') => void;
  simplifyPictogramInState: (id: string) => void;
  runFloodDemo: () => void;
  demoStepIndex: number | null;
  setDemoStepIndex: (idx: number | null) => void;
  createIncidentFromAnalysis: (analysis: HazardAnalysisResult, isSos?: boolean) => Incident;
  systemHealth: SystemHealthItem[];
  showHealthModal: boolean;
  setShowHealthModal: (show: boolean) => void;
  notification: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' } | null;
  setNotification: (notif: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' } | null) => void;
  sosModalOpen: boolean;
  setSosModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('safetygen_lang');
    return (saved as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    speechManager.stop();
    setLanguageState(lang);
    localStorage.setItem('safetygen_lang', lang);
  };

  // 2. Accessibility Mode
  const [accessibilityMode, setAccessibilityModeState] = useState<AccessibilityMode>(() => {
    const saved = localStorage.getItem('safetygen_access_mode');
    return (saved as AccessibilityMode) || 'standard';
  });

  const setAccessibilityMode = (mode: AccessibilityMode) => {
    setAccessibilityModeState(mode);
    localStorage.setItem('safetygen_access_mode', mode);
  };

  // 3. Navigation
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  // 4. Incidents Store
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem('safetygen_incidents_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('safetygen_incidents_v2', JSON.stringify(incidents));
  }, [incidents]);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [hotspots] = useState<HotspotCluster[]>(INITIAL_HOTSPOTS);

  // 5. Active Hazard Analysis
  const [activeAnalysis, setActiveAnalysis] = useState<HazardAnalysisResult | null>(() => {
    // Default to the first incident analysis so safety card always has rich context
    return INITIAL_INCIDENTS[0].analysis;
  });

  // 6. Online Status
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 7. Emergency Contact Number
  const [emergencyNumber, setEmergencyNumberState] = useState<string>(() => {
    return localStorage.getItem('safetygen_emergency_phone') || '112';
  });

  const setEmergencyNumber = (num: string) => {
    setEmergencyNumberState(num);
    localStorage.setItem('safetygen_emergency_phone', num);
  };

  // 8. Pictograms Library
  const [pictograms, setPictograms] = useState<PictogramItem[]>(() => {
    try {
      const saved = localStorage.getItem('safetygen_pictograms_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return BASE_PICTOGRAMS;
  });

  useEffect(() => {
    localStorage.setItem('safetygen_pictograms_v2', JSON.stringify(pictograms));
  }, [pictograms]);

  const submitClarityRating = (id: string, rating: 'understand' | 'notSure' | 'dontUnderstand') => {
    setPictograms((prev) =>
      prev.map((pic) => {
        if (pic.id === id) {
          const stats = { ...pic.clarityStats };
          stats[rating] += 1;
          stats.total += 1;
          return { ...pic, clarityStats: stats };
        }
        return pic;
      })
    );
  };

  const simplifyPictogramInState = (id: string) => {
    setPictograms((prev) =>
      prev.map((pic) => {
        if (pic.id === id) {
          return simplifyPictogram(pic);
        }
        return pic;
      })
    );
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          return { ...inc, status };
        }
        return inc;
      })
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const createIncidentFromAnalysis = (analysis: HazardAnalysisResult, isSos = false): Incident => {
    const nextNumber = incidents.length + 1;
    const padded = String(nextNumber).padStart(3, '0');
    const newId = `SG-${padded}`;

    const newIncident: Incident = {
      id: newId,
      timestamp: Date.now(),
      hazard: analysis.hazard,
      severity: analysis.riskLevel,
      locationName: analysis.locationName,
      coordinates: analysis.coordinates,
      source: analysis.sourceType === 'multimodal' ? 'multimodal' : (analysis.sourceType as any),
      language: language,
      accessibilityMode: accessibilityMode,
      originalReport: analysis.userReportText || analysis.voiceTranscript || 'Citizen emergency assistance request',
      translatedSummary: `${analysis.hazard.toUpperCase()} reported at ${analysis.locationName}. Severity assessed as ${analysis.riskLevel.toUpperCase()}.`,
      status: 'NEW',
      isSos,
      imageUrl: analysis.userImageUrl,
      voiceTranscript: analysis.voiceTranscript,
      analysis,
      priorityScore: analysis.priorityScore,
      priorityReasons: analysis.priorityReasons,
      isDemo: false,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    return newIncident;
  };

  // Demo step tracking & notification
  const [demoStepIndex, setDemoStepIndex] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  } | null>(null);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // System Health live stats
  const [systemHealth, setSystemHealth] = useState<SystemHealthItem[]>([]);

  useEffect(() => {
    const hasMedia = typeof navigator !== 'undefined' && !!navigator.mediaDevices;
    const hasGeo = typeof navigator !== 'undefined' && 'geolocation' in navigator;
    const hasSpeechRec =
      typeof window !== 'undefined' &&
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
    const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;

    setSystemHealth([
      { id: 'ai', name: 'AI Hazard Reasoning Engine', status: 'AVAILABLE', note: 'Multimodal rule & heuristic AI active' },
      { id: 'voice_in', name: 'Multilingual Voice Input', status: hasSpeechRec ? 'AVAILABLE' : 'LIMITED', note: hasSpeechRec ? 'Web Speech API ready' : 'Browser lacks SpeechRecognition (Text fallback active)' },
      { id: 'tts', name: 'Text-to-Speech Engine', status: hasTTS ? 'AVAILABLE' : 'UNAVAILABLE', note: hasTTS ? 'Synthesizer online (BCP-47 localized)' : 'TTS not supported on device' },
      { id: 'camera', name: 'Camera & Image Capture', status: hasMedia ? 'AVAILABLE' : 'LIMITED', note: hasMedia ? 'Hardware media input supported' : 'File upload fallback available' },
      { id: 'location', name: 'Geolocation Services', status: hasGeo ? 'AVAILABLE' : 'LIMITED', note: hasGeo ? 'GPS / Network positioning ready' : 'Location API missing' },
      { id: 'translation', name: 'Multilingual Architecture', status: 'AVAILABLE', note: '8 regional languages mapped & localized' },
      { id: 'pictogram', name: 'Pictogram Studio & ISO Engine', status: 'AVAILABLE', note: 'ISO 7010 vector symbols with clarity loop' },
      { id: 'sos_store', name: 'Persistent SOS Incident Store', status: 'AVAILABLE', note: 'Browser persistent storage & broadcast sync' },
      { id: 'emergency_call', name: 'Emergency Calling (112)', status: 'AVAILABLE', note: 'tel: protocol dialer with user confirmation' },
      { id: 'sms', name: 'Emergency SMS Dispatcher', status: 'AVAILABLE', note: 'Pre-filled emergency SMS URI ready' },
      { id: 'offline', name: 'Offline Cache & PWA Support', status: isOnline ? 'AVAILABLE' : 'LIMITED', note: isOnline ? 'Online (Asset cache primed)' : 'Offline mode active (Core guidance available)' },
    ]);
  }, [isOnline]);

  // Try Flood Demo execution
  const runFloodDemo = () => {
    setDemoStepIndex(0);
    // Switch to Tamil for authentic regional demonstration
    setLanguage('ta');
    setAccessibilityMode('elderly');

    // Create Erode Flood analysis
    const floodPic = BASE_PICTOGRAMS.filter((p) => p.hazard === 'flood' || p.hazard === 'electrical');
    const floodAnalysis: HazardAnalysisResult = {
      hazard: 'flood',
      hazardName: 'வெள்ளம் / நீர் தேக்கம்',
      riskLevel: 'critical',
      explanation: 'ஈரோடு பவானி ஆற்றுப் படுகையில் திடீர் நீர்வரத்து காரணமாக சாலைகளில் ஆபத்தான வெள்ளம் ஏற்பட்டுள்ளது.',
      evidence: [
        'USER REPORTED: "நான் ஈரோட்டில் இருக்கிறேன். எனக்கு அருகில் உள்ள சாலை வெள்ளத்தில் மூழ்கியுள்ளது. நான் என்ன செய்ய வேண்டும்?"',
        'OBSERVED: நீர்மட்டம் 3 அடியைத் தாண்டி வீடுகளுக்குள் புகும் அபாயம்.',
        'AI INTERPRETATION: அதிவேக நீரோட்டம் மற்றும் மின்சாரப் பாதை ஆபத்து.',
        'DEMO DATA: முழுமையான இறுதி-வரை செயல்முறை விளக்கம் (ஈரோடு, தமிழ்நாடு).',
      ],
      immediateActions: [
        'உடனடியாக மேடான இடத்திற்கு அல்லது மேல் மாடிக்குச் செல்லவும்.',
        'பாய்ந்து வரும் வெள்ள நீரில் ஒருபோதும் இறங்கவோ நடக்கவோ கூடாது.',
        'வீட்டு மின்சார மெயின் இணைப்பை உடனடியாக அணைக்கவும்.',
        'அவசர SOS அனுப்பி உங்கள் இருப்பிடத்தைப் பகிரவும்.',
      ],
      dos: [
        'மிக உயர்ந்த பாதுகாப்பான தளத்திற்கு ஏறவும்.',
        'கைபேசியை பிளாஸ்டிக் பையில் பாதுகாப்பாக வைக்கவும்.',
        'அரசு அதிகாரிகளின் ஒலிபெருக்கி அறிவிப்பைக் கவனிக்கவும்.',
      ],
      donts: [
        'வெள்ள நீரில் வாகனத்தை இயக்காதீர்.',
        'நீரில் உள்ள மின்கம்பங்கள் மற்றும் மின்சாதனங்களை தொடாதீர்.',
      ],
      pictograms: floodPic,
      priorityScore: 98,
      priorityReasons: [
        'Critical flood depth exceeding safe parameters',
        'Elderly citizen assistance flagged',
        'Active water velocity on evacuation road',
      ],
      detectedAt: Date.now(),
      locationName: 'Erode (Bhavani River Basin), Tamil Nadu',
      coordinates: { lat: 11.3410, lng: 77.7172 },
      userReportText: 'நான் ஈரோட்டில் இருக்கிறேன். எனக்கு அருகில் உள்ள சாலை வெள்ளத்தில் மூழ்கியுள்ளது. நான் என்ன செய்ய வேண்டும்?',
      voiceTranscript: 'நான் ஈரோட்டில் இருக்கிறேன். எனக்கு அருகில் உள்ள சாலை வெள்ளத்தில் மூழ்கியுள்ளது.',
      sourceType: 'multimodal',
    };

    setActiveAnalysis(floodAnalysis);
    setActiveSection('safety_card');

    setNotification({
      title: 'FLOOD DEMO EXECUTED (ஈரோடு)',
      message: 'Multimodal input analyzed → Flood detected (Critical Risk) → Pictograms generated → Tamil safety card created with Audio & SOS.',
      type: 'success',
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        accessibilityMode,
        setAccessibilityMode,
        activeSection,
        setActiveSection,
        incidents,
        selectedIncident,
        setSelectedIncident,
        updateIncidentStatus,
        hotspots,
        activeAnalysis,
        setActiveAnalysis,
        isOnline,
        emergencyNumber,
        setEmergencyNumber,
        pictograms,
        submitClarityRating,
        simplifyPictogramInState,
        runFloodDemo,
        demoStepIndex,
        setDemoStepIndex,
        createIncidentFromAnalysis,
        systemHealth,
        showHealthModal,
        setShowHealthModal,
        notification,
        setNotification,
        sosModalOpen,
        setSosModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
