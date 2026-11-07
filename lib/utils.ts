import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AIVerificationStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

export function getStatusBadgeClasses(status: string): { bg: string; text: string; dot: string; border: string } {
  switch (status.toLowerCase()) {
    case 'delivered':
      return {
        bg: 'bg-emerald-50/90 text-emerald-700',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        border: 'border-emerald-200/80',
      };
    case 'shipped':
      return {
        bg: 'bg-blue-50/90 text-blue-700',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        border: 'border-blue-200/80',
      };
    case 'pending':
      return {
        bg: 'bg-amber-50/90 text-amber-700',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        border: 'border-amber-200/80',
      };
    case 'processing':
      return {
        bg: 'bg-indigo-50/90 text-indigo-700',
        text: 'text-indigo-700',
        dot: 'bg-indigo-500',
        border: 'border-indigo-200/80',
      };
    case 'cancelled':
      return {
        bg: 'bg-rose-50/90 text-rose-700',
        text: 'text-rose-700',
        dot: 'bg-rose-500',
        border: 'border-rose-200/80',
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700',
        text: 'text-slate-700',
        dot: 'bg-slate-400',
        border: 'border-slate-200',
      };
  }
}

export function getAIVerificationBadge(status: AIVerificationStatus): {
  badgeClass: string;
  dotClass: string;
  textClass: string;
  iconType: 'check' | 'pulse' | 'alert' | 'pending';
  label: string;
  canGenerateLabel: boolean;
  tooltip: string;
} {
  switch (status) {
    case 'Verified':
      return {
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 ring-1 ring-emerald-500/10',
        dotClass: 'bg-emerald-500 ring-2 ring-emerald-200',
        textClass: 'text-emerald-700',
        iconType: 'check',
        label: 'Verified',
        canGenerateLabel: true,
        tooltip: 'Customer confirmed order verbally with AI Agent. Label generation authorized.',
      };
    case 'Calling...':
      return {
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/90 ring-1 ring-blue-500/10',
        dotClass: 'bg-blue-500 animate-ping',
        textClass: 'text-blue-700',
        iconType: 'pulse',
        label: 'Calling...',
        canGenerateLabel: false,
        tooltip: 'AI Agent is currently speaking with the customer. Awaiting call completion.',
      };
    case 'Fake/Cancelled':
      return {
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/90 ring-1 ring-rose-500/10',
        dotClass: 'bg-rose-500',
        textClass: 'text-rose-700',
        iconType: 'alert',
        label: 'Fake/Cancelled',
        canGenerateLabel: false,
        tooltip: 'Flagged as high-risk or customer cancelled during automated verification call.',
      };
    case 'Pending':
    default:
      return {
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 ring-1 ring-slate-400/10',
        dotClass: 'bg-slate-400',
        textClass: 'text-slate-600',
        iconType: 'pending',
        label: 'Pending',
        canGenerateLabel: false,
        tooltip: 'Queued for automated confirmation call before label can be printed.',
      };
  }
}

export function getChannelBadge(channel: string) {
  switch (channel) {
    case 'Shopify':
      return {
        color: 'text-emerald-800 bg-emerald-50 border-emerald-200/80',
        accent: '#10b981',
        tag: 'Shopify Store',
      };
    case 'Amazon':
      return {
        color: 'text-amber-800 bg-amber-50 border-amber-200/80',
        accent: '#f59e0b',
        tag: 'Amazon FBA/FBM',
      };
    case 'WooCommerce':
      return {
        color: 'text-purple-800 bg-purple-50 border-purple-200/80',
        accent: '#8b5cf6',
        tag: 'WooCommerce',
      };
    case 'eBay':
      return {
        color: 'text-sky-800 bg-sky-50 border-sky-200/80',
        accent: '#0284c7',
        tag: 'eBay Store',
      };
    case 'TikTok Shop':
      return {
        color: 'text-rose-800 bg-rose-50 border-rose-200/80',
        accent: '#f43f5e',
        tag: 'TikTok Shop',
      };
    default:
      return {
        color: 'text-slate-800 bg-slate-50 border-slate-200',
        accent: '#64748b',
        tag: channel,
      };
  }
}
