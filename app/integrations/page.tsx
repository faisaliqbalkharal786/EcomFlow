'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AICallLogsModal } from '@/components/dashboard/AICallLogsModal';
import {
  Plug,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
  Globe,
  Key,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Layers,
  Settings,
  ShoppingBag,
  Store,
  ChevronRight,
} from 'lucide-react';

interface StoreConnection {
  id: string;
  platform: 'Shopify' | 'WooCommerce';
  storeUrl: string;
  isActive: boolean;
  lastSyncAt: string | null;
  hasAccessToken?: boolean;
  hasConsumerKey?: boolean;
  hasConsumerSecret?: boolean;
  maskedAccessToken?: string | null;
  maskedConsumerKey?: string | null;
  maskedConsumerSecret?: string | null;
}

export default function IntegrationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [callLogsModalOpen, setCallLogsModalOpen] = useState(false);
  const [connections, setConnections] = useState<StoreConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [modalPlatform, setModalPlatform] = useState<'Shopify' | 'WooCommerce' | null>(null);
  const [formStoreUrl, setFormStoreUrl] = useState('');
  const [formAccessToken, setFormAccessToken] = useState('');
  const [formConsumerKey, setFormConsumerKey] = useState('');
  const [formConsumerSecret, setFormConsumerSecret] = useState('');
  const [formWebhookSecret, setFormWebhookSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch connections on load
  const loadConnections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations');
      const data = await res.json();
      if (data.success && Array.isArray(data.connections)) {
        setConnections(data.connections);
      }
    } catch (err) {
      console.error('Failed to load store connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const showAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Open modal for connecting a platform
  const openConnectModal = (platform: 'Shopify' | 'WooCommerce') => {
    setModalPlatform(platform);
    const existing = connections.find((c) => c.platform === platform);
    if (existing) {
      setFormStoreUrl(existing.storeUrl);
      setFormAccessToken('');
      setFormConsumerKey('');
      setFormConsumerSecret('');
    } else {
      if (platform === 'Shopify') {
        setFormStoreUrl('apex-global.myshopify.com');
        setFormAccessToken('shpat_live_ecomflow_demo_9821');
      } else {
        setFormStoreUrl('https://woo.apexbrands.com');
        setFormConsumerKey('ck_live_demo_consumer_key_4491');
        setFormConsumerSecret('cs_live_demo_consumer_secret_8812');
      }
    }
  };

  const closeModal = () => {
    setModalPlatform(null);
    setFormStoreUrl('');
    setFormAccessToken('');
    setFormConsumerKey('');
    setFormConsumerSecret('');
    setFormWebhookSecret('');
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPlatform) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        platform: modalPlatform,
        storeUrl: formStoreUrl,
        webhookSecret: formWebhookSecret || undefined,
      };

      if (modalPlatform === 'Shopify') {
        payload.accessToken = formAccessToken;
      } else {
        payload.consumerKey = formConsumerKey;
        payload.consumerSecret = formConsumerSecret;
      }

      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showAlert(`${modalPlatform} store connected successfully!`, 'success');
        closeModal();
        await loadConnections();
      } else {
        showAlert(data.error || 'Failed to save store credentials.', 'error');
      }
    } catch (err: any) {
      showAlert(err.message || 'Error saving store connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to disconnect this ${platform} store? Automated order sync will cease.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/integrations?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showAlert(`${platform} store disconnected.`, 'success');
        await loadConnections();
      } else {
        showAlert(data.error || 'Failed to disconnect.', 'error');
      }
    } catch (err: any) {
      showAlert(err.message || 'Error disconnecting store.', 'error');
    }
  };

  const handleSyncStore = async (connectionId: string, platform: string) => {
    try {
      setSyncingId(connectionId);
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(`Successfully synchronized ${data.totalSynced} order(s) from ${platform}.`, 'success');
        await loadConnections();
      } else {
        showAlert(data.error || 'Order synchronization failed.', 'error');
      }
    } catch (err: any) {
      showAlert(err.message || 'Sync request failed.', 'error');
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncingAll(true);
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message || `Synchronized ${data.totalSynced} order(s) across all active stores.`, 'success');
        await loadConnections();
      } else {
        showAlert(data.error || 'Sync all failed.', 'error');
      }
    } catch (err: any) {
      showAlert(err.message || 'Sync all failed.', 'error');
    } finally {
      setSyncingAll(false);
    }
  };

  const shopifyConn = connections.find((c) => c.platform === 'Shopify');
  const wooConn = connections.find((c) => c.platform === 'WooCommerce');

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* 1. Deep Slate / Navy Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Integrations"
        onOpenCallLogs={() => setCallLogsModalOpen(true)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onToggleSidebar={() => setSidebarOpen(true)}
          onOpenCallLogs={() => setCallLogsModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Breadcrumb & Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-indigo-600 font-semibold">Store Integrations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Multi-Channel E-Commerce Integrations
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Shopify & WooCommerce Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Connect your online storefronts to ingest orders in real-time, execute HMAC-verified webhooks, and trigger automated AI voice confirmations.
              </p>
            </div>

            {/* Header Action: Sync All */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSyncAll}
                disabled={syncingAll}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 rounded-xl shadow-xs shadow-indigo-200 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
                <span>{syncingAll ? 'Syncing All Stores...' : 'Sync All Stores'}</span>
              </button>
            </div>
          </div>

          {/* Alert Toast Banner */}
          {alertMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all animate-in fade-in duration-200 ${
                alertMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {alertMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{alertMessage.text}</span>
              </div>
              <button onClick={() => setAlertMessage(null)} className="text-xs opacity-60 hover:opacity-100 font-bold">
                ✕
              </button>
            </div>
          )}

          {/* Active Integration Status Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Active Channels</span>
                <Plug className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{connections.filter((c) => c.isActive).length} / 2</p>
              <p className="text-[11px] text-slate-400 mt-1">Shopify REST & WooCommerce v3 REST API</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Security Shield</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">HMAC-SHA256</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Tamper-proof payload verification active</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>AI Confirmation Pipeline</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">Auto-Dialed</p>
              <p className="text-[11px] text-slate-400 mt-1">Ingested orders enter 60s voice verification queue</p>
            </div>
          </div>

          {/* STORE CONNECTION CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. SHOPIFY INTEGRATION CARD */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#95BF47]/10 border border-[#95BF47]/30 flex items-center justify-center text-[#95BF47] font-bold shadow-xs">
                      {/* Shopify Bag Icon representation */}
                      <ShoppingBag className="w-6 h-6 text-[#7ab55c]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">Shopify Plus & Standard</h3>
                        {shopifyConn ? (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Connected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-full">
                            Not Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Admin REST API & Webhook Ingestion</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    REST 2024-01
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Automatically pulls orders via Shopify Admin API using your private App Access Token (<code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">shpat_...</code>). Listens for <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">orders/create</code> webhooks.
                </p>

                {shopifyConn ? (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Store Domain:</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        {shopifyConn.storeUrl}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Access Token:</span>
                      <span className="font-mono text-slate-600 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        {shopifyConn.maskedAccessToken || 'shpat_••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400">Last Order Sync:</span>
                      <span className="text-slate-600 font-medium">
                        {shopifyConn.lastSyncAt ? new Date(shopifyConn.lastSyncAt).toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-dashed border-slate-300 text-center mb-4">
                    <p className="text-xs text-slate-500">No Shopify store currently connected to this workspace.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {shopifyConn ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSyncStore(shopifyConn.id, 'Shopify')}
                        disabled={syncingId === shopifyConn.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingId === shopifyConn.id ? 'animate-spin' : ''}`} />
                        <span>{syncingId === shopifyConn.id ? 'Syncing...' : 'Sync Orders'}</span>
                      </button>
                      <button
                        onClick={() => openConnectModal('Shopify')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Configure</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDisconnect(shopifyConn.id, 'Shopify')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Disconnect Store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openConnectModal('Shopify')}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect Shopify Store</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. WOOCOMMERCE INTEGRATION CARD */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#7F54B3]/10 border border-[#7F54B3]/30 flex items-center justify-center text-[#7F54B3] font-bold shadow-xs">
                      {/* WooCommerce Icon representation */}
                      <Store className="w-6 h-6 text-[#7F54B3]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">WooCommerce</h3>
                        {wooConn ? (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Connected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-full">
                            Not Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">REST API v3 & Webhook Ingestion</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    REST v3
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Pulls orders securely from WordPress/WooCommerce using Consumer Key (<code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">ck_...</code>) and Consumer Secret (<code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">cs_...</code>). Listens for <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">order.created</code> webhooks.
                </p>

                {wooConn ? (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Store URL:</span>
                      <span className="font-mono font-bold text-slate-800 flex items-center gap-1 truncate max-w-[220px]">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {wooConn.storeUrl}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Consumer Key:</span>
                      <span className="font-mono text-slate-600 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        {wooConn.maskedConsumerKey || 'ck_••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400">Last Order Sync:</span>
                      <span className="text-slate-600 font-medium">
                        {wooConn.lastSyncAt ? new Date(wooConn.lastSyncAt).toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-dashed border-slate-300 text-center mb-4">
                    <p className="text-xs text-slate-500">No WooCommerce store currently connected to this workspace.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {wooConn ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSyncStore(wooConn.id, 'WooCommerce')}
                        disabled={syncingId === wooConn.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingId === wooConn.id ? 'animate-spin' : ''}`} />
                        <span>{syncingId === wooConn.id ? 'Syncing...' : 'Sync Orders'}</span>
                      </button>
                      <button
                        onClick={() => openConnectModal('WooCommerce')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Configure</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleDisconnect(wooConn.id, 'WooCommerce')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Disconnect Store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openConnectModal('WooCommerce')}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#7F54B3] hover:bg-[#6c449c] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect WooCommerce Store</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* REAL-TIME WEBHOOK CONFIGURATION GUIDE (ENTERPRISE UTILITY) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Real-Time Webhook Listener Endpoints
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure these URLs inside your Shopify Admin or WooCommerce Webhooks panel for instant sub-second order ingestion.
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                HMAC Signed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Shopify Webhook */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Shopify Webhook Target:</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Topic: orders/create
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                  <span className="truncate">https://your-domain.com/api/webhooks/shopify</span>
                  <button
                    onClick={() => copyToClipboard('https://your-domain.com/api/webhooks/shopify', 'shopify')}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedKey === 'shopify' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Header verified: <code className="text-indigo-600 font-mono">X-Shopify-Hmac-Sha256</code>
                </p>
              </div>

              {/* WooCommerce Webhook */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">WooCommerce Webhook Target:</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Topic: Order created
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                  <span className="truncate">https://your-domain.com/api/webhooks/woo</span>
                  <button
                    onClick={() => copyToClipboard('https://your-domain.com/api/webhooks/woo', 'woo')}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedKey === 'woo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Header verified: <code className="text-indigo-600 font-mono">X-WC-Webhook-Signature</code>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CONNECT STORE CREDENTIALS MODAL */}
      {modalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold ${
                    modalPlatform === 'Shopify' ? 'bg-[#7ab55c]' : 'bg-[#7F54B3]'
                  }`}
                >
                  {modalPlatform === 'Shopify' ? <ShoppingBag className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Connect {modalPlatform} Store
                  </h3>
                  <p className="text-xs text-slate-500">Secure API Credentials Storage</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveConnection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {modalPlatform === 'Shopify' ? 'Shopify Store Domain (*.myshopify.com)' : 'WooCommerce Store URL'}
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formStoreUrl}
                    onChange={(e) => setFormStoreUrl(e.target.value)}
                    placeholder={
                      modalPlatform === 'Shopify' ? 'your-brand.myshopify.com' : 'https://store.yourbrand.com'
                    }
                    className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {modalPlatform === 'Shopify'
                    ? 'Enter your store handle or full myshopify domain.'
                    : 'The full URL where your WordPress & WooCommerce REST API is hosted.'}
                </p>
              </div>

              {/* Shopify-specific inputs */}
              {modalPlatform === 'Shopify' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin API Access Token
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={formAccessToken}
                      onChange={(e) => setFormAccessToken(e.target.value)}
                      placeholder="shpat_••••••••••••••••••••••••"
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Found in Shopify Admin &gt; Settings &gt; Apps and sales channels &gt; Develop apps.
                  </p>
                </div>
              )}

              {/* WooCommerce-specific inputs */}
              {modalPlatform === 'WooCommerce' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Consumer Key
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={formConsumerKey}
                        onChange={(e) => setFormConsumerKey(e.target.value)}
                        placeholder="ck_••••••••••••••••••••••••"
                        className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Consumer Secret
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={formConsumerSecret}
                        onChange={(e) => setFormConsumerSecret(e.target.value)}
                        placeholder="cs_••••••••••••••••••••••••"
                        className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Optional Webhook Secret */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Webhook Shared Secret <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="password"
                  value={formWebhookSecret}
                  onChange={(e) => setFormWebhookSecret(e.target.value)}
                  placeholder="Optional HMAC SHA-256 Secret"
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>

              {/* Security Banner */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Credentials are encrypted and masked before storage in your PostgreSQL database.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                    modalPlatform === 'Shopify'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#7F54B3] hover:bg-[#6c449c]'
                  } disabled:opacity-60`}
                >
                  {isSubmitting ? 'Verifying & Saving...' : 'Save & Connect Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Call Logs Modal */}
      <AICallLogsModal
        isOpen={callLogsModalOpen}
        onClose={() => setCallLogsModalOpen(false)}
      />
    </div>
  );
}
