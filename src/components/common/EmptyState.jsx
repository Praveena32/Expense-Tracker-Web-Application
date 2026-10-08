import React from 'react';
import { Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-10 px-4 ${className}`}>
      {Icon && (
        <div className="w-13 h-13 rounded-2xl bg-slate-100/90 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-200/60 shadow-xs">
          <Icon className="w-6 h-6 stroke-[1.8]" />
        </div>
      )}
      <h4 className="font-display font-bold text-slate-900 text-base mb-1">
        {title}
      </h4>
      <p className="text-slate-500 text-xs sm:text-sm max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold font-display shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
