import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Incident, IncidentStatus, RiskLevel, HazardType } from '../types';
import { PictogramDisplay } from '../components/PictogramDisplay';
import {
  Table,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Languages,
  User,
  X,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

export const LiveIncidentsView: React.FC = () => {
  const {
    incidents,
    selectedIncident,
    setSelectedIncident,
    updateIncidentStatus,
    setNotification,
    language,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtering
  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.hazard.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: IncidentStatus) => {
    updateIncidentStatus(id, newStatus);
    setNotification({
      title: 'Incident Status Updated',
      message: `${id} changed to ${newStatus}`,
      type: 'success',
    });
  };

  const getSeverityBadge = (sev: RiskLevel) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 font-black animate-pulse';
      case 'ACKNOWLEDGED':
        return 'bg-purple-100 text-purple-800 font-bold';
      case 'RESPONDER_REVIEW':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 font-bold';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-950 flex items-center gap-2">
              <Table className="w-6 h-6 text-blue-600" />
              <span>Live Emergency Incident Records</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time monitoring queue of citizen SOS reports, sensor alerts, and verified multimodal records.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 px-3 py-1.5 rounded-lg bg-slate-100 self-start sm:self-auto">
            {filtered.length} Records Shown
          </span>
        </div>

        {/* Filter controls */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Incident ID, Location, Hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Severity filter */}
          <select
            value={severityFilter}
            aria-label="Severity filter"
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="low">🟢 Low</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            aria-label="Status filter"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="RESPONDER_REVIEW">RESPONDER_REVIEW</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Incident Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Hazard</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    selectedIncident?.id === inc.id ? 'bg-blue-50/60' : ''
                  }`}
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span>{inc.id}</span>
                      {inc.isSos && (
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" title="SOS Active" />
                      )}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Hazard */}
                  <td className="py-3.5 px-4 font-bold capitalize">
                    {inc.hazard.replace('_', ' ')}
                  </td>

                  {/* Severity */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 max-w-[200px] truncate" title={inc.locationName}>
                    {inc.locationName}
                  </td>

                  {/* Source */}
                  <td className="py-3.5 px-4 capitalize text-slate-600">
                    {inc.source}
                  </td>

                  {/* Language */}
                  <td className="py-3.5 px-4 uppercase font-bold text-slate-600">
                    {inc.language}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase ${getStatusBadge(inc.status)}`}>
                      {inc.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal / Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border-2 border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-black px-2.5 py-1 bg-slate-100 rounded-lg">
                  {selectedIncident.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase border ${getSeverityBadge(selectedIncident.severity)}`}>
                  {selectedIncident.severity}
                </span>
                {selectedIncident.isSos && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-black bg-red-600 text-white">
                    SOS ACTIVE
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-6 space-y-6">
              {/* Location & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Location</span>
                  <span className="font-bold text-slate-900">{selectedIncident.locationName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Timestamp</span>
                  <span className="font-bold text-slate-900">{new Date(selectedIncident.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Multilingual Incident Reports: Original vs Translated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Native User Report */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-amber-800">
                      Original Native Report ({selectedIncident.language.toUpperCase()})
                    </span>
                    <Languages className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xs font-semibold text-amber-950 italic">
                    “{selectedIncident.originalReport}”
                  </p>
                  {selectedIncident.accessibilityMode !== 'standard' && (
                    <span className="mt-2 inline-block px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-bold">
                      Requested Profile: {selectedIncident.accessibilityMode.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Translated Responder Summary */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-blue-800">
                      Translated Summary (Responder View)
                    </span>
                    <FileCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-bold text-blue-950">
                    {selectedIncident.translatedSummary}
                  </p>
                  <p className="text-[10px] text-blue-600 mt-2 font-medium">
                    Auto-translated without altering raw citizen voice/text evidence.
                  </p>
                </div>
              </div>

              {/* Recommended Response Protocol */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                  AI Recommended Response Actions
                </h4>
                <ul className="space-y-1.5">
                  {selectedIncident.analysis.immediateActions.map((act, i) => (
                    <li key={i} className="text-xs font-semibold text-slate-800 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responder Status Action Buttons */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                  Update Incident Operational Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'ACKNOWLEDGED')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedIncident.status === 'ACKNOWLEDGED'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    ACKNOWLEDGE
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'RESPONDER_REVIEW')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedIncident.status === 'RESPONDER_REVIEW'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    RESPONDER REVIEW
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedIncident.status === 'RESOLVED'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    MARK RESOLVED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
