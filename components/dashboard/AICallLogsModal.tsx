'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Search, 
  Filter, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PhoneOff, 
  FileText 
} from 'lucide-react';

export interface AICallLog {
  id: string;
  customerName: string;
  phoneNumber: string;
  orderId: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING' | 'NO_ANSWER';
  duration: string;
  transcript: string;
  createdAt: string;
}

const mockAICallLogs: AICallLog[] = [
  {
    id: 'log-1',
    customerName: 'Ayesha Khan',
    phoneNumber: '+92 300 1234567',
    orderId: 'ORD-1001',
    status: 'COMPLETED',
    duration: '45s',
    transcript: 'AI Agent: Assalam-o-Alaikum! Main EcomFlow se bol rahi hoon, aapne jo order place kiya hai uski confirmation ke liye call ki thi.\nCustomer: Ji bilkul, order confirm hai.\nAI Agent: Shukriya, aapka order dispatch kar diya jayega.',
    createdAt: '2 mins ago'
  },
  {
    id: 'log-2',
    customerName: 'Muhammad Ali',
    phoneNumber: '+92 321 9876543',
    orderId: 'ORD-1002',
    status: 'NO_ANSWER',
    duration: '15s',
    transcript: 'Call attempted. Customer did not pick up the phone. Automated follow-up WhatsApp message sent.',
    createdAt: '15 mins ago'
  }
];

interface AICallLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AICallLogsModal({ isOpen, onClose }: AICallLogsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AICallLog | null>(null);

  if (!isOpen) return null;

  const filteredLogs = mockAICallLogs.filter((log) => {
    const matchesSearch = 
      log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phoneNumber.includes(searchTerm) ||
      log.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AICallLog['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'NO_ANSWER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <PhoneOff className="w-3.5 h-3.5" /> No Answer
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Voice Call Logs</h2>
              <p className="text-xs text-slate-500">Monitor automated Urdu AI verification calls</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone, order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            {['ALL', 'COMPLETED', 'FAILED', 'PENDING', 'NO_ANSWER'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap }
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Logs List */}
            <div className={lg:col-span-2 space-y-3 }>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-100 p-8">
                  <PhoneOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No call logs found</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={p-4 rounded-xl border transition-all cursor-pointer bg-white }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{log.customerName}</span>
                        <span className="text-xs text-slate-400 font-mono">({log.phoneNumber})</span>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" /> Order: {log.orderId}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {log.duration}
                        </span>
                        <span>{log.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Transcript Panel */}
            <div className={lg:col-span-1 bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col }>
              {selectedLog ? (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" /> Call Transcript
                    </h3>
                    <button 
                      onClick={() => setSelectedLog(null)}
                      className="lg:hidden text-xs text-indigo-600 font-medium hover:underline"
                    >
                      Back
                    </button>
                  </div>

                  <div className="py-3 space-y-2 text-xs border-b border-slate-100 bg-slate-50/50 p-3 rounded-lg my-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer:</span>
                      <span className="font-medium text-slate-800">{selectedLog.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-medium text-slate-800 font-mono">{selectedLog.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Order ID:</span>
                      <span className="font-medium text-indigo-600">{selectedLog.orderId}</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
                    <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedLog.transcript}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
                  <Phone className="w-10 h-10 text-slate-200 mb-3" />
                  <p className="text-sm font-medium text-slate-600">Select a call log</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredLogs.length} call logs</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
