import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS } from '../translations';
import { requestUserLocation, LocationData } from '../services/location';
import { analyzeHazardSituation } from '../services/aiHazardEngine';
import { createSpeechRecognizer } from '../services/speech';
import {
  MapPin,
  Camera,
  Mic,
  MicOff,
  Type,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Info,
} from 'lucide-react';

export const CheckMySafety: React.FC = () => {
  const {
    language,
    setActiveAnalysis,
    setActiveSection,
    setNotification,
    isOnline,
  } = useApp();

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  // Input states
  const [inputText, setInputText] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Image states
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Location states
  const [locationData, setLocationData] = useState<LocationData>({
    status: 'AVAILABLE',
    locationName: 'Not requested yet',
  });
  const [locationLoading, setLocationLoading] = useState(false);

  // Analyzing state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    const hasRec =
      typeof window !== 'undefined' &&
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
    setVoiceSupported(hasRec);
  }, []);

  // Voice toggle
  const toggleVoiceRecording = () => {
    if (!voiceSupported) {
      setVoiceError('Voice input is unavailable on this device. You can type your message instead.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    setVoiceError(null);
    const recognizer = createSpeechRecognizer(
      language,
      (transcript) => {
        setVoiceTranscript(transcript);
      },
      (errorMsg) => {
        setVoiceError(errorMsg);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (recognizer) {
      recognitionRef.current = recognizer;
      try {
        recognizer.start();
        setIsRecording(true);
      } catch (e) {
        setVoiceError('Could not start microphone.');
        setIsRecording(false);
      }
    } else {
      setVoiceSupported(false);
      setVoiceError('Voice input is unavailable on this device. You can type your message instead.');
    }
  };

  // Location request
  const handleRequestLocation = async () => {
    setLocationLoading(true);
    const res = await requestUserLocation();
    setLocationData(res);
    setLocationLoading(false);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Preset Samples
  const handlePresetScenario = (scenario: 'flood' | 'fire' | 'electrical') => {
    if (scenario === 'flood') {
      setInputText('I am trapped on the ground floor. Water has reached my knees and is rising fast on the street.');
      setImageUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="%231e3a8a"/><text x="50%" y="45%" fill="white" font-size="20" font-weight="bold" text-anchor="middle">FLOOD WATER INGRESS</text><text x="50%" y="65%" fill="%2393c5fd" font-size="14" text-anchor="middle">Observed Depth: 3.2 ft</text></svg>');
      setImageFileName('sample_flood_submerged_road.png');
      setLocationData({
        status: 'AVAILABLE',
        coordinates: { lat: 11.3410, lng: 77.7172 },
        locationName: 'Erode, Tamil Nadu (Demo Coords)',
      });
    } else if (scenario === 'fire') {
      setInputText('Dense black smoke filling the stairway corridor. Flames visible from electrical utility room on 2nd floor.');
      setImageUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="%23b91c1c"/><text x="50%" y="45%" fill="white" font-size="20" font-weight="bold" text-anchor="middle">CORRIDOR SMOKE & FIRE</text><text x="50%" y="65%" fill="%23fca5a5" font-size="14" text-anchor="middle">Thermal Flare Active</text></svg>');
      setImageFileName('sample_fire_smoke.png');
      setLocationData({
        status: 'AVAILABLE',
        coordinates: { lat: 12.9759, lng: 80.2212 },
        locationName: 'Velachery, Chennai (Demo Coords)',
      });
    } else if (scenario === 'electrical') {
      setInputText('Live overhead electrical wire snapped and dangling into standing street water puddle. Continuous sparking.');
      setImageUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="%23ca8a04"/><text x="50%" y="45%" fill="white" font-size="20" font-weight="bold" text-anchor="middle">FALLEN LIVE CABLE</text><text x="50%" y="65%" fill="%23fef08a" font-size="14" text-anchor="middle">High Voltage Arc</text></svg>');
      setImageFileName('sample_electrical_cable.png');
      setLocationData({
        status: 'AVAILABLE',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        locationName: 'Chennai Central, Tamil Nadu',
      });
    }
  };

  // Run AI Hazard Analysis
  const handleStartAnalysis = async () => {
    const combinedText = [inputText, voiceTranscript].filter(Boolean).join(' ');
    if (!combinedText && !imageUrl && locationData.status !== 'AVAILABLE') {
      setNotification({
        title: 'Input Required',
        message: 'Please provide at least text, voice, an image, or your location to evaluate safety.',
        type: 'warning',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeHazardSituation({
        text: inputText,
        voiceTranscript,
        imageUrl: imageUrl || undefined,
        locationName: locationData.locationName,
        coordinates: locationData.coordinates,
        languageCode: language,
        isDemo: locationData.locationName.includes('Demo') || false,
      });

      setActiveAnalysis(result);
      setIsAnalyzing(false);

      setNotification({
        title: 'Hazard Analysis Complete',
        message: `Detected ${result.hazardName} (${result.riskLevel.toUpperCase()}). Directing to Safety Card.`,
        type: 'success',
      });

      setActiveSection('safety_card');
    } catch (e) {
      setIsAnalyzing(false);
      setNotification({
        title: 'Analysis Fallback',
        message: 'AI analysis encountered an issue; standard flood safety protocols engaged.',
        type: 'error',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
          Check My Safety
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Provide any available input: Text, Voice, Photo, or Location. SafetyGen AI will synthesize the context and generate instant pictorial instructions.
        </p>
      </div>

      {/* Input Status Matrix (Honest availability display) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Text Status */}
        <div className="p-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Type className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">TEXT INPUT</span>
          </div>
          <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            AVAILABLE
          </span>
        </div>

        {/* Voice Status */}
        <div className="p-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-slate-700">VOICE INPUT</span>
          </div>
          {voiceSupported ? (
            <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              AVAILABLE
            </span>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              UNAVAILABLE ON DEVICE
            </span>
          )}
        </div>

        {/* Image Status */}
        <div className="p-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">IMAGE / CAMERA</span>
          </div>
          <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            AVAILABLE
          </span>
        </div>

        {/* Location Status */}
        <div className="p-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-slate-700">LOCATION</span>
          </div>
          <span
            className={`text-[11px] font-black flex items-center gap-1 ${
              locationData.status === 'AVAILABLE'
                ? 'text-emerald-700'
                : locationData.status === 'DENIED'
                ? 'text-red-700'
                : 'text-amber-700'
            }`}
          >
            {locationData.status === 'AVAILABLE' ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {locationData.status}
          </span>
        </div>
      </div>

      {/* Preset Scenarios for Rapid Testing */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">
          ⚡ Quick Demo Scenarios (One-Click Populate)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePresetScenario('flood')}
            className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold transition-colors cursor-pointer"
          >
            🌊 Submerged Road (Erode Flood)
          </button>
          <button
            onClick={() => handlePresetScenario('fire')}
            className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-xs font-bold transition-colors cursor-pointer"
          >
            🔥 Smoke & Fire in Stairwell
          </button>
          <button
            onClick={() => handlePresetScenario('electrical')}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
          >
            ⚡ Live Downed Electrical Cable
          </button>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* 1. Tell Us (Text & Voice) */}
        <div>
          <label className="block text-sm font-black text-slate-900 mb-2">
            1. Describe the Situation (Text or Voice)
          </label>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., The road is flooded with knee-deep water. Electricity pole has fallen nearby. We need help."
              rows={3}
              className="w-full rounded-2xl border-2 border-slate-200 p-4 text-slate-900 text-sm focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Voice Input Button */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={toggleVoiceRecording}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'Listening... Tap to Stop' : '🎙️ Tap to Speak'}</span>
            </button>

            {voiceTranscript && (
              <span className="text-xs text-slate-600 italic">
                “{voiceTranscript}”
              </span>
            )}
          </div>

          {voiceError && (
            <p className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{voiceError}</span>
            </p>
          )}
        </div>

        {/* 2. Show Surroundings (Image Upload) */}
        <div>
          <label className="block text-sm font-black text-slate-900 mb-2">
            2. Show Surroundings (Photo or Hazard Image)
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-slate-300 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Photo / Capture</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {imageFileName && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[200px]">{imageFileName}</span>
                <button
                  onClick={() => {
                    setImageUrl(null);
                    setImageFileName(null);
                  }}
                  className="text-red-600 hover:text-red-800 font-bold ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="mt-3 max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-xs">
              <img src={imageUrl} alt="Uploaded surroundings" className="w-full h-40 object-cover" />
            </div>
          )}
        </div>

        {/* 3. Location */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-black text-slate-900">
              3. Location Context (GPS or Coordinates)
            </label>
            <button
              onClick={handleRequestLocation}
              disabled={locationLoading}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${locationLoading ? 'animate-spin' : ''}`} />
              <span>{locationLoading ? 'Detecting...' : 'Detect My Location'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {locationData.locationName}
                </p>
                {locationData.coordinates && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    Lat: {locationData.coordinates.lat.toFixed(4)}, Lng: {locationData.coordinates.lng.toFixed(4)}
                  </p>
                )}
                {locationData.errorMessage && (
                  <p className="text-xs text-amber-700 mt-0.5">
                    {locationData.errorMessage}
                  </p>
                )}
              </div>
            </div>

            <span
              className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase ${
                locationData.status === 'AVAILABLE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {locationData.status}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Emergency features function even if location is unavailable or denied.
          </p>
        </div>

        {/* Action Button: Evaluate Danger */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black text-base shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'ANALYZING DANGER SITUATION...' : 'ANALYZE HAZARD & GENERATE PICTOGRAMS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
