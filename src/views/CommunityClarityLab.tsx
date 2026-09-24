import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PictogramDisplay } from '../components/PictogramDisplay';
import { speechManager } from '../services/speech';
import {
  Users,
  ThumbsUp,
  HelpCircle,
  ThumbsDown,
  RefreshCw,
  Volume2,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const CommunityClarityLab: React.FC = () => {
  const {
    language,
    pictograms,
    submitClarityRating,
    simplifyPictogramInState,
    setNotification,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVoted, setUserVoted] = useState<string | null>(null);
  const [testMode, setTestMode] = useState<'pictogram' | 'text_only' | 'pictogram_audio'>('pictogram');

  const currentPic = pictograms[currentIndex] || pictograms[0];

  const totalVotes = currentPic.clarityStats.total;
  const understandRate = totalVotes > 0 ? Math.round((currentPic.clarityStats.understand / totalVotes) * 100) : 0;
  const isLowClarity = understandRate < 80;

  const handleVote = (rating: 'understand' | 'notSure' | 'dontUnderstand') => {
    submitClarityRating(currentPic.id, rating);
    setUserVoted(rating);
    setNotification({
      title: 'Feedback Recorded',
      message: 'Your response feeds into the real-time pictogram simplification algorithm.',
      type: 'success',
    });
  };

  const handleSimplify = () => {
    simplifyPictogramInState(currentPic.id);
    setUserVoted(null);
    setNotification({
      title: 'Pictogram Enhanced',
      message: 'Visual complexity pruned. Stroke weights boosted for universal recognition.',
      type: 'info',
    });
  };

  const handlePlayVoice = () => {
    const caption = currentPic.caption[language as keyof typeof currentPic.caption] || currentPic.caption.en;
    speechManager.speak(caption, language);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black uppercase mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Iterative Visual Clarity Testing</span>
        </div>
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
          Community Clarity Lab
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
          Tests real-world visual comprehension of emergency pictograms with citizens across different literacy levels and languages. Ambiguous symbols automatically trigger simplification iterations.
        </p>
      </div>

      {/* Interactive Clarity Test Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-black uppercase text-slate-400">
              Pictogram #{currentIndex + 1} of {pictograms.length} • Category: {currentPic.category}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              “What do you think this pictogram means?”
            </h2>
          </div>

          {/* Test Modality Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setTestMode('pictogram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                testMode === 'pictogram' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pictogram
            </button>
            <button
              onClick={() => setTestMode('text_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                testMode === 'text_only' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Text Only
            </button>
            <button
              onClick={() => setTestMode('pictogram_audio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                testMode === 'pictogram_audio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Pictogram + Audio
            </button>
          </div>
        </div>

        {/* Display Area based on mode */}
        <div className="py-8 flex flex-col items-center justify-center">
          {testMode === 'pictogram' && (
            <div className="flex flex-col items-center">
              <PictogramDisplay
                item={currentPic}
                size="xl"
                showCaption={false}
              />
              <p className="text-xs text-slate-500 mt-3 italic">
                (Visual shown without text captions to evaluate pure pictorial literacy)
              </p>
            </div>
          )}

          {testMode === 'text_only' && (
            <div className="max-w-md p-8 rounded-2xl bg-slate-50 border-2 border-slate-300 text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">Text Instruction</span>
              <p className="text-lg font-black text-slate-900">
                {currentPic.title[language as keyof typeof currentPic.title] || currentPic.title.en}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                {currentPic.caption[language as keyof typeof currentPic.caption] || currentPic.caption.en}
              </p>
            </div>
          )}

          {testMode === 'pictogram_audio' && (
            <div className="flex flex-col items-center space-y-4">
              <PictogramDisplay
                item={currentPic}
                size="xl"
                showCaption={false}
              />
              <button
                onClick={handlePlayVoice}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Local Audio Narration</span>
              </button>
            </div>
          )}

          {/* Voting Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleVote('understand')}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all cursor-pointer ${
                userVoted === 'understand'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>👍 I UNDERSTAND</span>
            </button>

            <button
              onClick={() => handleVote('notSure')}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all cursor-pointer ${
                userVoted === 'notSure'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>🤔 NOT SURE</span>
            </button>

            <button
              onClick={() => handleVote('dontUnderstand')}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all cursor-pointer ${
                userVoted === 'dontUnderstand'
                  ? 'bg-red-600 text-white border-red-600 shadow-md'
                  : 'bg-red-50 hover:bg-red-100 text-red-900 border-red-200'
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-red-600" />
              <span>👎 I DON'T UNDERSTAND</span>
            </button>
          </div>
        </div>

        {/* Live Community Clarity Score & Auto-Simplification Trigger */}
        <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-lg text-slate-900">
              {understandRate}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Community Clarity Score</span>
                <span className="text-xs text-slate-400">({totalVotes} votes)</span>
              </div>
              <p className="text-xs text-slate-500">
                {currentPic.clarityStats.understand} understood • {currentPic.clarityStats.notSure} unsure • {currentPic.clarityStats.dontUnderstand} confused
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLowClarity && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>LOW CLARITY DETECTED</span>
              </div>
            )}

            <button
              onClick={handleSimplify}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>🔄 MAKE PICTOGRAM SIMPLER</span>
            </button>

            {/* Next Pictogram */}
            <button
              onClick={() => {
                setCurrentIndex((prev) => (prev + 1) % pictograms.length);
                setUserVoted(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Next Pictogram →
            </button>
          </div>
        </div>
      </div>

      {/* Safety Communication Improvement Loop Visualizer (Section 28) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase">
            Continuous AI Feedback Architecture
          </span>
          <h2 className="text-2xl font-black text-slate-950 mt-2">
            Safety Communication Improvement Loop
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How SafetyGen AI continuously improves visual communication clarity based on community responses.
          </p>
        </div>

        {/* 8-Step Visual Process Loop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 1</span>
            <span className="text-xs font-black text-slate-900">EMERGENCY REPORT</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 2</span>
            <span className="text-xs font-black text-slate-900">AI UNDERSTANDING</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 3</span>
            <span className="text-xs font-black text-slate-900">SAFETY INSTRUCTION</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 4</span>
            <span className="text-xs font-black text-blue-600">PICTOGRAM</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 5</span>
            <span className="text-xs font-black text-purple-600">COMMUNITY TEST</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 6</span>
            <span className="text-xs font-black text-amber-600">CLARITY RESULT</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1">STEP 7</span>
            <span className="text-xs font-black text-blue-600">SIMPLIFY</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300">
            <span className="text-[10px] font-black text-emerald-700 block mb-1">STEP 8</span>
            <span className="text-xs font-black text-emerald-900">IMPROVED PICTOGRAM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
