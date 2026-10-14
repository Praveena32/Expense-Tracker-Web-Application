import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton } from './Skeleton';

/**
 * ProtectedRoute: Requires active user authentication
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
            <span className="font-display font-bold text-slate-800 text-sm">
              Verifying session...
            </span>
          </div>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * PublicRoute: For Login / Register pages.
 * If user is already authenticated, redirect to /dashboard.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
