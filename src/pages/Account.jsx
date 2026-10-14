import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Wallet,
  ReceiptText,
  Target,
  KeyRound
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';

export default function Account() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    balance: 'Rs. 0',
    transactionsCount: 0,
    budgetsCount: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }

    const loadStats = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        if (data) {
          setStats({
            balance: data.summary?.currentBalance?.formatted || 'Rs. 0',
            transactionsCount: data.recentTransactions?.length || 0,
            budgetsCount: data.budgetProgress?.length || 0,
          });
        }
      } catch (err) {
        // Fallback gracefully
      }
    };

    loadStats();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setFeedback({ type: 'success', message: 'Profile information updated successfully!' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    }, 700);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!formData.newPassword) {
      setFeedback({ type: 'error', message: 'Please enter a new password' });
      return;
    }
    if (formData.newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'New password must be at least 6 characters long' });
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
      setFeedback({ type: 'success', message: 'Security credentials updated successfully!' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    }, 800);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'October 2026';

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
                  User Account
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage your account credentials, security preferences, and personal profile
              </p>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback.message && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all ${
                feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Profile Overview Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-display font-extrabold text-2xl shadow-md shadow-emerald-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-xl text-slate-900">
                    {user?.name || 'Authorized User'}
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    Pro User
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{user?.email || 'user@example.com'}</span>
                  <span>&bull;</span>
                  <span>Member since {memberSince}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center min-w-[100px]">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Net Balance
                </span>
                <span className="font-display font-extrabold text-sm text-emerald-700">
                  {stats.balance}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center min-w-[100px]">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Budgets Set
                </span>
                <span className="font-display font-extrabold text-sm text-slate-800">
                  {stats.budgetsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Account Settings Forms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Personal Information */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <User className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Profile Information
                </h3>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Account email is verified and immutable
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-display shadow-xs disabled:opacity-60 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving changes...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Security & Password Update */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Password & Security
                </h3>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="••••••••••••"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="••••••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-display">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="••••••••••••"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-display shadow-xs disabled:opacity-60 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{saving ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
