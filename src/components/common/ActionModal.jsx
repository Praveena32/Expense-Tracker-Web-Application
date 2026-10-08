import React from 'react';
import { X, Check } from 'lucide-react';

export default function ActionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 overflow-hidden z-10 animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-slate-900">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}
