import React from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS, RISK_LABELS, HAZARD_NAMES, SUPPORTED_LANGUAGES } from '../translations';
import { PictogramDisplay } from '../components/PictogramDisplay';
import {
  Printer,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
} from 'lucide-react';

export const SafetyPamphletView: React.FC = () => {
  const { language, activeAnalysis, emergencyNumber } = useApp();

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handlePrint = () => {
    window.print();
  };

  const analysis = activeAnalysis || {
    hazard: 'flood' as const,
    hazardName: 'வெள்ளம் / Flood Emergency',
    riskLevel: 'critical' as const,
    explanation: 'Moving flood water and hazardous street inundation detected. High velocity flow present.',
    immediateActions: [
      'Climb to higher ground or upper floor immediately.',
      'Do not walk, drive, or enter moving flood water.',
      'Cut power mains before water reaches electrical sockets.',
    ],
    dos: [
      'Listen to official disaster management broadcasts.',
      'Keep mobile devices charged in waterproof pouches.',
      'Signal for help with bright cloth if stranded.',
    ],
    donts: [
      'Do not cross unknown water depth on two-wheelers or cars.',
      'Do not touch submerged wires, poles, or transformers.',
    ],
    evidence: ['USER REPORTED: Flood water hazard in sector.'],
    pictograms: [],
    priorityScore: 95,
    priorityReasons: [],
    detectedAt: Date.now(),
    locationName: 'Erode, Tamil Nadu',
    sourceType: 'multimodal' as const,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Non-print toolbar */}
      <div className="print:hidden bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 flex items-center gap-2">
            <Printer className="w-6 h-6 text-blue-600" />
            <span>Standardized Citizen Safety Pamphlet</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Print-optimized A4 format for physical distribution, emergency noticeboards, and community shelter walls.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>📄 PRINT PAMPHLET</span>
        </button>
      </div>

      {/* Printable A4 Layout Container */}
      <div className="bg-white rounded-3xl border-4 border-slate-900 p-8 sm:p-12 shadow-md print:border-none print:p-0 print:shadow-none print:w-full">
        {/* Header Block */}
        <div className="border-b-4 border-slate-900 pb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-md">
                EMERGENCY BULLETIN
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase">
                Language: {currentLangInfo.nativeName} ({currentLangInfo.name})
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-3 tracking-tight">
              SAFETYGEN AI — {analysis.hazardName || HAZARD_NAMES[analysis.hazard]?.[language]}
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-1">
              “{t('tagline')}”
            </p>
          </div>

          {/* Emergency Number Banner */}
          <div className="text-right shrink-0">
            <span className="text-[10px] font-black uppercase text-slate-400 block">
              NATIONAL EMERGENCY NUMBER
            </span>
            <span className="text-3xl font-black text-red-600 tracking-tight">
              {emergencyNumber}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block">
              24/7 Helpline
            </span>
          </div>
        </div>

        {/* Hazard & Severity Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-100 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Target Sector: {analysis.locationName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4" />
            <span>Issued: {new Date(analysis.detectedAt).toLocaleDateString()} at {new Date(analysis.detectedAt).toLocaleTimeString()}</span>
          </div>
          <div>
            <span className="px-3 py-1 rounded-md text-xs font-black uppercase bg-red-600 text-white">
              {RISK_LABELS[analysis.riskLevel]?.[language] || analysis.riskLevel.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Core Warning Text */}
        <div className="mt-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
            HAZARD SITUATION SUMMARY
          </h3>
          <p className="text-base text-slate-900 font-bold leading-relaxed">
            {analysis.explanation}
          </p>
        </div>

        {/* Universal Pictograms Block */}
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>{t('visualSafetyGuide')}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {analysis.pictograms.slice(0, 3).map((pic) => (
              <PictogramDisplay
                key={pic.id}
                item={pic}
                size="md"
                languageCode={language}
              />
            ))}
          </div>
        </div>

        {/* Do's & Don'ts */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Do's */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-base mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t('dosTitle')}</span>
            </div>
            <ul className="space-y-2 text-xs font-bold text-emerald-950">
              {analysis.dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-700">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-300">
            <div className="flex items-center gap-2 text-red-950 font-black text-base mb-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>{t('dontsTitle')}</span>
            </div>
            <ul className="space-y-2 text-xs font-bold text-red-950">
              {analysis.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-700">✕</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200 text-center text-[11px] text-slate-500 space-y-1">
          <p className="font-bold">{t('safetyDisclaimer')}</p>
          <p>SafetyGen AI Emergency Systems • Multi-lingual Citizen Safety Platform</p>
        </div>
      </div>
    </div>
  );
};
