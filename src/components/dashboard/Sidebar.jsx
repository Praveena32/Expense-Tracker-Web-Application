import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  X 
} from 'lucide-react';

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ReceiptText },
    { label: 'Budgets', path: '/budgets', icon: PieChart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Brand & Toggle Header */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col animate-fadeIn">
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight whitespace-nowrap leading-tight">
                  Expense Tracker
                </span>
                <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">
                  PRO FINANCE
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          {mobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          {(!collapsed || mobileOpen) && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-display">
              Main Menu
            </span>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-150 group
                    ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }
                    ${collapsed && !mobileOpen ? 'justify-center px-2' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      {(!collapsed || mobileOpen) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Footer Section: Settings & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        {(!collapsed || mobileOpen) && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-display">
            Preferences
          </span>
        )}

        <button
          type="button"
          onClick={() => alert('Settings placeholder modal')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-sm text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors group ${
            collapsed && !mobileOpen ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Settings' : undefined}
          aria-label="Account Settings"
        >
          <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Settings</span>}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group ${
            collapsed && !mobileOpen ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
          aria-label="Logout of session"
        >
          <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 lg:hidden transform transition-transform duration-250 ease-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {navContent}
      </aside>

      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200/90 h-screen sticky top-0 transition-all duration-250 shrink-0 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        aria-label="Sidebar Navigation"
      >
        {navContent}
      </aside>
    </>
  );
}
