import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export function calculatePasswordStrength(password) {
  if (!password) {
    return { score: 0, label: '', color: '', width: '0%', textClass: '' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 6) {
    score = 1;
  }

  if (score <= 1) {
    return {
      score: 1,
      label: 'Weak',
      color: 'bg-red-500',
      textClass: 'text-red-600',
      description: 'Add at least 8 characters and mixed numbers.',
    };
  }

  if (score === 2) {
    return {
      score: 2,
      label: 'Medium',
      color: 'bg-amber-500',
      textClass: 'text-amber-600',
      description: 'Good, but add a special symbol or uppercase letter.',
    };
  }

  return {
    score: 3,
    label: 'Strong',
    color: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    description: 'Great password! Strong protection for your finances.',
  };
}

export default function PasswordStrength({ password, className = '' }) {
  if (!password) return null;

  const { score, label, color, textClass, description } = calculatePasswordStrength(password);

  return (
    <div className={`mt-2 flex flex-col gap-1.5 animate-fadeIn ${className}`} aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          {score === 3 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          )}
          Password strength:
        </span>
        <span className={`font-bold ${textClass}`}>{label}</span>
      </div>

      {/* Segmented Strength Bar */}
      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 1 ? color : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 2 ? color : 'bg-transparent'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 3 ? color : 'bg-transparent'
          }`}
        />
      </div>

      <p className="text-[11px] text-slate-500 leading-tight">
        {description}
      </p>
    </div>
  );
}
