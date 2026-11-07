'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Plug,
  Settings,
  Zap,
  BarChart3,
  PhoneCall,
  Sparkles,
  ChevronDown,
  Layers,
  HelpCircle,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onNavigate?: (item: string) => void;
  onOpenCallLogs?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeItem = 'Dashboard',
  onNavigate,
  onOpenCallLogs,
}) => {
  const router = useRouter();

  const primaryNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, badge: null, href: '/' },
    { name: 'Orders', icon: ShoppingCart, badge: '24', badgeType: 'primary', href: '/#orders' },
    { name: 'Inventory', icon: Package, badge: '18', badgeType: 'warning', href: '#' },
    { name: 'Shipping', icon: Truck, badge: null, href: '#' },
    { name: 'Integrations', icon: Plug, badge: '2 Active', badgeType: 'success', href: '/integrations' },
    { name: 'Settings', icon: Settings, badge: null, href: '/settings' },
  ];

  const intelligenceNavItems = [
    {
      name: 'AI Caller Logs',
      icon: PhoneCall,
      badge: '145 Today',
      badgeType: 'ai',
      isNew: true,
      onClick: onOpenCallLogs,
    },
    { name: 'Automation Rules', icon: Zap, badge: 'Active', badgeType: 'accent' },
    { name: 'Analytics', icon: BarChart3, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container — High-End Deep Navy / Slate */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0a0f1d] border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl text-slate-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/90 bg-[#0a0f1d]/90">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/25 text-white">
              <Layers className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">
                  Ecom<span className="text-indigo-400">Flow</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">
                  Plus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Logistics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store / Workspace Selector */}
        <div className="p-3 mx-3 my-3 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                AG
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                  Apex Global Brands
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>4 Storefronts Synced</span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto scrollbar-thin">
          {/* Main Menu */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </p>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const isActive = activeItem.toLowerCase() === item.name.toLowerCase();
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (onNavigate) onNavigate(item.name);
                      if (item.href && item.href !== '#' && typeof window !== 'undefined') {
                        if (window.location.pathname !== item.href) {
                          router.push(item.href);
                        }
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-850 hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-[11px] font-semibold rounded-full',
                          isActive
                            ? 'bg-indigo-700/90 text-white'
                            : item.badgeType === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.badgeType === 'success'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Intelligence & Workflows */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>AI Automation</span>
              </p>
              <span className="text-[9px] px-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                LIVE
              </span>
            </div>

            <nav className="space-y-1">
              {intelligenceNavItems.map((item) => {
                const isActive = activeItem.toLowerCase() === item.name.toLowerCase();
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      if (onNavigate) onNavigate(item.name);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : item.isNew
                        ? 'text-indigo-200 hover:text-white bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-800/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive
                            ? 'text-white'
                            : item.isNew
                            ? 'text-indigo-400 group-hover:text-indigo-300 animate-pulse'
                            : 'text-slate-400 group-hover:text-slate-200'
                        )}
                      />
                      <span className={item.isNew && !isActive ? 'font-semibold text-slate-100' : ''}>
                        {item.name}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-semibold rounded-full',
                          isActive
                            ? 'bg-indigo-700 text-white'
                            : item.badgeType === 'ai'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* AI Voice Engine Status Card (Bottom Sidebar) */}
        <div className="p-3 m-3 bg-gradient-to-b from-slate-900 to-indigo-950/60 rounded-xl border border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white">AI Voice Caller</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Ready
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug mb-2">
            Auto-verifies buyer phone lines, delivery addresses & cancels fake orders in real-time.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            <span>Accuracy Rate</span>
            <span className="font-bold text-emerald-400">99.1% Verified</span>
          </div>
        </div>

        {/* System Version & Help */}
        <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Developer API</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">v2.4-ai</span>
        </div>
      </aside>
    </>
  );
};
