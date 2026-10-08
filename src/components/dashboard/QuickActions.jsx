import React from 'react';
import { PlusCircle, ArrowDownCircle, ArrowUpCircle, Target } from 'lucide-react';

export default function QuickActions({
  onAddExpense,
  onAddIncome,
  onSetBudget,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {/* Add Expense Button */}
      <button
        type="button"
        onClick={onAddExpense}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 text-slate-800 hover:text-rose-700 text-xs sm:text-sm font-bold font-display shadow-xs transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
      >
        <ArrowDownCircle className="w-4 h-4 text-rose-500" />
        <span>+ Add Expense</span>
      </button>

      {/* Add Income Button */}
      <button
        type="button"
        onClick={onAddIncome}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold font-display shadow-xs hover:shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <ArrowUpCircle className="w-4 h-4 text-emerald-100" />
        <span>+ Add Income</span>
      </button>

      {/* Set Budget Button */}
      <button
        type="button"
        onClick={onSetBudget}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-slate-800 hover:text-indigo-700 text-xs sm:text-sm font-bold font-display shadow-xs transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Target className="w-4 h-4 text-indigo-500" />
        <span>Set Budget</span>
      </button>
    </div>
  );
}
