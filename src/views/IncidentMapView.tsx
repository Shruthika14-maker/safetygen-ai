import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Incident, HazardType, RiskLevel } from '../types';
import {
  MapPin,
  Filter,
  Layers,
  Info,
  AlertOctagon,
  Eye,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export const IncidentMapView: React.FC = () => {
  const { incidents, setSelectedIncident, setActiveSection } = useApp();

  const [selectedHazard, setSelectedHazard] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [activePin, setActivePin] = useState<Incident | null>(null);

  // Map viewport boundary projection (covering India subcontinent coordinates ~ 8°N to 35°N, 68°E to 96°E)
  const mapBounds = {
    minLat: 8.0,
    maxLat: 34.0,
    minLng: 68.0,
    maxLng: 92.0,
  };

  const projectToMapPercent = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return {
      x: Math.min(95, Math.max(5, x)),
      y: Math.min(95, Math.max(5, y)),
    };
  };

  const incidentsWithCoords = incidents.filter((i) => i.coordinates);

  const filteredIncidents = incidentsWithCoords.filter((i) => {
    const hazardMatch = selectedHazard === 'ALL' || i.hazard === selectedHazard;
    const riskMatch = selectedRisk === 'ALL' || i.severity === selectedRisk;
    return hazardMatch && riskMatch;
  });

  const getPinColor = (sev: RiskLevel) => {
    switch (sev) {
      case 'critical':
        return '#dc2626'; // red
      case 'high':
        return '#ea580c'; // orange
      case 'moderate':
        return '#ca8a04'; // yellow
      default:
        return '#16a34a'; // green
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
              Spatial Telemetry
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
              DEMO MAP
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600" />
            <span>LIVE INCIDENT MAP</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial visualization of active hazards, cluster density, and emergency pins.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hazard Filter */}
          <select
            value={selectedHazard}
            aria-label="Hazard category filter"
            onChange={(e) => setSelectedHazard(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            <option value="ALL">All Hazards</option>
            <option value="flood">Flood</option>
            <option value="fire">Fire</option>
            <option value="earthquake">Earthquake</option>
            <option value="electrical">Electrical</option>
            <option value="debris">Debris / Landslide</option>
            <option value="blocked_road">Blocked Road</option>
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            aria-label="Risk level filter"
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Map Canvas Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Topographic GIS Grid Canvas */}
        <div className="w-full h-[520px] rounded-2xl bg-slate-900 relative overflow-hidden flex items-center justify-center border border-slate-800 select-none">
          {/* Map Vector Contours & Coastline Sim */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Stylized landmass silhouette contour (India regional outline demo) */}
            <path
              d="M 280 40 Q 320 120 400 160 Q 420 220 370 280 Q 380 360 340 440 L 300 480 Q 250 430 220 360 Q 180 300 210 240 Q 220 150 280 40 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Elevation topography curves */}
            <circle cx="340" cy="400" r="70" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            <circle cx="340" cy="400" r="120" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.15" />
          </svg>

          {/* Interactive Incident Pins */}
          {filteredIncidents.map((inc) => {
            const { x, y } = projectToMapPercent(inc.coordinates!.lat, inc.coordinates!.lng);
            const isSelected = activePin?.id === inc.id;
            const color = getPinColor(inc.severity);

            return (
              <div
                key={inc.id}
                onClick={() => setActivePin(inc)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                {/* Radial ping pulse for critical / SOS */}
                {inc.severity === 'critical' && (
                  <span
                    style={{ backgroundColor: color }}
                    className="absolute -inset-2 rounded-full animate-ping opacity-60"
                  />
                )}

                {/* Marker Pin */}
                <div
                  style={{ backgroundColor: color }}
                  className={`relative px-2.5 py-1 rounded-full text-white text-[11px] font-black flex items-center gap-1 shadow-lg transition-transform group-hover:scale-125 ${
                    isSelected ? 'ring-4 ring-white scale-125' : ''
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{inc.id}</span>
                </div>
              </div>
            );
          })}

          {/* Map Compass & Legend */}
          <div className="absolute top-4 left-4 p-3 bg-slate-900/90 backdrop-blur-xs border border-slate-700 rounded-xl text-white text-[11px] space-y-1">
            <div className="font-black text-slate-300">INCIDENT SEVERITY</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Critical Danger</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High Risk</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate Risk</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk</div>
          </div>

          <div className="absolute bottom-4 left-4 p-2 bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-lg text-slate-400 text-[10px]">
            DEMO MAP — Spatial Projection (8.0°N - 34.0°N, 68.0°E - 92.0°E)
          </div>

          {/* Active Pin Detail Popup */}
          {activePin && (
            <div className="absolute bottom-4 right-4 max-w-sm w-full bg-white rounded-2xl border-2 border-slate-900 p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono text-xs font-black text-slate-900">
                  {activePin.id}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    activePin.severity === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {activePin.severity}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-xs font-bold text-slate-900">
                  {activePin.locationName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {activePin.hazard.toUpperCase()} • {new Date(activePin.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-xs text-slate-700 italic pt-1">
                  “{activePin.originalReport}”
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedIncident(activePin);
                    setActiveSection('live_incidents');
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => setActivePin(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
