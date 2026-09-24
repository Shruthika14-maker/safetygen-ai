import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS, RISK_LABELS, HAZARD_NAMES } from '../translations';
import {
  AlertOctagon,
  X,
  MapPin,
  Clock,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const SosModal: React.FC = () => {
  const {
    language,
    accessibilityMode,
    activeAnalysis,
    createIncidentFromAnalysis,
    sosModalOpen,
    setSosModalOpen,
    setActiveSection,
    setSelectedIncident,
    setNotification,
  } = useApp();

  const [isCreated, setIsCreated] = useState(false);
  const [createdIncidentId, setCreatedIncidentId] = useState<string | null>(null);

  if (!sosModalOpen) return null;

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  const analysis = activeAnalysis || {
    hazard: 'flood' as const,
    hazardName: 'வெள்ளம் / Flood Hazard',
    riskLevel: 'critical' as const,
    explanation: 'Rapid flood water inundation detected. High velocity flow.',
    immediateActions: [
      'Climb to higher ground or upper floor immediately.',
      'Do not enter flowing water.',
    ],
    dos: ['Move to roof or upper floor'],
    donts: ['Do not wade in flood water'],
    evidence: ['USER REPORTED: Emergency flood situation in sector.'],
    pictograms: [],
    priorityScore: 97,
    priorityReasons: ['Critical flood emergency SOS broadcast'],
    detectedAt: Date.now(),
    locationName: 'Erode, Tamil Nadu',
    sourceType: 'multimodal' as const,
  };

  const handleConfirmSos = () => {
    const newInc = createIncidentFromAnalysis(analysis, true);
    setCreatedIncidentId(newInc.id);
    setIsCreated(true);

    setNotification({
      title: 'SOS ALERT CREATED',
      message: `Incident ${newInc.id} logged in Response Center. Status: NEW.`,
      type: 'success',
    });
  };

  const handleClose = () => {
    setIsCreated(false);
    setCreatedIncidentId(null);
    setSosModalOpen(false);
  };

  const handleGoToResponse = () => {
    handleClose();
    setActiveSection('response_center');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-red-600 animate-in fade-in zoom-in-95">
        {!isCreated ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                  <AlertOctagon className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Confirm Emergency SOS Broadcast
                  </h2>
                  <p className="text-xs text-red-600 font-bold">
                    Review your incident telemetry before dispatch
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Preview Payload */}
            <div className="mt-5 space-y-3">
              <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-red-950 uppercase">
                    {analysis.hazardName || HAZARD_NAMES[analysis.hazard]?.[language]}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-red-600 text-white">
                    {RISK_LABELS[analysis.riskLevel]?.[language] || analysis.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-red-900 font-medium">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{analysis.locationName}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Time: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Context info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div><strong>Language:</strong> {language.toUpperCase()}</div>
                <div><strong>Accessibility Mode:</strong> {accessibilityMode.toUpperCase()}</div>
                <div><strong>Recommended Action:</strong> {analysis.immediateActions[0] || 'Move to higher ground'}</div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                “After confirmation, an incident record is immediately filed in the SafetyGen Response Center with status NEW.”
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmSos}
                className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase shadow-md transition-colors cursor-pointer"
              >
                SEND SOS ALERT
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              SOS ALERT CREATED
            </h3>

            <p className="text-xs font-mono font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg inline-block">
              Incident ID: {createdIncidentId}
            </p>

            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your emergency record has been dispatched to the SafetyGen Response Center with status <strong>NEW</strong>. Responders have been notified of your location.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200">
              Note: Prototype demonstration. Follow official disaster management instructions and local authorities during real emergencies.
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleGoToResponse}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View in Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
