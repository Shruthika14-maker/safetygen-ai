import React from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS, RISK_LABELS, HAZARD_NAMES } from '../translations';
import { PictogramDisplay } from '../components/PictogramDisplay';
import { speechManager } from '../services/speech';
import {
  AlertTriangle,
  Volume2,
  VolumeX,
  FileText,
  AlertOctagon,
  PhoneCall,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const HazardAnalysisView: React.FC = () => {
  const {
    language,
    activeAnalysis,
    setActiveSection,
    setSosModalOpen,
  } = useApp();

  const [isSpeaking, setIsSpeaking] = React.useState(false);

  if (!activeAnalysis) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">No Active Analysis</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          Submit your situation via Check My Safety or run the Flood Demo.
        </p>
        <button
          onClick={() => setActiveSection('check_safety')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Check My Safety
        </button>
      </div>
    );
  }

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  // Severity styles
  const riskBadgeStyles = {
    low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    moderate: 'bg-amber-100 text-amber-800 border-amber-300',
    high: 'bg-orange-100 text-orange-900 border-orange-300',
    critical: 'bg-red-100 text-red-900 border-red-300 animate-pulse',
  };

  const handlePlayAudio = () => {
    if (isSpeaking) {
      speechManager.stop();
      setIsSpeaking(false);
      return;
    }

    const narrationText = [
      activeAnalysis.hazardName,
      activeAnalysis.explanation,
      activeAnalysis.immediateActions.join('. '),
    ].join('. ');

    setIsSpeaking(true);
    speechManager.speak(narrationText, language, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  riskBadgeStyles[activeAnalysis.riskLevel]
                }`}
              >
                ● {RISK_LABELS[activeAnalysis.riskLevel]?.[language] || activeAnalysis.riskLevel.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {new Date(activeAnalysis.detectedAt).toLocaleTimeString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 mt-2">
              {activeAnalysis.hazardName || HAZARD_NAMES[activeAnalysis.hazard]?.[language]}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Location: {activeAnalysis.locationName}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? t('stopAudio') : t('playAudio')}</span>
            </button>

            <button
              onClick={() => setActiveSection('safety_card')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Full Safety Card</span>
            </button>

            <button
              onClick={() => setSosModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{t('sendSos')}</span>
            </button>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">
            Hazard Understanding & Risk Evaluation
          </h2>
          <p className="text-slate-800 text-base leading-relaxed font-medium">
            {activeAnalysis.explanation}
          </p>
        </div>

        {/* Evidence Breakdown (Explicitly distinguished) */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
            Evidence Sourcing (Observed vs Reported vs AI)
          </h3>
          <div className="space-y-2">
            {activeAnalysis.evidence.map((item, idx) => {
              const isObserved = item.startsWith('OBSERVED');
              const isUser = item.startsWith('USER REPORTED');
              const isDemo = item.startsWith('DEMO DATA');
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    isObserved
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : isUser
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : isDemo
                      ? 'bg-purple-50 border-purple-200 text-purple-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pictograms Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <span>{t('visualSafetyGuide')}</span>
          </h2>
          <button
            onClick={() => setActiveSection('pictogram_studio')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Pictogram Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

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

      {/* Immediate Actions, Do's & Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DO NOW */}
        <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-900 font-black text-base">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{t('dosTitle')}</span>
          </div>
          <ul className="space-y-3">
            {activeAnalysis.dos.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-emerald-950">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DO NOT */}
        <div className="bg-red-50/70 border-2 border-red-200 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4 text-red-950 font-black text-base">
            <XCircle className="w-5 h-5 text-red-600" />
            <span>{t('dontsTitle')}</span>
          </div>
          <ul className="space-y-3">
            {activeAnalysis.donts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-red-950">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✕
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
