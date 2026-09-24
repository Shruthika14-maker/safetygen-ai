import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, X, CheckCircle, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SystemHealthModal: React.FC = () => {
  const { systemHealth, showHealthModal, setShowHealthModal } = useApp();

  if (!showHealthModal) return null;

  const getStatusBadge = (status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'DEMO') => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'LIMITED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DEMO':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-2 border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                SYSTEM HEALTH & DIAGNOSTICS
              </h2>
              <p className="text-xs text-slate-500">
                Real-time capability audits and browser runtime telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHealthModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Matrix List */}
        <div className="mt-6 space-y-2.5">
          {systemHealth.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="font-bold text-slate-900 text-xs block">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {item.note}
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider self-start sm:self-auto border ${getStatusBadge(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-500 leading-relaxed">
          Honest availability principle: SafetyGen AI never fakes speech synthesis, phone calling, or GPS coordinate permissions.
        </div>
      </div>
    </div>
  );
};
