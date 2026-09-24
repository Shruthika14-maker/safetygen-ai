import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, ACCESSIBILITY_LABELS } from '../translations';
import { LanguageCode, AccessibilityMode } from '../types';
import {
  Settings,
  Languages,
  Eye,
  PhoneCall,
  Activity,
  RotateCcw,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    emergencyNumber,
    setEmergencyNumber,
    setShowHealthModal,
    setNotification,
  } = useApp();

  const [phoneInput, setPhoneInput] = useState(emergencyNumber);

  const handleSavePhone = () => {
    setEmergencyNumber(phoneInput);
    setNotification({
      title: 'Emergency Contact Saved',
      message: `Emergency number configured to ${phoneInput}`,
      type: 'success',
    });
  };

  const handleResetData = () => {
    if (confirm('Reset application to standard demo initial data?')) {
      localStorage.removeItem('safetygen_incidents_v2');
      localStorage.removeItem('safetygen_pictograms_v2');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-slate-700" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Configure language localization, accessibility presentation profiles, emergency dispatch numbers, and diagnostic health.
        </p>
      </div>

      {/* 1. Language Selection */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Languages className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-black text-slate-900">
            Language Localization (8 Regional Languages)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Changes entire UI, hazard terminology, audio synthesis dialect, and pamphlet printing.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                language === l.code
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="text-sm font-black text-slate-900 block">
                {l.nativeName}
              </span>
              <span className="text-xs text-slate-500 block">
                {l.name} ({l.bcp47})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Accessibility Modes */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-black text-slate-900">
            Accessibility Profiles
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          All eight languages are supported across all four accessibility operating modes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['standard', 'child', 'elderly', 'low_literacy'] as AccessibilityMode[]).map((mode) => {
            const info = ACCESSIBILITY_LABELS[mode]?.[language] || ACCESSIBILITY_LABELS[mode]?.en;
            const isSelected = accessibilityMode === mode;
            return (
              <div
                key={mode}
                onClick={() => setAccessibilityMode(mode)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-slate-900 text-sm">
                    {info.title}
                  </h3>
                  {isSelected && <CheckCircle className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {info.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Emergency Dispatch Configuration */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <PhoneCall className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-black text-slate-900">
            Emergency Dispatch Telephone Number
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          National Emergency Helpline (112 in India, 911 in US, etc.)
        </p>

        <div className="flex items-center gap-3 max-w-md">
          <input
            type="text"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
          <button
            onClick={handleSavePhone}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Save Number
          </button>
        </div>
      </div>

      {/* 4. Diagnostics & Health */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>Hardware & System Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect camera, geolocation, speech recognition, TTS, and offline cache availability.
          </p>
        </div>

        <button
          onClick={() => setShowHealthModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
        >
          Open Diagnostics Inspector
        </button>
      </div>

      {/* 5. Reset Store */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Restore initial mock incident data and clear localStorage cache.
        </span>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 border border-red-200 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Initial State</span>
        </button>
      </div>
    </div>
  );
};
