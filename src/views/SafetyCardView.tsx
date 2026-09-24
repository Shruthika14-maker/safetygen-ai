import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS, RISK_LABELS, HAZARD_NAMES } from '../translations';
import { PictogramDisplay } from '../components/PictogramDisplay';
import { speechManager } from '../services/speech';
import {
  Volume2,
  VolumeX,
  PhoneCall,
  MessageSquare,
  AlertOctagon,
  Printer,
  CheckCircle2,
  XCircle,
  Share2,
  MapPin,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const SafetyCardView: React.FC = () => {
  const {
    language,
    accessibilityMode,
    activeAnalysis,
    emergencyNumber,
    setActiveSection,
    setSosModalOpen,
    setNotification,
  } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [smsNotice, setSmsNotice] = useState<string | null>(null);

  if (!activeAnalysis) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
        <ShieldAlert className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Safety Card Awaiting Hazard Data</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          Analyze an emergency situation or run the Flood Demo to generate an instant Safety Card.
        </p>
        <button
          onClick={() => setActiveSection('check_safety')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
        >
          Check My Safety
        </button>
      </div>
    );
  }

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  // Emergency Call Action
  const handleEmergencyCall = () => {
    setCallNotice('Your phone app will open. Confirm the call on your device.');
    try {
      window.location.href = `tel:${emergencyNumber}`;
    } catch (e) {
      setCallNotice('Calling is not supported on this device. Please dial 112 manually.');
    }
  };

  // Emergency SMS Preparation Action
  const handlePrepareSms = () => {
    const coordsStr = activeAnalysis.coordinates
      ? `GPS: ${activeAnalysis.coordinates.lat.toFixed(4)}, ${activeAnalysis.coordinates.lng.toFixed(4)}`
      : 'Location: Not available';

    const msgBody = encodeURIComponent(
      `[EMERGENCY SOS] ${activeAnalysis.hazard.toUpperCase()} (${activeAnalysis.riskLevel.toUpperCase()}) at ${activeAnalysis.locationName}. ${coordsStr}. Immediate assistance needed. Time: ${new Date().toLocaleTimeString()}`
    );

    setSmsNotice('SMS MESSAGE PREPARED — Opening messaging app. Review recipient and dispatch.');
    try {
      window.location.href = `sms:${emergencyNumber}?body=${msgBody}`;
    } catch (e) {
      setSmsNotice('SMS is not supported on this device/browser. Please send message manually.');
    }
  };

  // Multilingual Speech Playback
  const handleToggleAudio = () => {
    if (isSpeaking) {
      speechManager.stop();
      setIsSpeaking(false);
      return;
    }

    const narration = [
      activeAnalysis.hazardName,
      activeAnalysis.explanation,
      'Do now: ' + activeAnalysis.dos.join('. '),
      'Do not: ' + activeAnalysis.donts.join('. '),
    ].join('. ');

    setIsSpeaking(true);
    speechManager.speak(narration, language, {
      rate: accessibilityMode === 'elderly' ? 0.85 : 0.95,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const isLowLit = accessibilityMode === 'low_literacy';
  const isChild = accessibilityMode === 'child';
  const isElderly = accessibilityMode === 'elderly';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Printable / Viewable Safety Card container */}
      <div className="bg-white rounded-3xl border-4 border-slate-900 p-6 sm:p-10 shadow-lg relative">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-red-600">
                OFFICIAL CITIZEN SAFETY CARD
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-3.5 py-1 rounded-xl font-black text-sm uppercase tracking-wide ${
                  activeAnalysis.riskLevel === 'critical'
                    ? 'bg-red-600 text-white'
                    : activeAnalysis.riskLevel === 'high'
                    ? 'bg-orange-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {RISK_LABELS[activeAnalysis.riskLevel]?.[language] || activeAnalysis.riskLevel.toUpperCase()}
              </span>

              <h1 className={`${isElderly ? 'text-4xl' : 'text-3xl'} font-black text-slate-950`}>
                {activeAnalysis.hazardName || HAZARD_NAMES[activeAnalysis.hazard]?.[language]}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                {activeAnalysis.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(activeAnalysis.detectedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('safety_pamphlet')}
              className="p-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Print Pamphlet"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Low-Literacy / Child: Pictograms shown FIRST */}
        {(isLowLit || isChild) && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-amber-950 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>LOOK AT PICTURES FIRST</span>
              </h3>
              <button
                onClick={handleToggleAudio}
                className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Now</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activeAnalysis.pictograms.slice(0, 2).map((pic) => (
                <PictogramDisplay
                  key={pic.id}
                  item={pic}
                  size={isChild ? 'xl' : 'lg'}
                  languageCode={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* What is happening? */}
        <div className="mt-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
            WHAT IS HAPPENING?
          </h2>
          <p className={`${isElderly ? 'text-xl' : 'text-base'} text-slate-900 font-semibold leading-relaxed`}>
            {activeAnalysis.explanation}
          </p>
        </div>

        {/* Standard Pictograms Grid */}
        {!isLowLit && !isChild && (
          <div className="mt-8">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>{t('visualSafetyGuide')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeAnalysis.pictograms.map((pic) => (
                <PictogramDisplay
                  key={pic.id}
                  item={pic}
                  size="md"
                  languageCode={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Do Now & Do Not Columns */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO NOW */}
          <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-5">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-lg mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>{t('dosTitle')}</span>
            </div>
            <ol className="space-y-2.5">
              {activeAnalysis.dos.map((d, i) => (
                <li key={i} className={`flex items-start gap-2.5 font-bold text-emerald-950 ${isElderly ? 'text-base' : 'text-sm'}`}>
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* DO NOT */}
          <div className="bg-red-50 rounded-2xl border-2 border-red-300 p-5">
            <div className="flex items-center gap-2 text-red-950 font-black text-lg mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <span>{t('dontsTitle')}</span>
            </div>
            <ul className="space-y-2.5">
              {activeAnalysis.donts.map((d, i) => (
                <li key={i} className={`flex items-start gap-2.5 font-bold text-red-950 ${isElderly ? 'text-base' : 'text-sm'}`}>
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 Large Action Buttons: Audio, SOS, Call, SMS */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Play Audio */}
          <button
            onClick={handleToggleAudio}
            className={`p-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-6 h-6 animate-pulse" /> : <Volume2 className="w-6 h-6 text-amber-600" />}
            <span>{isSpeaking ? t('stopAudio') : t('playAudio')}</span>
          </button>

          {/* 2. Send SOS */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex flex-col items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <AlertOctagon className="w-6 h-6 animate-bounce" />
            <span>{t('sendSos')}</span>
          </button>

          {/* 3. Call Emergency 112 */}
          <button
            onClick={handleEmergencyCall}
            className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex flex-col items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-6 h-6" />
            <span>{t('callEmergency')}</span>
          </button>

          {/* 4. Prepare SMS */}
          <button
            onClick={handlePrepareSms}
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex flex-col items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-6 h-6" />
            <span>{t('prepareSms')}</span>
          </button>
        </div>

        {/* Notices */}
        {callNotice && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
            ℹ️ {callNotice}
          </div>
        )}
        {smsNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
            📱 {smsNotice}
          </div>
        )}

        {/* Safety Disclaimer Banner */}
        <div className="mt-6 p-3 rounded-xl bg-slate-100 text-slate-600 text-xs text-center leading-relaxed">
          {t('safetyDisclaimer')}
        </div>
      </div>
    </div>
  );
};
