'use client';

import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { StatCardData } from '@/types';
import { cn } from '@/lib/utils';

interface StatCardsProps {
  data: StatCardData[];
}

export const StatCards: React.FC<StatCardsProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar':
        return {
          icon: DollarSign,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50 border-indigo-100',
        };
      case 'orders':
        return {
          icon: ShoppingBag,
          color: 'text-blue-600',
          bg: 'bg-blue-50 border-blue-100',
        };
      case 'alert':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bg: 'bg-amber-50 border-amber-100',
        };
      case 'users':
        return {
          icon: Users,
          color: 'text-violet-600',
          bg: 'bg-violet-50 border-violet-100',
        };
      default:
        return {
          icon: DollarSign,
          color: 'text-slate-600',
          bg: 'bg-slate-50 border-slate-100',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {data.map((item) => {
        const { icon: Icon, color, bg } = getIcon(item.iconName);
        const isWarning = item.iconName === 'alert';
        const isUp = item.trend === 'up';

        return (
          <div
            key={item.id}
            className="group relative bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:shadow-card-hover hover:border-slate-300 transition-all duration-200"
          >
            {/* Top Row: Title + Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.title}
              </span>
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center border transition-transform duration-200 group-hover:scale-105',
                  bg
                )}
              >
                <Icon className={cn('w-4 h-4', color)} />
              </div>
            </div>

            {/* Middle Row: Main Metric Value */}
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                {item.value}
              </h3>
              
              {/* Trend Badge */}
              <div
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                  isWarning
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : isUp
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                )}
              >
                {isWarning ? (
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                ) : isUp ? (
                  <TrendingUp className="w-3 h-3 shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 shrink-0" />
                )}
                <span>{item.change}</span>
              </div>
            </div>

            {/* Bottom Row: Context note */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 truncate">{item.description}</span>
              <span className="text-slate-400 text-[11px] font-medium shrink-0">
                {item.timeframe}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
