import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './views/HomePage';
import { CheckMySafety } from './views/CheckMySafety';
import { HazardAnalysisView } from './views/HazardAnalysisView';
import { PictogramStudio } from './views/PictogramStudio';
import { SafetyCardView } from './views/SafetyCardView';
import { EmergencyCenter } from './views/EmergencyCenter';
import { ResponseCenter } from './views/ResponseCenter';
import { LiveIncidentsView } from './views/LiveIncidentsView';
import { IncidentMapView } from './views/IncidentMapView';
import { SafetyPamphletView } from './views/SafetyPamphletView';
import { CommunityClarityLab } from './views/CommunityClarityLab';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { SosModal } from './components/SosModal';
import { SystemHealthModal } from './components/SystemHealthModal';
import { NotificationToast } from './components/NotificationToast';
import { PhoneCall, AlertOctagon, Waves } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeSection, setActiveSection, setSosModalOpen, runFloodDemo } = useApp();

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'check_safety':
        return <CheckMySafety />;
      case 'hazard_analysis':
        return <HazardAnalysisView />;
      case 'pictogram_studio':
        return <PictogramStudio />;
      case 'safety_card':
        return <SafetyCardView />;
      case 'emergency_center':
        return <EmergencyCenter />;
      case 'response_center':
        return <ResponseCenter />;
      case 'live_incidents':
        return <LiveIncidentsView />;
      case 'incident_map':
        return <IncidentMapView />;
      case 'safety_pamphlet':
        return <SafetyPamphletView />;
      case 'clarity_lab':
        return <CommunityClarityLab />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-red-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Navigation />

      {/* Body Area with Sidebar and Main View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {renderSection()}
        </main>
      </div>

      {/* Floating Bottom Quick Action on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={runFloodDemo}
          className="flex flex-col items-center gap-1 text-blue-600 font-bold text-[11px]"
        >
          <Waves className="w-5 h-5 animate-pulse" />
          <span>Flood Demo</span>
        </button>
        <button
          onClick={() => setActiveSection('check_safety')}
          className="flex flex-col items-center gap-1 text-slate-700 font-bold text-[11px]"
        >
          <AlertOctagon className="w-5 h-5 text-amber-500" />
          <span>Check Safety</span>
        </button>
        <button
          onClick={() => setSosModalOpen(true)}
          className="flex flex-col items-center gap-1 text-red-600 font-bold text-[11px]"
        >
          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
            <span className="text-[10px] font-black">SOS</span>
          </div>
          <span>Distress</span>
        </button>
        <button
          onClick={() => setActiveSection('response_center')}
          className="flex flex-col items-center gap-1 text-slate-700 font-bold text-[11px]"
        >
          <div className="w-5 h-5 flex items-center justify-center font-black">
            📊
          </div>
          <span>Command</span>
        </button>
      </div>

      {/* Global Modals & Notifications */}
      <SosModal />
      <SystemHealthModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
