import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function InputField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon: Icon,
  autoComplete,
  className = '',
  helperText,
}) {
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-slate-800 font-display mb-1.5"
        >
          {label}
          {required && <span className="text-emerald-600 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <span
            className={`absolute left-3.5 flex items-center justify-center pointer-events-none transition-colors duration-150 ${
              error
                ? 'text-red-500'
                : 'text-slate-400 peer-focus:text-emerald-600'
            }`}
            aria-hidden="true"
          >
            <Icon className="w-[18px] height-[18px]" />
          </span>
        )}

        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`peer w-full h-11.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none
            ${Icon ? 'pl-10.5' : 'pl-3.5'}
            ${error ? 'pr-10' : 'pr-3.5'}
            ${
              error
                ? 'border-red-400 bg-red-50/20 text-slate-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
                : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
            }
            ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : ''}
          `}
        />

        {error && (
          <span
            className="absolute right-3.5 flex items-center justify-center text-red-500 pointer-events-none"
            aria-hidden="true"
          >
            <AlertCircle className="w-[18px] h-[18px]" />
          </span>
        )}
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1 animate-fadeIn">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
