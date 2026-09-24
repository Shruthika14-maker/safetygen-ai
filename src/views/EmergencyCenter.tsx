import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UI_STRINGS } from '../translations';
import {
  PhoneCall,
  MessageSquare,
  AlertOctagon,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Smartphone,
} from 'lucide-react';

export const EmergencyCenter: React.FC = () => {
  const {
    language,
    emergencyNumber,
    activeAnalysis,
    setSosModalOpen,
  } = useApp();

  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [showCallConfirm, setShowCallConfirm] = useState(false);

  const t = (key: string) => UI_STRINGS[key]?.[language] || UI_STRINGS[key]?.en || key;

  const handleCallClick = () => {
    setShowCallConfirm(true);
  };

  const executeCall = () => {
    setShowCallConfirm(false);
    setCallStatus('Your phone app will open. Confirm the call on your device.');
    try {
      window.location.href = `tel:${emergencyNumber}`;
    } catch (e) {
      setCallStatus('Calling is not supported on this device. Please dial ' + emergencyNumber + ' manually.');
    }
  };

  const handlePrepareSms = () => {
    const loc = activeAnalysis?.locationName || 'Location Not Specified';
    const coords = activeAnalysis?.coordinates
      ? `${activeAnalysis.coordinates.lat.toFixed(4)}, ${activeAnalysis.coordinates.lng.toFixed(4)}`
      : 'No GPS';
    const hazard = activeAnalysis?.hazard.toUpperCase() || 'GENERAL EMERGENCY';
    const severity = activeAnalysis?.riskLevel.toUpperCase() || 'CRITICAL';
    const time = new Date().toLocaleTimeString();

    const smsBody = encodeURIComponent(
      `[SAFETYGEN SOS] ${hazard} (${severity}) at ${loc} (GPS: ${coords}). Urgent assistance required. Time: ${time}.`
    );

    setSmsStatus('SMS MESSAGE PREPARED — Opening device messaging app. Verify recipient before sending.');
    try {
      window.location.href = `sms:${emergencyNumber}?body=${smsBody}`;
    } catch (e) {
      setSmsStatus('SMS is not supported on this device/browser. Please send message manually.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase mb-2">
          <AlertOctagon className="w-4 h-4" />
          <span>Priority Emergency Assistance</span>
        </div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
          Emergency Command & Dispatch Hub
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Direct device-integrated emergency assistance with transparent status reporting and device limitation awareness.
        </p>
      </div>

      {/* 3 Primary Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. SOS Broadcast */}
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-red-950">1. SEND SOS ALERT</h3>
            <p className="text-xs text-red-800 mt-2 leading-relaxed font-medium">
              Broadcasts incident record with your coordinates, photos, and hazard assessment directly to the SafetyGen Response Center.
            </p>
          </div>

          <button
            onClick={() => setSosModalOpen(true)}
            className="mt-6 w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase shadow-md transition-colors cursor-pointer"
          >
            {t('sendSos')}
          </button>
        </div>

        {/* 2. Call Emergency */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              2. CALL EMERGENCY ({emergencyNumber})
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Opens your device's native dialer pre-filled with the national emergency number ({emergencyNumber}).
            </p>
          </div>

          <button
            onClick={handleCallClick}
            className="mt-6 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase shadow-xs transition-colors cursor-pointer"
          >
            {t('callEmergency')}
          </button>
        </div>

        {/* 3. Emergency SMS */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              3. PREPARE EMERGENCY SMS
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Formats a structured distress SMS containing your GPS coordinates, hazard category, and timestamp.
            </p>
          </div>

          <button
            onClick={handlePrepareSms}
            className="mt-6 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase shadow-xs transition-colors cursor-pointer"
          >
            {t('prepareSms')}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {callStatus && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{callStatus}</span>
        </div>
      )}

      {smsStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{smsStatus}</span>
        </div>
      )}

      {/* Call Confirmation Dialog */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-slate-200 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <PhoneCall className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Open Phone Dialer for {emergencyNumber}?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              “Your phone app will open. Confirm the call on your device.”
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              SafetyGen AI never automatically dials without explicit device confirmation.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowCallConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={executeCall}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                CONTINUE TO CALL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transparency & Device Limitations Notice */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-500" />
          <span>Transparency & Device Protocol Standards</span>
        </h4>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>Phone calls open the native operating system dialer (<code>tel:</code> protocol). We never falsely display "Call Completed".</li>
          <li>SMS preparation creates a pre-populated emergency payload. We never claim "SMS Sent" when only the messenger is launched.</li>
          <li>SOS alerts create an immutable record in the SafetyGen Response Center. We do not claim official government dispatch integration unless confirmed by local authorities.</li>
        </ul>
      </div>
    </div>
  );
};
