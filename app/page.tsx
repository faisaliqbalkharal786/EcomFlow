'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCards } from '@/components/dashboard/StatCards';
import { AIVoiceAgentBanner } from '@/components/dashboard/AIVoiceAgentBanner';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { ChannelDistribution } from '@/components/dashboard/ChannelDistribution';
import { AICallLogsModal } from '@/components/dashboard/AICallLogsModal';
import { mockStatCards, mockOrders, mockAIVoiceMetrics } from '@/lib/mock-data';
import {
  Calendar,
  Sparkles,
  Download,
  Plus,
  Bot,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [callLogsModalOpen, setCallLogsModalOpen] = useState(false);

  const handleOpenCallLogs = () => {
    setCallLogsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* 1. Deep Slate / Navy Fixed Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeNav}
        onNavigate={(item) => {
          setActiveNav(item);
          if (item === 'AI Caller Logs') {
            handleOpenCallLogs();
          }
        }}
        onOpenCallLogs={handleOpenCallLogs}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Clean Sticky Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCallLogs={handleOpenCallLogs}
        />

        {/* Dashboard Scrollable Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Top Headline & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Operations & Fulfillment Dashboard
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Voice Protection Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Autonomous order triage, AI telephone verification, and multi-channel fulfillment orchestration.
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Today (Real-time)</span>
              </div>

              <button
                onClick={handleOpenCallLogs}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Caller Logs</span>
              </button>

              <button
                onClick={() => alert('Opening Workflow Automation Rule Wizard...')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs shadow-indigo-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Workflow</span>
              </button>
            </div>
          </div>

          {/* 3. Stat Cards (Responsive 4-Column Metric Grid) */}
          <section aria-labelledby="metrics-summary">
            <h2 id="metrics-summary" className="sr-only">
              Platform Metrics Summary
            </h2>
            <StatCards data={mockStatCards} />
          </section>

          {/* 4. NEW FEATURE: AI Order Confirmation Agent Section/Banner (Above Recent Orders) */}
          <section aria-labelledby="ai-voice-agent">
            <h2 id="ai-voice-agent" className="sr-only">
              AI Order Confirmation Agent
            </h2>
            <AIVoiceAgentBanner
              metrics={mockAIVoiceMetrics}
              onOpenCallLogs={handleOpenCallLogs}
            />
          </section>

          {/* 5. Sales Channel Distribution Strip */}
          <section aria-labelledby="channel-distribution">
            <h2 id="channel-distribution" className="sr-only">
              Sales Channel Allocation
            </h2>
            <ChannelDistribution />
          </section>

          {/* 6. Recent Orders Table (Gated by AI Verification) */}
          <section aria-labelledby="recent-orders">
            <h2 id="recent-orders" className="sr-only">
              Recent Multi-Channel Orders
            </h2>
            <RecentOrdersTable
              orders={mockOrders}
              onOpenCallLogs={handleOpenCallLogs}
            />
          </section>
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
          <p>© 2026 EcomFlow Inc. Enterprise AI Automation Engine. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <a href="#compliance" className="hover:text-slate-800 transition-colors">
              FCC Telephony Compliance
            </a>
            <a href="#accuracy" className="hover:text-slate-800 transition-colors">
              99.1% Voice Accuracy
            </a>
            <a href="#status" className="hover:text-slate-800 transition-colors">
              API Status: 99.99% Operational
            </a>
          </div>
        </footer>
      </div>

      {/* AI Voice Caller Logs Drawer/Modal */}
      <AICallLogsModal
        isOpen={callLogsModalOpen}
        onClose={() => setCallLogsModalOpen(false)}
      />
    </div>
  );
}
