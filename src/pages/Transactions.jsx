import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  ReceiptText,
  Calendar,
  X
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import ActionModal from '../components/common/ActionModal';
import EmptyState from '../components/common/EmptyState';
import { TransactionsSkeleton } from '../components/common/Skeleton';
import transactionService from '../services/transactionService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Emergency',
  'Savings (Deposit)',
  'Loan Settlements',
  'Salary',
  'Freelance',
  'Investments',
  'Bonus',
  'Other',
];

export default function Transactions() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Transaction list state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await transactionService.getTransactions(params);
      setTransactions(response.data || []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load transactions' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, categoryFilter]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Create Modal
  const openCreateModal = (defaultType = 'expense') => {
    setFormData({
      type: defaultType,
      description: '',
      amount: '',
      category: defaultType === 'income' ? 'Salary' : 'Food',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (tx) => {
    const d = tx.date ? new Date(tx.date).toISOString().split('T')[0] : '';
    setFormData({
      type: tx.type,
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      date: d,
    });
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  // Submit Add or Edit
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      const payload = {
        type: formData.type,
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
      };

      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction._id || editingTransaction.id, payload);
        setFeedback({ type: 'success', message: 'Transaction updated successfully!' });
      } else {
        await transactionService.createTransaction(payload);
        setFeedback({ type: 'success', message: 'Transaction recorded successfully!' });
      }

      setIsAddModalOpen(false);
      setEditingTransaction(null);
      await fetchTransactions();

      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error saving transaction' });
    } finally {
      setModalSubmitting(false);
    }
  };

  // Confirm and Delete
  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;
    setModalSubmitting(true);
    try {
      const id = deletingTransaction._id || deletingTransaction.id;
      await transactionService.deleteTransaction(id);
      setFeedback({ type: 'success', message: 'Transaction deleted successfully' });
      setDeletingTransaction(null);
      await fetchTransactions();
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting transaction' });
    } finally {
      setModalSubmitting(false);
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!transactions.length) return;
    const headers = ['Date,Type,Category,Description,Amount (Rs.)'];
    const rows = transactions.map((tx) => {
      const date = new Date(tx.date).toLocaleDateString();
      const desc = `"${(tx.description || '').replace(/"/g, '""')}"`;
      return `${date},${tx.type},${tx.category},${desc},${tx.amount}`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          
          {/* Top Header Bar */}
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
                  All Transactions
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Detailed transaction records, search, filter, and management
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={transactions.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold font-display shadow-xs hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => openCreateModal('expense')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-display shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>

          {/* Toast / Feedback Banner */}
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

          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by description or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9.5 pr-4 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters Right Section */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type Filter Buttons */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold" role="group">
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    typeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('income')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    typeFilter === 'income'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('expense')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    typeFilter === 'expense'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Expense
                </button>
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 px-3 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
            {loading ? (
              <TransactionsSkeleton />
            ) : transactions.length === 0 ? (
              <EmptyState
                icon={ReceiptText}
                title="No transactions found"
                description={
                  searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
                    ? 'No transactions matched your current filters. Try resetting or adjusting your search.'
                    : 'Start by adding your first transaction to record income and monitor your expenses.'
                }
                actionLabel="+ Add Transaction"
                onAction={() => openCreateModal('expense')}
                className="py-12"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                      <th className="pb-3 pl-2">Transaction</th>
                      <th className="pb-3 hidden sm:table-cell">Category</th>
                      <th className="pb-3 hidden md:table-cell">Date</th>
                      <th className="pb-3 text-right">Amount</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 text-sm">
                    {transactions.map((tx) => {
                      const isIncome = tx.type === 'income';
                      const txDate = tx.date
                        ? new Date(tx.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—';

                      return (
                        <tr
                          key={tx._id || tx.id}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Description & Icon */}
                          <td className="py-3.5 pl-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  isIncome
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                                }`}
                              >
                                {isIncome ? (
                                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-display font-bold text-slate-900 truncate">
                                  {tx.description}
                                </p>
                                <div className="sm:hidden flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                  <span>{tx.category}</span>
                                  <span>&bull;</span>
                                  <span>{txDate}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category Badge */}
                          <td className="py-3.5 hidden sm:table-cell">
                            <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                              {tx.category}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 hidden md:table-cell text-xs text-slate-500 font-medium">
                            {txDate}
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 text-right font-display font-extrabold whitespace-nowrap">
                            <span
                              className={isIncome ? 'text-emerald-600' : 'text-slate-900'}
                            >
                              {tx.formattedAmount || (isIncome ? `+Rs. ${Number(tx.amount).toLocaleString()}` : `-Rs. ${Number(tx.amount).toLocaleString()}`)}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 pr-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(tx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Edit Transaction"
                                aria-label="Edit Transaction"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingTransaction(tx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Transaction"
                                aria-label="Delete Transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ====================================================================
          ADD / EDIT TRANSACTION MODAL
         ==================================================================== */}
      <ActionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        subtitle={
          editingTransaction
            ? 'Update transaction amount, details, or category'
            : 'Record an income stream or expenditure in your records'
        }
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4">
          {/* Type Toggle: Income vs Expense */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="e.g. Grocery store, Client deposit"
              required
              value={formData.description}
              onChange={handleFormChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount (Rs.)
              </label>
              <input
                type="number"
                name="amount"
                placeholder="2500"
                required
                min="0.01"
                step="any"
                value={formData.amount}
                onChange={handleFormChange}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleFormChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingTransaction(null);
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
                : editingTransaction
                ? 'Update Transaction'
                : 'Save Transaction'}
            </button>
          </div>
        </form>
      </ActionModal>

      {/* ====================================================================
          DELETE CONFIRMATION MODAL
         ==================================================================== */}
      <ActionModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        title="Delete Transaction"
        subtitle="Are you sure you want to permanently remove this transaction?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This action cannot be undone. The entry for{' '}
            <strong className="text-slate-900">
              "{deletingTransaction?.description}"
            </strong>{' '}
            ({deletingTransaction?.formattedAmount || `Rs. ${deletingTransaction?.amount}`})
            will be removed from your records.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeletingTransaction(null)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={modalSubmitting}
              onClick={handleDeleteTransaction}
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
