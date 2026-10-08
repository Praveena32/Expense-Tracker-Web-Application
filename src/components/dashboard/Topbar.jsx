import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  CheckCheck,
  ShieldCheck 
} from 'lucide-react';

export default function Topbar({ user, onMobileMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left Section: Mobile Menu Trigger + Title & Greeting */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-tight">
                Dashboard
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Live Overview
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {user?.greeting || 'Good morning'}, <span className="font-semibold text-slate-800">{user?.name || 'John'}</span> 👋 &mdash; Here's your financial overview.
            </p>
          </div>
        </div>

        {/* Right Section: Notification & User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Notification Button & Flyout */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Notifications (${user?.notificationsCount || 0} unread)`}
              aria-expanded={notificationsOpen}
            >
              <Bell className="w-5 h-5" />
              {user?.notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 animate-fadeIn">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-slate-900">Notifications</span>
                  <span className="text-[11px] font-semibold text-emerald-600 cursor-pointer hover:underline flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </span>
                </div>
                <div className="py-2 divide-y divide-slate-50 max-h-64 overflow-y-auto">
                  <div className="px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-slate-800">Monthly budget exceeded in Shopping</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">110% spent of Rs. 12,000 budget &bull; 2h ago</p>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-slate-800">Salary payment received</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">+Rs. 100,000 deposited &bull; Yesterday</p>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-slate-800">Weekly spending digest ready</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">You saved 18% more than last week &bull; 3d ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="User account menu"
              aria-expanded={dropdownOpen}
            >
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user?.name || 'User avatar'}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                  {user?.name || 'John'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold leading-tight">
                  {user?.plan || 'Pro User'}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            {/* Account Menu Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'John'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'john@expensetracker.io'}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); alert('Profile details modal'); }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>View Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); alert('Security & Account settings'); }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & Preferences</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
