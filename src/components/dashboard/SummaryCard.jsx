import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, CreditCard, PiggyBank } from 'lucide-react';

export default function SummaryCard({
  title,
  amount,
  supportingText,
  change,
  type = 'balance', // 'income' | 'expense' | 'balance' | 'budget'
  progress,
  className = '',
}) {
  // Determine styles according to design requirements
  const styles = {
    income: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      amountColor: 'text-slate-900',
      accentGlow: 'hover:border-emerald-300',
      defaultIcon: ArrowUpRight,
    },
    expense: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200/60',
      badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      amountColor: 'text-slate-900',
      accentGlow: 'hover:border-rose-300',
      defaultIcon: ArrowDownRight,
    },
    balance: {
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-200/60',
      badgeBg: 'bg-sky-50 text-sky-700 border border-sky-200/60',
      amountColor: 'text-slate-900',
      accentGlow: 'hover:border-sky-300',
      defaultIcon: Wallet,
    },
    budget: {
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
      badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
      amountColor: 'text-slate-900',
      accentGlow: 'hover:border-indigo-300',
      defaultIcon: PiggyBank,
    },
  }[type] || {
    iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-700',
    amountColor: 'text-slate-900',
    accentGlow: 'hover:border-slate-300',
    defaultIcon: Wallet,
  };

  const IconComponent = styles.defaultIcon;

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden group ${styles.accentGlow} ${className}`}
    >
      {/* Card Header: Icon & Trend badge */}
      <div className="flex items-center justify-between mb-3.5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${styles.iconBg}`}>
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>

        {change && (
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${styles.badgeBg}`}>
            {type === 'income' && <ArrowUpRight className="w-3 h-3" />}
            {type === 'expense' && <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      {/* Title & Value */}
      <h3 className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">
        {title}
      </h3>
      <div className={`font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-2 ${styles.amountColor}`}>
        {amount}
      </div>

      {/* Supporting Text & Progress Bar if budget */}
      {type === 'budget' && typeof progress === 'number' ? (
        <div className="mt-3 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-slate-500">
            <span>Utilization</span>
            <span className="font-bold text-slate-800">{supportingText}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress >= 100
                  ? 'bg-red-500'
                  : progress >= 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
          {supportingText}
        </p>
      )}
    </div>
  );
}
