'import client'
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import AICallLogsModal from '@/components/dashboard/AICallLogsModal';
import { 
  Plug, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Database
} from 'lucide-react';

export default function IntegrationsPage() {
  const [isCallLogsOpen, setIsCallLogsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Store & Tool Integrations</h1>
              <p className="text-sm text-slate-400 mt-1">Manage live connections with WooCommerce, Shopify, Retell AI, and Twilio.</p>
            </div>
            <button 
              onClick={() => setIsCallLogsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plug className="w-4 h-4" /> View AI Call Logs
            </button>
          </div>

          {/* Integration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WooCommerce Integration Card */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">WooCommerce / WordPress</h3>
                      <p className="text-xs text-slate-400">mareeza.store</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Real-time webhook synchronization enabled for order tracking, inventory updates, and automated Urdu AI verification call triggering.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <span>Webhook: <code className="text-indigo-400">/api/webhooks/woo</code></span>
                <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  Configure <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Retell AI / Voice Integration Card */}
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">Retell AI & Twilio Voice</h3>
                      <p className="text-xs text-slate-400">Urdu conversational agent</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Automated phone verification agent configured to call COD customers in native Urdu with natural accent and dynamic prompts.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
                <span>Voice Model: <code className="text-blue-400">Urdu-Female-Standard</code></span>
                <button className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                  Test Prompt <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* AI Call Logs Modal */}
      <AICallLogsModal 
        isOpen={isCallLogsOpen} 
        onClose={() => setIsCallLogsOpen(false)} 
      />
    </div>
  );
}
