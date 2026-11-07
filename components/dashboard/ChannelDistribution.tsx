'use client';

import React from 'react';
import { mockChannels } from '@/lib/mock-data';
import { formatCurrency, getChannelBadge } from '@/lib/utils';
import { CheckCircle2, RefreshCw, ShoppingCart, TrendingUp } from 'lucide-react';

export const ChannelDistribution: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Sales Channels Performance
          </h3>
          <p className="text-xs text-slate-500">Live order allocation & revenue per channel</p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>4 Connected</span>
        </span>
      </div>

      {/* Distribution progress bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex gap-0.5 mb-4 p-0.5">
        <div
          style={{ width: '46%' }}
          className="bg-emerald-500 rounded-l-full transition-all duration-500"
          title="Shopify: 46%"
        />
        <div
          style={{ width: '31%' }}
          className="bg-amber-500 transition-all duration-500"
          title="Amazon: 31%"
        />
        <div
          style={{ width: '14%' }}
          className="bg-purple-500 transition-all duration-500"
          title="WooCommerce: 14%"
        />
        <div
          style={{ width: '9%' }}
          className="bg-sky-500 rounded-r-full transition-all duration-500"
          title="eBay: 9%"
        />
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mockChannels.map((item) => {
          const badge = getChannelBadge(item.channel);

          return (
            <div
              key={item.channel}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: badge.accent }}
                  />
                  <span className="text-xs font-bold text-slate-800">{item.channel}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {item.percentage}%
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {formatCurrency(item.revenueToday)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.ordersToday} orders
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
