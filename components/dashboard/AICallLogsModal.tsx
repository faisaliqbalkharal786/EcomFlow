'use client';

import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  PhoneForwarded,
  Clock,
  Play,
  Volume2,
  MessageSquare,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import { mockAICallLogs } from '@/lib/mock-data';
import { AICallLog } from '@/types';
import { getAIVerificationBadge } from '@/lib/utils';

interface AICallLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICallLogsModal: React.FC<AICallLogsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCall, setSelectedCall] = useState<AICallLog>(mockAICallLogs[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0a0f1d] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Voice Confirmation Logs</h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Live Agent Stream
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect call transcripts, speech confidence, and automated fraud decisions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Split View (Call List on left, Transcript on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Left Column: Call Sessions List */}
          <div className="w-full md:w-80 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
            <div className="p-3 bg-slate-100/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recent Call Sessions (3)
            </div>

            {mockAICallLogs.map((call) => {
              const isSelected = selectedCall.id === call.id;
              const badge = getAIVerificationBadge(call.status);

              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white shadow-xs border-l-4 border-l-indigo-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{call.orderNumber}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.badgeClass}`}>
                      {call.status}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700">{call.customerName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{call.customerPhone}</p>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {call.timestamp}
                    </span>
                    <span className="font-semibold text-slate-600">Dur: {call.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Call Details & Transcript */}
          <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-4 bg-white">
            {/* Call Header Snapshot */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{selectedCall.customerName}</h4>
                  <span className="text-xs font-mono text-slate-500">({selectedCall.orderNumber})</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dialed Line: <span className="font-mono text-slate-800">{selectedCall.customerPhone}</span> • Channel: {selectedCall.channel}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">AI Confidence</span>
                  <span className={`text-sm font-bold ${selectedCall.confidence > 80 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedCall.confidence}% Score
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
              <Bot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900 block">Automated Call Finding:</span>
                <p className="text-indigo-800 leading-relaxed mt-0.5">{selectedCall.summary}</p>
              </div>
            </div>

            {/* Conversation Transcript */}
            <div className="space-y-3 flex-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Speech-to-Text Conversation Transcript
              </span>

              <div className="space-y-2.5 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                {selectedCall.transcript.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 mt-0.5 ${
                      line.speaker === 'AI' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {line.speaker}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-800 leading-relaxed">{line.text}</p>
                      <span className="text-[10px] text-slate-400">{line.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Waveform preview */}
            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <span className="font-medium text-slate-700">Audio Recording (Call #{selectedCall.id})</span>
              </div>
              <span className="font-mono text-slate-400">Duration: {selectedCall.duration}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500">
            AI Voice Confirmation runs on high-fidelity conversational telephony with zero agent latency.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
