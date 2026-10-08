import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({
  id,
  name,
  checked,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={id}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none group ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        }`}
      >
        <div className="relative flex items-center pt-0.5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className="peer sr-only"
          />

          <div
            className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all duration-150 ${
              error
                ? 'border-red-400 bg-red-50/30'
                : 'border-slate-300 bg-white group-hover:border-emerald-500'
            } peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-emerald-500`}
          >
            <Check
              className={`w-3.5 h-3.5 text-white transition-transform duration-150 ${
                checked ? 'scale-100' : 'scale-0'
              }`}
              strokeWidth={3}
            />
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-normal">
          {label}
        </div>
      </label>

      {error && (
        <p id={errorId} className="mt-1 text-xs font-medium text-red-600 animate-fadeIn pl-7">
          {error}
        </p>
      )}
    </div>
  );
}
