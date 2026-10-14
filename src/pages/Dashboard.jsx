import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Calendar,
  Download
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import SummaryCard from '../components/dashboard/SummaryCard';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import QuickActions from '../components/dashboard/QuickActions';
import ActionModal from '../components/common/ActionModal';
import { 
  CardSkeleton, 
  ChartSkeleton, 
  TransactionsSkeleton, 
  BudgetSkeleton 
} from '../components/common/Skeleton';
import { mockDashboardData, emptyDashboardData } from '../data/dashboardData';
import dashboardService from '../services/dashboardService';
import transactionService from '../services/transactionService';
import budgetService from '../services/budgetService';

export default function Dashboard() {
  // Navigation & Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Backend Data & Loading State
  const [dashboardData, setDashboardData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // UI Inspection & Simulation Mode: 'normal' | 'empty' | 'loading'
  const [viewState, setViewState] = useState('normal');

  // Quick Action Modals State
  const [activeModal, setActiveModal] = useState(null); // 'expense' | 'income' | 'budget' | null
  const [modalFeedback, setModalFeedback] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Modal Form States
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: 'Food' });
  const [incomeForm, setIncomeForm] = useState({ description: '', amount: '', category: 'Salary' });
  const [budgetForm, setBudgetForm] = useState({ category: 'Food', amount: '' });

  // Fetch real data from backend API
  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboardData();
      if (data) {
        setDashboardData(data);
      }
    } catch (err) {
      console.warn('Dashboard API call error, falling back to mock view:', err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Choose data according to view state
  const activeData = dashboardData || mockDashboardData;
  const currentData = viewState === 'empty' ? emptyDashboardData : activeData;
  const isLoading = viewState === 'loading' || (initialLoading && !dashboardData);

  // Modal Submit Handlers calling real backend APIs
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      await transactionService.createTransaction({
        type: 'expense',
        description: expenseForm.description.trim(),
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
      });
      setModalFeedback('Expense recorded successfully!');
      setExpenseForm({ description: '', amount: '', category: 'Food' });
      await loadDashboardData();
      setTimeout(() => {
        setModalFeedback('');
        setActiveModal(null);
      }, 1000);
    } catch (err) {
      setModalFeedback(`Error: ${err.message}`);
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      await transactionService.createTransaction({
        type: 'income',
        description: incomeForm.description.trim(),
        amount: Number(incomeForm.amount),
        category: incomeForm.category,
      });
      setModalFeedback('Income recorded successfully!');
      setIncomeForm({ description: '', amount: '', category: 'Salary' });
      await loadDashboardData();
      setTimeout(() => {
        setModalFeedback('');
        setActiveModal(null);
      }, 1000);
    } catch (err) {
      setModalFeedback(`Error: ${err.message}`);
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      await budgetService.createBudget({
        category: budgetForm.category,
        amount: Number(budgetForm.amount),
      });
      setModalFeedback('Monthly budget saved successfully!');
      setBudgetForm({ category: 'Food', amount: '' });
      await loadDashboardData();
      setTimeout(() => {
        setModalFeedback('');
        setActiveModal(null);
      }, 1000);
    } catch (err) {
      setModalFeedback(`Error: ${err.message}`);
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <Topbar
          user={currentData.user}
          onMobileMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Dashboard Scrollable Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Dashboard Control Bar & Interactive State Switcher */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Quick Actions */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-display">
                Quick Actions
              </span>
              <QuickActions
                onAddExpense={() => setActiveModal('expense')}
                onAddIncome={() => setActiveModal('income')}
                onSetBudget={() => setActiveModal('budget')}
              />
            </div>

            {/* Right: UI Sandbox Switcher */}
            <div className="flex flex-col sm:items-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5 font-display">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Preview Mode:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold" role="group">
                <button
                  type="button"
                  onClick={() => setViewState('normal')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewState === 'normal'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Active Data
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('loading')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewState === 'loading'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Loading Skeletons
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('empty')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewState === 'empty'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Empty States
                </button>
              </div>
            </div>
          </div>

          {/* ====================================================================
              SECTION 1: Summary Cards (4 Cards)
             ==================================================================== */}
          <section aria-label="Financial Summary Cards">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
                  {/* Total Income Card */}
                  <SummaryCard
                    title="Total Income"
                    amount={currentData.summary.totalIncome.formatted}
                    supportingText={`${currentData.summary.totalIncome.change} ${currentData.summary.totalIncome.timeframe}`}
                    change={currentData.summary.totalIncome.change}
                    type="income"
                  />

                  {/* Total Expenses Card */}
                  <SummaryCard
                    title="Total Expenses"
                    amount={currentData.summary.totalExpenses.formatted}
                    supportingText={`${currentData.summary.totalExpenses.change} ${currentData.summary.totalExpenses.timeframe}`}
                    change={currentData.summary.totalExpenses.change}
                    type="expense"
                  />

                  {/* Current Balance Card */}
                  <SummaryCard
                    title="Current Balance"
                    amount={currentData.summary.currentBalance.formatted}
                    supportingText={currentData.summary.currentBalance.timeframe}
                    change={currentData.summary.currentBalance.change}
                    type="balance"
                  />

                  {/* Monthly Budget Card */}
                  <SummaryCard
                    title="Monthly Budget"
                    amount={currentData.summary.monthlyBudget.formatted}
                    supportingText={currentData.summary.monthlyBudget.supporting}
                    type="budget"
                    progress={currentData.summary.monthlyBudget.percentage}
                  />
                </>
              )}
            </div>
          </section>

          {/* ====================================================================
              SECTION 2: Charts (Expense Overview Donut & Income vs Expense Bar)
             ==================================================================== */}
          <section aria-label="Financial Visualizations and Charts">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Expense by Category (Donut Chart) */}
              <div className="lg:col-span-5 min-h-[380px]">
                {isLoading ? (
                  <ChartSkeleton title="Expense Overview" />
                ) : (
                  <ExpenseChart
                    data={currentData.expenseByCategory}
                    onAddExpense={() => setActiveModal('expense')}
                  />
                )}
              </div>

              {/* Income vs Expenses (Monthly Bar Chart) */}
              <div className="lg:col-span-7 min-h-[380px]">
                {isLoading ? (
                  <ChartSkeleton title="Income vs Expenses" />
                ) : (
                  <IncomeExpenseChart
                    data={currentData.incomeVsExpensesMonthly}
                    onAddIncome={() => setActiveModal('income')}
                  />
                )}
              </div>
            </div>
          </section>

          {/* ====================================================================
              SECTION 3: Recent Transactions & Budget Progress
             ==================================================================== */}
          <section aria-label="Transactions and Budget Trajectory">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Recent Transactions List */}
              <div className="lg:col-span-7">
                {isLoading ? (
                  <TransactionsSkeleton />
                ) : (
                  <RecentTransactions
                    transactions={currentData.recentTransactions}
                    onAddTransaction={() => setActiveModal('expense')}
                  />
                )}
              </div>

              {/* Budget Progress Meter */}
              <div className="lg:col-span-5">
                {isLoading ? (
                  <BudgetSkeleton />
                ) : (
                  <BudgetProgress
                    budgets={currentData.budgetProgress}
                    onSetBudget={() => setActiveModal('budget')}
                  />
                )}
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ====================================================================
          QUICK ACTION MODALS (Real API-Connected Forms)
         ==================================================================== */}
      {/* 1. Add Expense Modal */}
      <ActionModal
        isOpen={activeModal === 'expense'}
        onClose={() => { setActiveModal(null); setModalFeedback(''); }}
        title="Add New Expense"
        subtitle="Record an expenditure against your category limits"
      >
        {modalFeedback ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{modalFeedback}</span>
          </div>
        ) : (
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. Grocery store, Uber ride"
                required
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (Rs.)</label>
                <input
                  type="number"
                  placeholder="2500"
                  required
                  min="0.01"
                  step="any"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                  <option>Health</option>
                  <option>Education</option>
                </select>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setActiveModal(null); setModalFeedback(''); }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {modalSubmitting ? 'Recording...' : 'Record Expense'}
              </button>
            </div>
          </form>
        )}
      </ActionModal>

      {/* 2. Add Income Modal */}
      <ActionModal
        isOpen={activeModal === 'income'}
        onClose={() => { setActiveModal(null); setModalFeedback(''); }}
        title="Add New Income"
        subtitle="Log income stream, salary deposit, or dividend"
      >
        {modalFeedback ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{modalFeedback}</span>
          </div>
        ) : (
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source / Description</label>
              <input
                type="text"
                placeholder="e.g. Monthly Salary, Freelance retainer"
                required
                value={incomeForm.description}
                onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (Rs.)</label>
                <input
                  type="number"
                  placeholder="50000"
                  required
                  min="0.01"
                  step="any"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={incomeForm.category}
                  onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Investments</option>
                  <option>Bonus</option>
                </select>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setActiveModal(null); setModalFeedback(''); }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {modalSubmitting ? 'Recording...' : 'Record Income'}
              </button>
            </div>
          </form>
        )}
      </ActionModal>

      {/* 3. Set Budget Modal */}
      <ActionModal
        isOpen={activeModal === 'budget'}
        onClose={() => { setActiveModal(null); setModalFeedback(''); }}
        title="Set Budget Limit"
        subtitle="Establish monthly expenditure cap per category"
      >
        {modalFeedback ? (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{modalFeedback}</span>
          </div>
        ) : (
          <form onSubmit={handleBudgetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Health</option>
                <option>Education</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Limit (Rs.)</label>
              <input
                type="number"
                placeholder="15000"
                required
                min="1"
                step="any"
                value={budgetForm.amount}
                onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setActiveModal(null); setModalFeedback(''); }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalSubmitting}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {modalSubmitting ? 'Saving...' : 'Save Budget'}
              </button>
            </div>
          </form>
        )}
      </ActionModal>

    </div>
  );
}
