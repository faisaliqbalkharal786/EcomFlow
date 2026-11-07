'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Sparkles,
  ShieldAlert,
  DollarSign,
  Headphones,
  Sliders,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Play,
  Activity,
  Bot,
} from 'lucide-react';
import { AIVoiceAgentMetrics } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface AIVoiceAgentBannerProps {
  metrics: AIVoiceAgentMetrics;
  onOpenCallLogs?: () => void;
  onSimulateCall?: () => void;
}

export const AIVoiceAgentBanner: React.FC<AIVoiceAgentBannerProps> = ({
  metrics: initialMetrics,
  onOpenCallLogs,
  onSimulateCall,
}) => {
  const [autoCallActive, setAutoCallActive] = useState(initialMetrics.autoCallEnabled);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const toggleAutoCall = () => {
    setAutoCallActive(!autoCallActive);
  };

  const handlePlayVoicePreview = () => {
    setIsPlayingDemo(true);
    setTimeout(() => setIsPlayingDemo(false), 2400);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1222] via-[#0f172a] to-[#171e38] border border-indigo-500/30 p-5 sm:p-6 text-white shadow-xl">
      {/* Background radial ambient glow effects */}
      <div className="absolute -right-12 -top-12 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 -bottom-16 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Content */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        
        {/* Left Side: Glowing Badge + Title + Description + Toggle Switch */}
        <div className="space-y-3.5 max-w-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Glowing AI Voice Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span className="tracking-wide">AI Order Confirmation Agent</span>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Urdu Telephony (اردو) • gpt-4o
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              Autonomous Voice Engine v2.4
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Automated Buyer Verification & Anti-Return Defense</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              Every inbound order from Shopify, Amazon, and WooCommerce is verified via conversational AI phone call strictly in Urdu within 60 seconds to confirm delivery address, buyer identity, and reduce RTO (Return to Origin).
            </p>
          </div>

          {/* Toggle Switch: Auto-Call New Orders */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700/80 shadow-inner">
              <span className="text-xs font-semibold text-slate-200">
                Auto-Call New Orders
              </span>

              {/* Animated Switch Button */}
              <button
                type="button"
                role="switch"
                aria-checked={autoCallActive}
                onClick={toggleAutoCall}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  autoCallActive ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    autoCallActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${
                  autoCallActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {autoCallActive ? 'Active' : 'Paused'}
              </span>
            </div>

            {/* Voice Preview Tester */}
            <button
              onClick={handlePlayVoicePreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors"
              title="Test sample AI confirmation audio prompt"
            >
              {isPlayingDemo ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span className="text-indigo-300 font-semibold">Playing Sample...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Test Voice Sample</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: 3 Mini AI Metrics Cards */}
        <div className="flex flex-col sm:flex-row xl:flex-col gap-3 shrink-0 sm:items-stretch xl:w-72">
          
          {/* Metric 1: Calls Made Today */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Calls Made Today</span>
                <span className="text-lg font-bold text-white tracking-tight">
                  {formatNumber(initialMetrics.callsMadeToday)}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              99.1% dialed
            </span>
          </div>

          {/* Metric 2: Fake Orders Detected */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-rose-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Fake Orders Detected</span>
                <span className="text-lg font-bold text-white tracking-tight">
                  {formatNumber(initialMetrics.fakeOrdersDetected)}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              100% blocked
            </span>
          </div>

          {/* Metric 3: Estimated Returns Saved */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-sm hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Estimated Returns Saved</span>
                <span className="text-lg font-bold text-emerald-300 tracking-tight">
                  {formatCurrency(initialMetrics.returnsSavedAmount)}
                </span>
              </div>
            </div>
            <button
              onClick={onOpenCallLogs}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              title="View full AI caller logs"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
