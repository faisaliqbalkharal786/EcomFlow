'use client';

import React from 'react';
import {
  Zap,
  CheckCircle2,
  Sliders,
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
} from 'lucide-react';

export const AutomationBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-5 sm:p-6 text-white shadow-md">
      {/* Background ambient decorative glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Automation headline & stats */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Smart Fulfillment Rules Active</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">• 12 rules executing</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Autonomous Order Routing & Auto-Labeling
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">88.4%</span> of inbound orders this week were
            automatically validated, routed to optimal 3PL centers, and tagged with lowest-rate postage.
          </p>
        </div>

        {/* Center/Right: Quick Metrics Chips */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-2.5 rounded-xl min-w-[130px]">
            <span className="text-[11px] font-medium text-slate-300 block">Avg. Fulfillment Time</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-white">4.2 min</span>
              <span className="text-[10px] text-emerald-400 font-semibold">-42%</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-2.5 rounded-xl min-w-[130px]">
            <span className="text-[11px] font-medium text-slate-300 block">Time Saved Today</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-white">3.8 hrs</span>
              <span className="text-[10px] text-emerald-400 font-semibold">142 orders</span>
            </div>
          </div>

          <button
            onClick={() => alert('Opening EcomFlow Rule Builder...')}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all shrink-0 hover:translate-x-0.5"
          >
            <span>Manage Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
