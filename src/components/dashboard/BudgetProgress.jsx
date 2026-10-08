import React from 'react';
import { Link } from 'react-router-dom';
import { Target, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function BudgetProgress({
  budgets = [],
  onSetBudget,
}) {
  const hasBudgets = budgets && budgets.length > 0;

  // Status badge & color resolver
  const getStatusConfig = (progress) => {
    if (progress >= 100) {
      return {
        label: 'Exceeded',
        badgeBg: 'bg-red-50 text-red-700 border-red-200/80',
        barColor: 'bg-red-500',
        textColor: 'text-red-600',
      };
    }
    if (progress >= 75) {
      return {
        label: 'Warning',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-600',
      };
    }
    return {
      label: 'Normal',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    };
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
            Budget Progress
          </h3>
          <p className="text-xs text-slate-500">Monthly caps & spend limits</p>
        </div>

        {hasBudgets && (
          <Link
            to="/budgets"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors font-display"
          >
            <span>Manage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Budget Bars or Empty State */}
      {!hasBudgets ? (
        <EmptyState
          icon={Target}
          title="No budget targets set"
          description="Create spending limits for groceries, travel, or entertainment to maintain financial discipline."
          actionLabel="+ Set Budget Limit"
          onAction={onSetBudget}
          className="my-auto py-8"
        />
      ) : (
        <div className="space-y-4.5 my-auto">
          {budgets.map((b) => {
            const config = getStatusConfig(b.progress);
            const isOver = b.progress >= 100;

            return (
              <div key={b.id || b.category} className="space-y-1.5 group">
                {/* Category & Status Pill */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-slate-900 text-sm">
                      {b.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badgeBg}`}
                    >
                      {config.label} ({b.progress}%)
                    </span>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-900">
                      {b.formattedSpent || `Rs. ${b.spent.toLocaleString()}`}
                    </span>
                    <span className="text-slate-400">
                      {' / '}{b.formattedBudget || `Rs. ${b.budget.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                    style={{ width: `${Math.min(b.progress, 100)}%` }}
                  />
                </div>

                {/* Remaining Amount & Advice */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {isOver ? (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Over by {b.formattedRemaining?.replace('-', '') || 'Rs. 1,200'}
                      </span>
                    ) : (
                      <span>
                        Remaining: <strong className="text-slate-700">{b.formattedRemaining}</strong>
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {100 - b.progress > 0 ? `${100 - b.progress}% left` : '0% left'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
