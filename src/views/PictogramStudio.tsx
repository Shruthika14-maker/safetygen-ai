import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PictogramDisplay } from '../components/PictogramDisplay';
import { generatePictogramFromText, TextToPictogramPipelineResult } from '../services/pictogramGenerator';
import { BASE_PICTOGRAMS } from '../data/pictogramLibrary';
import { PictogramItem } from '../types';
import {
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  RefreshCw,
  Sliders,
  Filter,
  Layers,
  Wand2,
} from 'lucide-react';

export const PictogramStudio: React.FC = () => {
  const { language, pictograms, simplifyPictogramInState, setNotification } = useApp();

  const [customText, setCustomText] = useState('Do not enter moving flood water.');
  const [pipelineResult, setPipelineResult] = useState<TextToPictogramPipelineResult | null>(() => {
    return generatePictogramFromText('Do not enter moving flood water.', 'flood');
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories
  const categories = ['All', 'Flood', 'Fire', 'Earthquake', 'Electrical', 'Building', 'Emergency'];

  const filteredPictograms =
    activeCategory === 'All'
      ? pictograms
      : pictograms.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const handleGenerate = () => {
    if (!customText.trim()) return;
    const res = generatePictogramFromText(customText);
    setPipelineResult(res);
    setNotification({
      title: 'Pictogram Synthesized',
      message: 'Visual rules applied and ISO 7010 validation executed.',
      type: 'success',
    });
  };

  const handleSimplifyCurrent = () => {
    if (pipelineResult) {
      simplifyPictogramInState(pipelineResult.generatedPictogram.id);
      // Also update local pipeline generated item
      const updated = { ...pipelineResult.generatedPictogram };
      updated.simplifiedLevel = (updated.simplifiedLevel || 1) + 1;
      updated.validation.status = 'SIMPLIFIED';
      updated.validation.score = Math.min(100, updated.validation.score + 3);
      setPipelineResult({ ...pipelineResult, generatedPictogram: updated });

      setNotification({
        title: 'Pictogram Simplified',
        message: 'Reduced visual density by 30% and elevated primary stroke weight for low-literacy clarity.',
        type: 'info',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Eye className="w-3.5 h-3.5" />
          <span>Core GA-08 Innovation</span>
        </div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
          Pictogram Studio & Text-to-Visual Engine
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
          Transforms complex natural language emergency text into standardized, high-contrast pictorial safety instructions designed for mixed-literacy and multi-lingual comprehension.
        </p>
      </div>

      {/* Generator Pipeline Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-blue-600" />
          <span>Text-to-Pictogram Pipeline</span>
        </h2>

        {/* Text Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type any safety instruction, e.g., 'Do not enter moving flood water.'"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>GENERATE & VALIDATE</span>
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="self-center">Try presets:</span>
          <button
            onClick={() => {
              setCustomText('Do not enter moving flood water.');
              const r = generatePictogramFromText('Do not enter moving flood water.', 'flood');
              setPipelineResult(r);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
          >
            🌊 Flood Water
          </button>
          <button
            onClick={() => {
              setCustomText('Move to high ground immediately.');
              const r = generatePictogramFromText('Move to high ground immediately.', 'flood');
              setPipelineResult(r);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
          >
            🏃 High Ground
          </button>
          <button
            onClick={() => {
              setCustomText('Stay away from fallen high voltage electric wires.');
              const r = generatePictogramFromText('Stay away from fallen high voltage electric wires.', 'electrical');
              setPipelineResult(r);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
          >
            ⚡ Live Wires
          </button>
          <button
            onClick={() => {
              setCustomText('Crawl low under smoke to exit burning building.');
              const r = generatePictogramFromText('Crawl low under smoke to exit burning building.', 'fire');
              setPipelineResult(r);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
          >
            🔥 Smoke Evacuation
          </button>
        </div>

        {/* Pipeline Architecture Visualizer */}
        {pipelineResult && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            {/* Steps pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center mb-6">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Step 1</span>
                <span className="text-xs font-bold text-slate-900">Text Input</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Step 2</span>
                <span className="text-xs font-bold text-slate-900">Action Extraction</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Step 3</span>
                <span className="text-xs font-bold text-slate-900">Visual Symbol Map</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Step 4</span>
                <span className="text-xs font-bold text-slate-900">Pictogram Render</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-black uppercase text-emerald-700 block">Step 5</span>
                <span className="text-xs font-black text-emerald-900">Validation Passed</span>
              </div>
            </div>

            {/* Visual Output + Validation Audit Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
              {/* Generated Result */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase text-slate-400 mb-2">
                  Generated Pictogram
                </span>
                <PictogramDisplay
                  item={pipelineResult.generatedPictogram}
                  size="xl"
                  languageCode={language}
                />

                <button
                  onClick={handleSimplifyCurrent}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>🔄 MAKE PICTOGRAM SIMPLER</span>
                </button>
              </div>

              {/* Validation Checklist */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">
                      ISO 7010 Rule-Based Validation
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                    {pipelineResult.generatedPictogram.validation.score}% Clarity Score
                  </span>
                </div>

                <div className="space-y-2">
                  {pipelineResult.validationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{step.title}</p>
                        <p className="text-[11px] text-slate-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-medium">
                  <strong>DEMO / PROTOTYPE VALIDATION:</strong> Evaluates graphic minimalism, high-contrast silhouette separation, and absence of linguistic text overlays inside the symbol core.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pictogram Library Browser */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-700" />
              <span>Safety Pictogram Library</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Validated universal symbols available across 8 regional languages.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pictograms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPictograms.map((item) => (
            <div key={item.id} className="relative group">
              <PictogramDisplay
                item={item}
                size="lg"
                languageCode={language}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
