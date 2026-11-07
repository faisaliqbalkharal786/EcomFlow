'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import {
  Settings,
  Mic,
  Save,
  RotateCcw,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Info,
  Code2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Helper variable tags available in custom scripts ───────────────────────
const HELPER_TAGS = [
  {
    variable: '{{customerName}}',
    label: 'Customer Name',
    example: 'Sophia Anderson',
    description: "Replaced with the customer's full name from the order",
  },
  {
    variable: '{{orderAmount}}',
    label: 'Order Amount',
    example: '$248.50',
    description: 'Replaced with the formatted order total (e.g. $248.50)',
  },
  {
    variable: '{{orderNumber}}',
    label: 'Order Number',
    example: '#EF-98421',
    description: 'Replaced with the unique order identifier',
  },
  {
    variable: '{{workspaceName}}',
    label: 'Workspace / Brand Name',
    example: 'Apex Global Brands',
    description: 'Replaced with your workspace/brand name',
  },
  {
    variable: '{{shippingAddress}}',
    label: 'Shipping Address',
    example: '402 Congress Ave, Austin TX',
    description: "Replaced with the customer's full shipping address",
  },
  {
    variable: '{{itemsSummary}}',
    label: 'Items Summary',
    example: '3 items in cart',
    description: 'Replaced with a summary of items in the order (if available)',
  },
];

// ─── Default Urdu prompt preview (read-only) ────────────────────────────────
const DEFAULT_URDU_PROMPT_PREVIEW = `You are a professional order verification assistant for {{workspaceName}}. You MUST speak entirely in Urdu using a polite, natural, and respectful conversational tone. Greet the customer by name, confirm their recent order of {{orderAmount}}, and verify their delivery address. Determine if this is a legitimate buyer or a fake/prank order.

Example greeting: "Assalam-o-Alaikum, kya meri baat {{customerName}} se ho rahi hai? Main {{workspaceName}} se baat kar raha/rahi hoon."

Order Details → Order ID: {{orderNumber}}, Amount: {{orderAmount}}, Shipping Address: {{shippingAddress}}.`;

export default function AISettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [savedPrompt, setSavedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showDefaultPreview, setShowDefaultPreview] = useState(false);

  // ─── Load existing prompt on mount ────────────────────────────────────────
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchPrompt = async () => {
      try {
        const res = await fetch('/api/settings/prompt');
        if (res.ok) {
          const data = await res.json();
          const fetched = data.customVoicePrompt || '';
          setCustomPrompt(fetched);
          setSavedPrompt(fetched);
        }
      } catch (err) {
        console.error('Failed to load custom prompt:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [session, status, router]);

  // ─── Auto-dismiss toast ────────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  // ─── Save handler ──────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings/prompt', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customVoicePrompt: customPrompt }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSavedPrompt(customPrompt.trim() || null);
        setToast({ type: 'success', message: data.message });
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to save script.' });
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Network error. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }, [customPrompt]);

  // ─── Reset to last saved ───────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setCustomPrompt(savedPrompt || '');
  }, [savedPrompt]);

  // ─── Copy tag to clipboard ─────────────────────────────────────────────────
  const handleCopyTag = useCallback(async (variable: string) => {
    try {
      await navigator.clipboard.writeText(variable);
      setCopiedTag(variable);
      setTimeout(() => setCopiedTag(null), 2000);
    } catch {
      // fallback: insert at cursor via textarea ref
    }
  }, []);

  // ─── Insert tag at textarea cursor position ────────────────────────────────
  const handleInsertTag = useCallback(
    (variable: string, e: React.MouseEvent) => {
      e.preventDefault();
      const textarea = document.getElementById('custom-prompt-textarea') as HTMLTextAreaElement | null;
      if (!textarea) {
        setCustomPrompt((prev) => prev + variable);
        return;
      }
      const start = textarea.selectionStart ?? customPrompt.length;
      const end = textarea.selectionEnd ?? customPrompt.length;
      const newValue = customPrompt.slice(0, start) + variable + customPrompt.slice(end);
      setCustomPrompt(newValue);
      // Restore cursor after insert
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    },
    [customPrompt]
  );

  const hasUnsavedChanges = customPrompt.trim() !== (savedPrompt ?? '').trim();
  const isUsingDefault = !savedPrompt || savedPrompt.trim() === '';

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b17]">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b17] flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Settings"
        onNavigate={(item) => {
          if (item === 'Dashboard') router.push('/');
          if (item === 'Integrations') router.push('/integrations');
        }}
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">AI Voice Script Settings</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Customize the AI calling script for your workspace tenant
                </p>
              </div>
            </div>

            {/* Status pill */}
            <div className="mt-4 flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                  isUsingDefault
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isUsingDefault ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                  )}
                />
                {isUsingDefault ? 'Using Default Urdu Script' : 'Custom Script Active'}
              </span>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* ── LEFT: Script Editor ────────────────────────────────────── */}
            <div className="xl:col-span-2 space-y-5">
              {/* Script textarea card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Custom Voice Script</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded font-mono text-[11px]',
                        customPrompt.length > 2000
                          ? 'bg-red-500/15 text-red-400'
                          : customPrompt.length > 1500
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {customPrompt.length} / 3000 chars
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <textarea
                    id="custom-prompt-textarea"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value.slice(0, 3000))}
                    placeholder={`Write your custom AI calling script here...\n\nExample:\n"Hello {{customerName}}, I'm calling from {{workspaceName}} to confirm your order {{orderNumber}} worth {{orderAmount}}. Can you please verify your delivery address at {{shippingAddress}}?"`}
                    maxLength={3000}
                    rows={14}
                    className="w-full bg-[#0a0f1d] border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    spellCheck={false}
                  />

                  <p className="mt-2.5 text-xs text-slate-500 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-600" />
                    Leave blank to use the default Urdu order-verification script. Variable tags like{' '}
                    <code className="text-indigo-400 font-mono">{'{{customerName}}'}</code> will be automatically
                    replaced with real order data at call time.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800 bg-slate-950/40">
                  <button
                    onClick={handleReset}
                    disabled={!hasUnsavedChanges || isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg',
                      isSaving || !hasUnsavedChanges
                        ? 'bg-indigo-600/40 text-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:shadow-indigo-500/40'
                    )}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Custom Script
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Default Urdu script preview (collapsible) */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowDefaultPreview((p) => !p)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-slate-300">View Default Urdu Fallback Script</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                      Active when no custom script is set
                    </span>
                  </div>
                  <ChevronRight
                    className={cn('w-4 h-4 text-slate-500 transition-transform', showDefaultPreview && 'rotate-90')}
                  />
                </button>

                {showDefaultPreview && (
                  <div className="px-5 pb-5">
                    <pre className="text-xs text-slate-400 font-mono bg-[#0a0f1d] border border-slate-800 rounded-xl p-4 leading-relaxed whitespace-pre-wrap break-words">
                      {DEFAULT_URDU_PROMPT_PREVIEW}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Helper Tags panel ───────────────────────────────── */}
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl sticky top-6">
                <div className="px-5 py-4 border-b border-slate-800">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Variable Tags</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Click to insert at cursor, or copy and paste manually
                  </p>
                </div>

                <div className="p-4 space-y-2.5">
                  {HELPER_TAGS.map((tag) => (
                    <div
                      key={tag.variable}
                      className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-3 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <button
                          onClick={(e) => handleInsertTag(tag.variable, e)}
                          title={`Insert ${tag.variable} at cursor`}
                          className="flex-1 text-left"
                        >
                          <code className="text-indigo-400 font-mono text-xs font-semibold group-hover:text-indigo-300 transition-colors">
                            {tag.variable}
                          </code>
                        </button>

                        <button
                          onClick={() => handleCopyTag(tag.variable)}
                          title="Copy to clipboard"
                          className="shrink-0 p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-all"
                        >
                          {copiedTag === tag.variable ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] font-semibold text-slate-300 mb-0.5">{tag.label}</p>
                      <p className="text-[10px] text-slate-500 leading-snug">{tag.description}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-600">
                        <span>e.g.</span>
                        <span className="font-mono text-emerald-500/80">{tag.example}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick example script */}
                <div className="mx-4 mb-4 p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl">
                  <p className="text-[11px] font-semibold text-indigo-300 mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Quick Start Example
                  </p>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    {`"Hello {{customerName}}, I'm calling from {{workspaceName}} regarding your order {{orderNumber}} worth {{orderAmount}}. Can you confirm your address at {{shippingAddress}}?"`}
                  </p>
                  <button
                    onClick={() => {
                      const example = `Hello {{customerName}}, I'm calling from {{workspaceName}} regarding your order {{orderNumber}} worth {{orderAmount}}.\n\nCould you please confirm your shipping address at {{shippingAddress}}?\n\nIf everything looks correct, your order will be processed and dispatched shortly. Thank you for shopping with us!`;
                      setCustomPrompt(example);
                    }}
                    className="mt-2 text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Use this example →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Toast Notification ──────────────────────────────────────────────── */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-sm transition-all animate-in slide-in-from-bottom-4',
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/50 text-emerald-200'
              : 'bg-red-950/90 border-red-700/50 text-red-200'
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <p className="text-sm font-medium max-w-xs">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
