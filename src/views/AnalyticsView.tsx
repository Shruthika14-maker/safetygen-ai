import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldAlert,
  Users,
  AlertOctagon,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { incidents, pictograms } = useApp();

  // Aggregate by hazard
  const hazardCounts = incidents.reduce((acc, inc) => {
    acc[inc.hazard] = (acc[inc.hazard] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Aggregate by severity
  const severityCounts = {
    critical: incidents.filter((i) => i.severity === 'critical').length,
    high: incidents.filter((i) => i.severity === 'high').length,
    moderate: incidents.filter((i) => i.severity === 'moderate').length,
    low: incidents.filter((i) => i.severity === 'low').length,
  };

  // Aggregate by language
  const languageCounts = incidents.reduce((acc, inc) => {
    acc[inc.language] = (acc[inc.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Total clarity metrics
  const totalClarityVotes = pictograms.reduce((acc, p) => acc + p.clarityStats.total, 0);
  const totalUnderstood = pictograms.reduce((acc, p) => acc + p.clarityStats.understand, 0);
  const overallClarity = totalClarityVotes > 0 ? Math.round((totalUnderstood / totalClarityVotes) * 100) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                Disaster Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                DEMO / SAMPLE ANALYTICS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              <span>Operational Analytics & Telemetry</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Incident classification, response throughput, language distribution, and pictogram clarity metrics.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 px-3 py-1.5 rounded-lg bg-slate-100 self-start sm:self-auto">
            Live Stream Updated
          </span>
        </div>

        {/* 4 Summary Numbers */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black uppercase text-slate-400 block mb-1">Total Incidents</span>
            <span className="text-3xl font-black text-slate-900">{incidents.length}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Logged across regions</span>
          </div>

          <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
            <span className="text-[11px] font-black uppercase text-red-600 block mb-1">Critical SOS</span>
            <span className="text-3xl font-black text-red-700">
              {incidents.filter((i) => i.isSos).length}
            </span>
            <span className="text-[11px] text-red-600 block mt-1">Active distress triggers</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[11px] font-black uppercase text-emerald-700 block mb-1">Pictogram Clarity</span>
            <span className="text-3xl font-black text-emerald-800">{overallClarity}%</span>
            <span className="text-[11px] text-emerald-700 block mt-1">From {totalClarityVotes} user evaluations</span>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <span className="text-[11px] font-black uppercase text-blue-700 block mb-1">Supported Languages</span>
            <span className="text-3xl font-black text-blue-900">8</span>
            <span className="text-[11px] text-blue-700 block mt-1">Localized voice & text</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Incidents by Hazard */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <span>Incidents by Hazard Classification</span>
          </h2>
          <div className="space-y-3">
            {Object.entries(hazardCounts).map(([hazard, count]) => {
              const pct = Math.round((count / incidents.length) * 100);
              return (
                <div key={hazard}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="capitalize">{hazard.replace('_', ' ')}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-blue-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Incidents by Severity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Severity Distribution</span>
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-red-700 mb-1">
                <span>🔴 Critical Danger</span>
                <span>{severityCounts.critical}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${(severityCounts.critical / incidents.length) * 100}%` }}
                  className="h-full rounded-full bg-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-orange-700 mb-1">
                <span>🟠 High Risk</span>
                <span>{severityCounts.high}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${(severityCounts.high / incidents.length) * 100}%` }}
                  className="h-full rounded-full bg-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1">
                <span>🟡 Moderate Risk</span>
                <span>{severityCounts.moderate}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${(severityCounts.moderate / incidents.length) * 100}%` }}
                  className="h-full rounded-full bg-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 mb-1">
                <span>🟢 Low Risk</span>
                <span>{severityCounts.low}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${(severityCounts.low / incidents.length) * 100}%` }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Language Diversity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Incidents by Citizen Language</span>
          </h2>
          <div className="space-y-3">
            {Object.entries(languageCounts).map(([lang, count]) => {
              const pct = Math.round((count / incidents.length) * 100);
              return (
                <div key={lang}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="uppercase">{lang}</span>
                    <span>{count} reports ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full rounded-full bg-purple-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Hourly Activity Trend */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>24-Hour Incident Volume Curve</span>
          </h2>
          <div className="h-32 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-200">
            {[4, 7, 12, 18, 25, 38, 52, 44, 30, 22, 16, 9].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  style={{ height: `${val * 1.8}px` }}
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all cursor-pointer"
                  title={`${val} incidents at T-${12 - idx}h`}
                />
                <span className="text-[9px] font-bold text-slate-400">-{12 - idx}h</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Peak surge coincided with initial cloudburst and river overtopping intervals.
          </p>
        </div>
      </div>
    </div>
  );
};
