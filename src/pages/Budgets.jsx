import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  X 
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import ActionModal from '../components/common/ActionModal';
import EmptyState from '../components/common/EmptyState';
import { BudgetSkeleton } from '../components/common/Skeleton';
import budgetService from '../services/budgetService';
import { useAuth } from '../context/AuthContext';

const BUDGET_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export default function Budgets() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Current selected month & year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Budget data & loading state
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
  });

  // Fetch budgets from API
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await budgetService.getBudgets({
        month: selectedMonth,
        year: selectedYear,
      });
      setBudgets(response.data || []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load budgets' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      category: 'Food',
      amount: '',
    });
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (b) => {
    setFormData({
      category: b.category,
      amount: b.budget,
    });
    setEditingBudget(b);
    setIsModalOpen(true);
  };

  // Save budget (Create or Update)
  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      const payload = {
        category: formData.category,
        amount: Number(formData.amount),
        month: selectedMonth,
        year: selectedYear,
      };

      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id || editingBudget._id, payload);
        setFeedback({ type: 'success', message: 'Budget updated successfully!' });
      } else {
        await budgetService.createBudget(payload);
        setFeedback({ type: 'success', message: 'Budget target created successfully!' });
      }

      setIsModalOpen(false);
      setEditingBudget(null);
      await fetchBudgets();
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error saving budget target' });
    } finally {
      setModalSubmitting(false);
    }
  };

  // Delete budget
  const handleDeleteBudget = async () => {
    if (!deletingBudget) return;
    setModalSubmitting(true);
    try {
      const id = deletingBudget.id || deletingBudget._id;
      await budgetService.deleteBudget(id);
      setFeedback({ type: 'success', message: 'Budget deleted successfully' });
      setDeletingBudget(null);
      await fetchBudgets();
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting budget' });
    } finally {
      setModalSubmitting(false);
    }
  };

  // Overall budget summary totals
  const totalBudgeted = budgets.reduce((acc, b) => acc + (b.budget || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

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
          
          {/* Header Bar */}
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
                  Budget Management
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Set and control category budget targets and track monthly caps
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Month Selector */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-700 px-2 py-1 focus:outline-none"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <span className="text-slate-300">|</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-700 px-2 py-1 focus:outline-none"
                >
                  {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-display shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Budget</span>
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback.message && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs transition-all ${
                feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedback({ type: '', message: '' })}
                className="p-1 rounded hover:bg-slate-200/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Monthly Budget Summary Banner */}
          {budgets.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-display">
                  {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear} Overview
                </span>
                <h3 className="font-display font-extrabold text-xl">
                  Total Budget: Rs. {totalBudgeted.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-300">
                  Total Spent: <strong className="text-white">Rs. {totalSpent.toLocaleString()}</strong> &bull; Remaining: <strong className="text-emerald-300">Rs. {Math.max(0, totalBudgeted - totalSpent).toLocaleString()}</strong>
                </p>
              </div>

              <div className="min-w-[200px] space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>Overall Usage</span>
                  <span className={overallPercentage >= 100 ? 'text-red-400' : 'text-emerald-400'}>
                    {overallPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      overallPercentage >= 100
                        ? 'bg-red-500'
                        : overallPercentage >= 75
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Budgets Grid / List */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
            {loading ? (
              <BudgetSkeleton />
            ) : budgets.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No category budgets set"
                description={`You haven't established any category budgets for ${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}. Set limits to stay on top of your financial goals.`}
                actionLabel="+ Set Your First Budget"
                onAction={openCreateModal}
                className="py-12"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {budgets.map((b) => {
                  const isOver = b.progress >= 100;
                  const isWarning = b.progress >= 75 && !isOver;

                  return (
                    <div
                      key={b.id || b._id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
                    >
                      {/* Top Row: Category, Status, Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-base text-slate-900">
                            {b.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isOver
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : isWarning
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isOver ? 'Exceeded' : isWarning ? 'Warning' : 'Normal'} ({b.progress}%)
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit Budget"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingBudget(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Budget"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Amounts Display */}
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Spent: <strong className="text-slate-900 font-bold">{b.formattedSpent}</strong>
                        </span>
                        <span className="text-slate-500 font-medium">
                          Target: <strong className="text-slate-900 font-bold">{b.formattedBudget}</strong>
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver
                              ? 'bg-red-500'
                              : isWarning
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(b.progress, 100)}%` }}
                        />
                      </div>

                      {/* Remaining & Status Advice */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-50">
                        <span>
                          {isOver ? (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Over by {b.formattedRemaining?.replace('-', '')}
                            </span>
                          ) : (
                            <span className="text-slate-600">
                              Remaining: <strong className="text-emerald-700">{b.formattedRemaining}</strong>
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {100 - b.progress > 0 ? `${100 - b.progress}% left` : '0% left'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ====================================================================
          CREATE / EDIT BUDGET MODAL
         ==================================================================== */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget Target' : 'Create Category Budget'}
        subtitle={`Set spending cap for ${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`}
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              disabled={!!editingBudget}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Limit (Rs.)
            </label>
            <input
              type="number"
              placeholder="15000"
              required
              min="1"
              step="any"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBudget(null);
              }}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalSubmitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs disabled:opacity-60 transition-colors"
            >
              {modalSubmitting
                ? 'Saving...'
                : editingBudget
                ? 'Update Budget'
                : 'Save Budget'}
            </button>
          </div>
        </form>
      </ActionModal>

      {/* ====================================================================
          DELETE CONFIRMATION MODAL
         ==================================================================== */}
      <ActionModal
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        title="Delete Budget Target"
        subtitle="Are you sure you want to remove this category budget?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Removing the budget target for{' '}
            <strong className="text-slate-900">"{deletingBudget?.category}"</strong>{' '}
            will remove spending thresholds for this category in{' '}
            {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeletingBudget(null)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={modalSubmitting}
              onClick={handleDeleteBudget}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs disabled:opacity-60 transition-colors"
            >
              {modalSubmitting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </ActionModal>

    </div>
  );
}
