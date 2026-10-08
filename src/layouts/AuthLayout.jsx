import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  PieChart, 
  ArrowUpRight, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';

export default function AuthLayout({ children, tagline = "Build better financial habits." }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-grid-pattern flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* ====================================================================
            LEFT SECTION: Branding & Financial Visuals (Desktop)
           ==================================================================== */}
        <section 
          className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-4"
          aria-label="Expense Tracker overview"
        >
          <div className="max-w-xl">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <Wallet className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                  Expense Tracker
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PRO FINANCE
                </span>
              </div>
            </div>

            {/* Tagline & Narrative */}
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-3">
              {tagline}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Gain 360-degree clarity over your finances. Set smart monthly budget limits, track daily expenditures seamlessly, and compound your long-term savings.
            </p>

            {/* Financial Themed Visual Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-preview relative overflow-hidden mb-8">
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />

              {/* Metrics Snapshot Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Financial Health Score
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-display text-3xl font-extrabold text-slate-900">
                      94 / 100
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <TrendingUp className="w-3 h-3" />
                      Excellent
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Target: +22% Savings
                </span>
              </div>

              {/* Mini Interactive-style Progress Bars */}
              <div className="space-y-3.5 mb-5 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-600">Monthly Budget Remaining</span>
                    <span className="font-bold text-slate-900">$2,450 / $4,000 (61%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '61%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-600">Emergency Fund Milestone</span>
                    <span className="font-bold text-slate-900">$12,000 / $15,000 (80%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>

              {/* Three Value Highlights */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] text-slate-500 font-medium">Daily Tracking</span>
                  <span className="font-display font-bold text-sm text-slate-800">Auto-Categorized</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] text-slate-500 font-medium">Data Privacy</span>
                  <span className="font-display font-bold text-sm text-slate-800">Zero Ads / Selling</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] text-slate-500 font-medium">Cloud Vault</span>
                  <span className="font-display font-bold text-sm text-slate-800">256-Bit Encrypted</span>
                </div>
              </div>

              {/* Micro Trust Banner */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  SOC2 Compliant & Bank-grade security
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Real-time sync
                </span>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="flex items-center gap-6 text-slate-600">
              <div>
                <span className="font-display font-bold text-lg text-slate-900 block">$42M+</span>
                <span className="text-xs text-slate-500">Expenses Logged</span>
              </div>
              <div className="w-px h-7 bg-slate-200" />
              <div>
                <span className="font-display font-bold text-lg text-slate-900 block">50,000+</span>
                <span className="text-xs text-slate-500">Active Budgeters</span>
              </div>
              <div className="w-px h-7 bg-slate-200" />
              <div>
                <span className="font-display font-bold text-lg text-slate-900 block">4.9 / 5</span>
                <span className="text-xs text-slate-500">User Rating</span>
              </div>
            </div>

          </div>
        </section>

        {/* ====================================================================
            RIGHT SECTION: Authentication Card Container
           ==================================================================== */}
        <section 
          className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center w-full"
          aria-label="Account registration form"
        >
          <div className="w-full max-w-md mx-auto">
            
            {/* Mobile Header (Shown only on small screens) */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-slate-900">
                Expense Tracker
              </span>
            </div>

            {/* The Authentication Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card p-6 sm:p-9 relative">
              {children}
            </div>

            {/* Bottom Subtext */}
            <div className="mt-5 text-center text-xs text-slate-400">
              <p>
                Protected by industry-grade encryption &bull;{' '}
                <a href="#privacy" className="text-slate-500 hover:text-slate-800 underline">Privacy</a> &bull;{' '}
                <a href="#terms" className="text-slate-500 hover:text-slate-800 underline">Terms of Service</a>
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
