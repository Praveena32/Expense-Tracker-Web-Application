import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Bell, 
  Coins, 
  CheckCircle, 
  Save, 
  Sliders, 
  Download, 
  Eye, 
  Trash2 
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { useAuth } from '../context/AuthContext';

export const CURRENCY_GROUPS = [
  {
    group: 'Popular & Major Global',
    currencies: [
      { code: 'INR', name: 'Indian Rupee (INR - ₹ / Rs.)' },
      { code: 'USD', name: 'US Dollar (USD - $)' },
      { code: 'EUR', name: 'Euro (EUR - €)' },
      { code: 'GBP', name: 'British Pound (GBP - £)' },
      { code: 'JPY', name: 'Japanese Yen (JPY - ¥)' },
      { code: 'AUD', name: 'Australian Dollar (AUD - A$)' },
      { code: 'CAD', name: 'Canadian Dollar (CAD - C$)' },
      { code: 'CHF', name: 'Swiss Franc (CHF)' },
      { code: 'CNY', name: 'Chinese Yuan (CNY - ¥)' },
      { code: 'SGD', name: 'Singapore Dollar (SGD - S$)' },
      { code: 'AED', name: 'UAE Dirham (AED - د.إ)' },
      { code: 'SAR', name: 'Saudi Riyal (SAR - ﷼)' },
    ],
  },
  {
    group: 'Asia & Pacific',
    currencies: [
      { code: 'BDT', name: 'Bangladeshi Taka (BDT - ৳)' },
      { code: 'HKD', name: 'Hong Kong Dollar (HK$)' },
      { code: 'IDR', name: 'Indonesian Rupiah (IDR - Rp)' },
      { code: 'KRW', name: 'South Korean Won (KRW - ₩)' },
      { code: 'LKR', name: 'Sri Lankan Rupee (LKR - Rs)' },
      { code: 'MYR', name: 'Malaysian Ringgit (MYR - RM)' },
      { code: 'NPR', name: 'Nepalese Rupee (NPR - Rs)' },
      { code: 'NZD', name: 'New Zealand Dollar (NZ$)' },
      { code: 'PHP', name: 'Philippine Peso (PHP - ₱)' },
      { code: 'PKR', name: 'Pakistani Rupee (PKR - ₨)' },
      { code: 'THB', name: 'Thai Baht (THB - ฿)' },
      { code: 'TWD', name: 'New Taiwan Dollar (TWD - NT$)' },
      { code: 'VND', name: 'Vietnamese Dong (VND - ₫)' },
    ],
  },
  {
    group: 'Europe',
    currencies: [
      { code: 'BGN', name: 'Bulgarian Lev (BGN - лв)' },
      { code: 'CZK', name: 'Czech Koruna (CZK - Kč)' },
      { code: 'DKK', name: 'Danish Krone (DKK - kr)' },
      { code: 'HUF', name: 'Hungarian Forint (HUF - Ft)' },
      { code: 'ISK', name: 'Icelandic Króna (ISK - kr)' },
      { code: 'NOK', name: 'Norwegian Krone (NOK - kr)' },
      { code: 'PLN', name: 'Polish Zloty (PLN - zł)' },
      { code: 'RON', name: 'Romanian Leu (RON - lei)' },
      { code: 'RSD', name: 'Serbian Dinar (RSD - din)' },
      { code: 'RUB', name: 'Russian Ruble (RUB - ₽)' },
      { code: 'SEK', name: 'Swedish Krona (SEK - kr)' },
      { code: 'TRY', name: 'Turkish Lira (TRY - ₺)' },
      { code: 'UAH', name: 'Ukrainian Hryvnia (UAH - ₴)' },
    ],
  },
  {
    group: 'Middle East & Africa',
    currencies: [
      { code: 'BHD', name: 'Bahraini Dinar (BHD - .د.ب)' },
      { code: 'DZD', name: 'Algerian Dinar (DZD - دج)' },
      { code: 'EGP', name: 'Egyptian Pound (EGP - E£)' },
      { code: 'ETB', name: 'Ethiopian Birr (ETB - Br)' },
      { code: 'GHS', name: 'Ghanaian Cedi (GHS - GH₵)' },
      { code: 'ILS', name: 'Israeli New Shekel (ILS - ₪)' },
      { code: 'JOD', name: 'Jordanian Dinar (JOD - د.ا)' },
      { code: 'KES', name: 'Kenyan Shilling (KES - KSh)' },
      { code: 'KWD', name: 'Kuwaiti Dinar (KWD - د.ك)' },
      { code: 'MAD', name: 'Moroccan Dirham (MAD)' },
      { code: 'NGN', name: 'Nigerian Naira (NGN - ₦)' },
      { code: 'OMR', name: 'Omani Rial (OMR - ر.ع.)' },
      { code: 'QAR', name: 'Qatari Riyal (QAR - ر.ق)' },
      { code: 'TND', name: 'Tunisian Dinar (TND - DT)' },
      { code: 'TZS', name: 'Tanzanian Shilling (TZS - TSh)' },
      { code: 'UGX', name: 'Ugandan Shilling (UGX - USh)' },
      { code: 'ZAR', name: 'South African Rand (ZAR - R)' },
    ],
  },
  {
    group: 'Americas',
    currencies: [
      { code: 'ARS', name: 'Argentine Peso (ARS - $)' },
      { code: 'BRL', name: 'Brazilian Real (BRL - R$)' },
      { code: 'CLP', name: 'Chilean Peso (CLP - $)' },
      { code: 'COP', name: 'Colombian Peso (COP - $)' },
      { code: 'CRC', name: 'Costa Rican Colón (CRC - ₡)' },
      { code: 'DOP', name: 'Dominican Peso (DOP - RD$)' },
      { code: 'GTQ', name: 'Guatemalan Quetzal (GTQ - Q)' },
      { code: 'JMD', name: 'Jamaican Dollar (JMD - J$)' },
      { code: 'MXN', name: 'Mexican Peso (MXN - Mex$)' },
      { code: 'PEN', name: 'Peruvian Sol (PEN - S/.)' },
      { code: 'UYU', name: 'Uruguayan Peso (UYU - $U)' },
    ],
  },
];

export default function Settings() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings State (stored in localStorage)
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('app_preferences');
      return saved
        ? JSON.parse(saved)
        : {
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY',
            budgetAlertThreshold: 80,
            emailNotifications: true,
            pushNotifications: false,
            weeklyDigest: true,
            compactMode: false,
          };
    } catch {
      return {
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        budgetAlertThreshold: 80,
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        compactMode: false,
      };
    }
  });

  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, val) => {
    setPreferences((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem('app_preferences', JSON.stringify(preferences));
    setTimeout(() => {
      setSaving(false);
      setFeedback('Preferences saved successfully!');
      setTimeout(() => setFeedback(''), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          user={user}
          onMobileMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/dashboard"
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                  aria-label="Back to dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                  Settings & Preferences
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Customize application currency, notification alerts, and data preferences
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-display shadow-xs disabled:opacity-60 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm flex items-center gap-2 shadow-xs animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. General & Financial Formatting */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Coins className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Regional & Currency
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Base Currency
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CURRENCY_GROUPS.map((grp) => (
                      <optgroup key={grp.group} label={grp.group}>
                        {grp.currencies.map((curr) => (
                          <option key={curr.code} value={curr.code}>
                            {curr.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Date Format
                  </label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 14/10/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/14/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-14)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Budget Warning Threshold ({preferences.budgetAlertThreshold}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={preferences.budgetAlertThreshold}
                    onChange={(e) => handleChange('budgetAlertThreshold', Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>50%</span>
                    <span>75%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Notification Preferences */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Bell className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Alerts & Notifications
                </h3>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-bold text-slate-800 font-display">
                      Budget Exceeded Alerts
                    </p>
                    <p className="text-xs text-slate-500">
                      Receive in-app alerts when a category cap passes threshold
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800 font-display">
                      Weekly Spending Digest
                    </p>
                    <p className="text-xs text-slate-500">
                      Weekly summary of expenditures, top categories, and savings
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.weeklyDigest}
                    onChange={() => handleToggle('weeklyDigest')}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800 font-display">
                      Compact Display Mode
                    </p>
                    <p className="text-xs text-slate-500">
                      Condense table and card spacing for dense dashboard viewing
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.compactMode}
                    onChange={() => handleToggle('compactMode')}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
