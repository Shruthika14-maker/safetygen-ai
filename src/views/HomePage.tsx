import React from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS } from '../translations';
import {
  MapPin,
  Camera,
  Mic,
  AlertOctagon,
  Waves,
  ArrowRight,
  ShieldCheck,
  Eye,
  Languages,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, setActiveSection, runFloodDemo } = useApp();

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold tracking-wide uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            SafetyGen AI Disaster Safety System
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {t('appName')}
          </h1>

          <p className="mt-3 text-lg sm:text-2xl font-bold text-slate-700 leading-snug">
            “{t('tagline')}”
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {t('appDescription')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={runFloodDemo}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Waves className="w-5 h-5 animate-pulse" />
              <span>{t('tryFloodDemo')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSection('emergency_center')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <AlertOctagon className="w-5 h-5" />
              <span>{t('emergency')}</span>
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="hidden lg:block absolute -right-6 -bottom-10 opacity-5 pointer-events-none text-slate-900">
          <AlertOctagon className="w-80 h-80" />
        </div>
      </div>

      {/* Main Heading: ARE YOU IN DANGER? */}
      <div>
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center justify-center sm:justify-start gap-3">
            <span className="w-3.5 h-8 bg-red-600 rounded-sm inline-block" />
            {t('areYouInDanger')}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Choose your preferred input method. One or all can be combined for immediate AI analysis.
          </p>
        </div>

        {/* 4 Large Primary Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Action 1: Check My Safety */}
          <div
            onClick={() => setActiveSection('check_safety')}
            className="group p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                📍 {t('checkMySafety')}
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {t('checkSafetySub')}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Start safety check</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 2: Show My Surroundings */}
          <div
            onClick={() => setActiveSection('check_safety')}
            className="group p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                📷 {t('showSurroundings')}
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {t('showSurroundingsSub')}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Upload or capture</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 3: Tell Us What Is Happening */}
          <div
            onClick={() => setActiveSection('check_safety')}
            className="group p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                🎙️ {t('tellUsHappening')}
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {t('tellUsSub')}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Speak or type description</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Action 4: Emergency Assistance */}
          <div
            onClick={() => setActiveSection('emergency_center')}
            className="group p-6 rounded-2xl bg-red-50 border-2 border-red-300 hover:border-red-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-red-950 group-hover:text-red-700 transition-colors">
                🆘 {t('emergency')}
              </h3>
              <p className="text-red-800 text-sm mt-2 leading-relaxed">
                {t('emergencySub')}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>Access Call 112 / SMS / SOS</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Flood Demo Walkthrough Highlight Card */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-black uppercase">
              <Waves className="w-4 h-4 text-blue-600" />
              <span>Hackathon Master Scenario</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Erode, Tamil Nadu — Flood Emergency Simulation
            </h3>
            <p className="text-slate-700 text-sm max-w-2xl leading-relaxed">
              Demonstrates the complete GA-08 workflow: Multimodal Citizen Input (Voice/Tamil) → AI Hazard Understanding (Flood/Critical) → Text-to-Pictogram → Multilingual Safety Card → Audio Guidance → SOS Alert → Disaster Management Response Center → Live Incident Map & AI Hotspots.
            </p>
          </div>

          <button
            onClick={runFloodDemo}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LAUNCH FLOOD DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Workflow Chain */}
        <div className="mt-6 pt-6 border-t border-blue-200/80 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">1. Input</span>
            <span className="text-xs font-black text-blue-900">Tamil Voice + Location</span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">2. AI Hazard</span>
            <span className="text-xs font-black text-red-600">Flood / Critical</span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">3. Visuals</span>
            <span className="text-xs font-black text-blue-900">Text → Pictogram</span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">4. Guidance</span>
            <span className="text-xs font-black text-blue-900">Audio + Do's/Don'ts</span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">5. Citizen SOS</span>
            <span className="text-xs font-black text-red-600">SG-001 Created</span>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">6. Command</span>
            <span className="text-xs font-black text-emerald-700">Response Center</span>
          </div>
        </div>
      </div>

      {/* 4 Architectural Pillars / Differentiators */}
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Core Technological Differentiators</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Text → Pictogram → Audio</h4>
            <p className="text-xs text-slate-600 mt-1">
              Transforms instructions into universal pictorial safety guides with synchronized local audio.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Disaster Command Center</h4>
            <p className="text-xs text-slate-600 mt-1">
              Real-time monitoring table, geographic cluster grouping, and AI response prioritization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Languages className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Multilingual Intelligence</h4>
            <p className="text-xs text-slate-600 mt-1">
              Preserves citizen's native voice/text while supplying responders with translated summaries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Community Clarity Loop</h4>
            <p className="text-xs text-slate-600 mt-1">
              Active community voting tests pictogram comprehension and auto-simplifies ambiguous graphics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
