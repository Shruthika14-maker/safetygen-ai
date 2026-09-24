import React from 'react';
import { useApp } from '../context/AppContext';
import { Incident } from '../types';
import {
  LayoutDashboard,
  AlertOctagon,
  ShieldAlert,
  Flame,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
  Eye,
  Radio,
  FileCheck,
} from 'lucide-react';

export const ResponseCenter: React.FC = () => {
  const {
    incidents,
    hotspots,
    setSelectedIncident,
    setActiveSection,
    updateIncidentStatus,
  } = useApp();

  // Dashboard Statistics
  const activeCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.severity === 'critical' && i.status !== 'RESOLVED').length;
  const highRiskCount = incidents.filter((i) => i.severity === 'high' && i.status !== 'RESOLVED').length;
  const sosCount = incidents.filter((i) => i.isSos && i.status !== 'RESOLVED').length;
  const resolvedToday = incidents.filter((i) => i.status === 'RESOLVED').length;

  // Priority Queue: sorted by priorityScore descending
  const priorityQueue = [...incidents]
    .filter((i) => i.status !== 'RESOLVED')
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, 5);

  const handleOpenIncident = (inc: Incident) => {
    setSelectedIncident(inc);
    setActiveSection('live_incidents');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-600" />
              <span>COMMAND & DISPATCH CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              SAFETYGEN RESPONSE CENTER
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              AI-assisted disaster monitoring and emergency response dashboard for emergency responders and incident controllers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection('incident_map')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Live Incident Map</span>
            </button>
            <button
              onClick={() => setActiveSection('live_incidents')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>All Incidents Table</span>
            </button>
          </div>
        </div>

        {/* 5 Large KPI Counters */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Active */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              ACTIVE INCIDENTS
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {activeCount}
            </span>
            <span className="text-[11px] font-bold text-slate-500 block mt-1">
              Live in queue
            </span>
          </div>

          {/* Critical */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-700 block mb-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              CRITICAL INCIDENTS
            </span>
            <span className="text-3xl sm:text-4xl font-black text-red-700">
              {criticalCount}
            </span>
            <span className="text-[11px] font-bold text-red-600 block mt-1">
              Immediate action
            </span>
          </div>

          {/* High Risk */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-800 block mb-1">
              HIGH RISK
            </span>
            <span className="text-3xl sm:text-4xl font-black text-orange-800">
              {highRiskCount}
            </span>
            <span className="text-[11px] font-bold text-orange-700 block mt-1">
              Monitoring escalation
            </span>
          </div>

          {/* SOS Requests */}
          <div className="p-4 rounded-2xl bg-red-100 border border-red-300">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-900 block mb-1 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
              SOS REQUESTS
            </span>
            <span className="text-3xl sm:text-4xl font-black text-red-950">
              {sosCount}
            </span>
            <span className="text-[11px] font-bold text-red-800 block mt-1">
              Trapped / Stranded
            </span>
          </div>

          {/* Resolved Today */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
              RESOLVED TODAY
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700">
              {resolvedToday}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 block mt-1">
              Cordoned / Safe
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Queue + Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-black text-slate-900">
                  Response Priority Queue
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI-assisted transparent scoring: Severity + SOS Flag + Accessibility Need + Transit Chokepoints.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-black rounded-md bg-slate-100 text-slate-700">
              AI-ASSISTED PROTOTYPE PRIORITIZATION
            </span>
          </div>

          <div className="space-y-3">
            {priorityQueue.map((inc) => (
              <div
                key={inc.id}
                onClick={() => handleOpenIncident(inc)}
                className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-red-500 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 px-2 py-0.5 bg-white border border-slate-300 rounded-md">
                      {inc.id}
                    </span>
                    <span
                      className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
                        inc.severity === 'critical'
                          ? 'bg-red-600 text-white'
                          : inc.severity === 'high'
                          ? 'bg-orange-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    {inc.isSos && (
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                        🆘 SOS ACTIVE
                      </span>
                    )}
                    {inc.accessibilityMode !== 'standard' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        {inc.accessibilityMode === 'elderly' && '👴 Elderly Citizen'}
                        {inc.accessibilityMode === 'child' && '👦 Child Presence'}
                        {inc.accessibilityMode === 'low_literacy' && '👁 Low Literacy'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {inc.locationName}
                  </h3>

                  {/* Multilingual Distinction: Translated Summary */}
                  <p className="text-xs text-slate-600 line-clamp-1">
                    <strong>Responder Summary:</strong> {inc.translatedSummary}
                  </p>

                  {/* Why this incident is prioritized */}
                  <div className="text-[11px] text-red-700 font-semibold flex items-center gap-1.5 pt-1">
                    <span>WHY PRIORITIZED:</span>
                    <span>{inc.priorityReasons?.[0] || 'High risk situation flagged'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">
                      {inc.priorityScore}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">
                      SCORE / 100
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk Hotspots (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-black text-slate-900">
                AI Risk Hotspots
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Geographic clustering of concurrent reports with anomaly detection.
            </p>

            <div className="space-y-3">
              {hotspots.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {cluster.name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                        cluster.riskLevel === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {cluster.riskLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                    <span>{cluster.reportCount} Correlated Reports</span>
                    <span className="flex items-center gap-1 text-emerald-700">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {cluster.trend.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Latest Activity: {cluster.lastActivity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-100 text-[11px] text-slate-500 leading-relaxed text-center font-medium">
            AI-ASSISTED DEMO ANALYSIS — Real spatial analytics require verified multi-sensor telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
