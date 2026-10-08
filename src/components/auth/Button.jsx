import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  type = 'button',
  children,
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Creating account...',
  variant = 'primary',
  fullWidth = true,
  className = '',
  icon: Icon,
}) {
  const isDisabled = disabled || loading;

  const baseStyles =
    'relative inline-flex items-center justify-center font-display text-sm font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none h-12 px-6';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed',
    secondary:
      'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 focus-visible:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
    outline:
      'border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 focus-visible:ring-emerald-500 disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait opacity-95' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
          <span>{loadingText}</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          <span>{children}</span>
          {Icon && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
        </span>
      )}
    </button>
  );
}
