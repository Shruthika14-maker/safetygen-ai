import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, UI_STRINGS, ACCESSIBILITY_LABELS } from '../translations';
import { SectionId, LanguageCode, AccessibilityMode } from '../types';
import {
  ShieldAlert,
  Home,
  AlertTriangle,
  Sparkles,
  Eye,
  FileText,
  PhoneCall,
  LayoutDashboard,
  Table,
  MapPin,
  Printer,
  Users,
  BarChart3,
  Settings,
  Activity,
  Menu,
  X,
  Volume2,
  Waves,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    activeSection,
    setActiveSection,
    isOnline,
    runFloodDemo,
    setShowHealthModal,
    incidents,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  const navItems: { id: SectionId; label: string; icon: any; badge?: number; group: 'citizen' | 'responder' }[] = [
    { id: 'home', label: 'Home / Safety', icon: Home, group: 'citizen' },
    { id: 'check_safety', label: 'Check My Safety', icon: AlertTriangle, group: 'citizen' },
    { id: 'hazard_analysis', label: 'Hazard Analysis', icon: Sparkles, group: 'citizen' },
    { id: 'pictogram_studio', label: 'Pictogram Studio', icon: Eye, group: 'citizen' },
    { id: 'safety_card', label: 'Safety Card', icon: FileText, group: 'citizen' },
    { id: 'emergency_center', label: 'Emergency Center', icon: PhoneCall, group: 'citizen' },
    { id: 'response_center', label: 'Response Command', icon: LayoutDashboard, badge: incidents.filter(i => i.status === 'NEW').length, group: 'responder' },
    { id: 'live_incidents', label: 'Live Incidents', icon: Table, badge: incidents.length, group: 'responder' },
    { id: 'incident_map', label: 'Incident Map', icon: MapPin, group: 'responder' },
    { id: 'safety_pamphlet', label: 'Safety Pamphlet', icon: Printer, group: 'responder' },
    { id: 'clarity_lab', label: 'Community Clarity Lab', icon: Users, group: 'responder' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'responder' },
    { id: 'settings', label: 'Settings', icon: Settings, group: 'responder' },
  ];

  const handleNavClick = (id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner & Control Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-slate-900">SAFETYGEN AI</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold uppercase rounded-md bg-red-100 text-red-700">
                    Emergency Assist
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden md:block">
                  {t('tagline')}
                </p>
              </div>
            </div>

            {/* Right Controls: Demo, Lang, Accessibility, Status */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Try Flood Demo Button */}
              <button
                onClick={runFloodDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Execute End-to-End Flood Demonstration Workflow"
              >
                <Waves className="w-4 h-4 animate-pulse" />
                <span className="hidden xs:inline">{t('tryFloodDemo')}</span>
                <span className="xs:hidden">Demo</span>
              </button>

              {/* Online / Offline Status Badge */}
              <div
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative">
                <select
                  value={language}
                  aria-label="Language selection"
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Accessibility Mode Switcher */}
              <div className="hidden md:block">
                <select
                  value={accessibilityMode}
                  aria-label="Accessibility mode"
                  onChange={(e) => setAccessibilityMode(e.target.value as AccessibilityMode)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-2 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="standard">📖 Standard</option>
                  <option value="child">👦 Child Mode</option>
                  <option value="elderly">👴 Elderly Mode</option>
                  <option value="low_literacy">👁 Low Literacy</option>
                </select>
              </div>

              {/* System Health */}
              <button
                onClick={() => setShowHealthModal(true)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="System Health & Diagnostic Status"
              >
                <Activity className="w-5 h-5 text-emerald-600" />
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Accessibility Banner if special mode active */}
        {accessibilityMode !== 'standard' && (
          <div className="bg-amber-100 border-t border-b border-amber-200 px-4 py-1 text-center text-xs text-amber-900 font-semibold flex items-center justify-center gap-2">
            <span>⚡ Mode Active: {ACCESSIBILITY_LABELS[accessibilityMode]?.[language]?.title} — {ACCESSIBILITY_LABELS[accessibilityMode]?.[language]?.desc}</span>
            <button
              onClick={() => setAccessibilityMode('standard')}
              className="underline text-amber-950 font-bold ml-2 hover:text-black cursor-pointer"
            >
              Reset to Standard
            </button>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-72 max-w-full bg-white h-full overflow-y-auto p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="font-black text-slate-900 text-lg">SAFETYGEN AI</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Citizen Safety</p>
              <div className="space-y-1">
                {navItems
                  .filter((item) => item.group === 'citizen')
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-5 mb-2">Response Center</p>
              <div className="space-y-1">
                {navItems
                  .filter((item) => item.group === 'responder')
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                              isActive ? 'bg-white text-red-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
