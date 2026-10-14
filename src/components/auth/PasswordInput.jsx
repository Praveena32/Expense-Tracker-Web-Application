import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  id,
  name,
  label,
  placeholder = '••••••••••••',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  autoComplete = 'new-password',
  className = '',
  helperText,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
        <span
          className={`absolute left-3.5 flex items-center justify-center pointer-events-none transition-colors duration-150 ${
            error ? 'text-red-500' : 'text-slate-400 peer-focus:text-emerald-600'
          }`}
          aria-hidden="true"
        >
          <Lock className="w-[18px] h-[18px]" />
        </span>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`peer w-full h-11 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none pl-11 ${
            error ? 'pr-20' : 'pr-11'
          } ${
            error
              ? 'border-red-400 bg-red-50/20 text-slate-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
              : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20'
          } ${
            disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : ''
          }`}
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {error && (
            <span
              className="flex items-center justify-center text-red-500 pointer-events-none mr-1"
              aria-hidden="true"
            >
              <AlertCircle className="w-[18px] h-[18px]" />
            </span>
          )}

          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            tabIndex={0}
            className="p-1.5 text-slate-400 hover:text-slate-700 focus-visible:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-colors duration-150"
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" />
            ) : (
              <Eye className="w-[18px] h-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>
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
