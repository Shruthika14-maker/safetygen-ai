import React from 'react';
import { useApp } from '../context/AppContext';
import { SectionId } from '../types';
import {
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
  Waves,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, incidents, runFloodDemo } = useApp();

  const newIncidentsCount = incidents.filter((i) => i.status === 'NEW').length;
  const criticalCount = incidents.filter((i) => i.severity === 'critical' && i.status !== 'RESOLVED').length;

  const citizenNav: { id: SectionId; label: string; icon: any }[] = [
    { id: 'home', label: '1. Home / Safety', icon: Home },
    { id: 'check_safety', label: '2. Check My Safety', icon: AlertTriangle },
    { id: 'hazard_analysis', label: '3. Hazard Analysis', icon: Sparkles },
    { id: 'pictogram_studio', label: '4. Pictogram Studio', icon: Eye },
    { id: 'safety_card', label: '5. Safety Card', icon: FileText },
    { id: 'emergency_center', label: '6. Emergency Center', icon: PhoneCall },
  ];

  const responderNav: { id: SectionId; label: string; icon: any; badge?: number }[] = [
    { id: 'response_center', label: '7. Response Command', icon: LayoutDashboard, badge: newIncidentsCount },
    { id: 'live_incidents', label: '8. Live Incidents', icon: Table, badge: incidents.length },
    { id: 'incident_map', label: '9. Incident Map', icon: MapPin },
    { id: 'safety_pamphlet', label: '10. Safety Pamphlet', icon: Printer },
    { id: 'clarity_lab', label: '11. Community Clarity Lab', icon: Users },
    { id: 'analytics', label: '12. Analytics', icon: BarChart3 },
    { id: 'settings', label: '13. Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        {/* Quick Flood Demo callout */}
        <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider">
            <Waves className="w-4 h-4 text-blue-600 animate-bounce" />
            <span>Interactive Demo</span>
          </div>
          <p className="text-xs text-blue-800 mb-2 leading-relaxed">
            Execute the complete end-to-end Erode flood safety workflow.
          </p>
          <button
            onClick={runFloodDemo}
            className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>TRY FLOOD DEMO</span>
            <span>→</span>
          </button>
        </div>

        {/* Section A: Citizen */}
        <div className="mb-6">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              A. Citizen Assistant
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <nav className="space-y-1">
            {citizenNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section B: Disaster Management Command */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-500">
              B. Response Center
            </span>
            {criticalCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-red-100 text-red-700 animate-pulse">
                {criticalCount} Critical
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {responderNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-red-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Safety Compliance Badge */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ISO 7010 Visual Standard</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          GA-08 Multimodal & Multilingual Prototype
        </p>
      </div>
    </aside>
  );
};
