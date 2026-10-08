import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  UtensilsCrossed, 
  Briefcase, 
  Bus, 
  ShoppingCart, 
  Laptop, 
  Receipt,
  Tag,
  ArrowRight,
  ReceiptText
} from 'lucide-react';
import EmptyState from '../common/EmptyState';

// Helper icon mapping
const getCategoryIcon = (iconName, category) => {
  switch (iconName || category) {
    case 'UtensilsCrossed':
    case 'Food':
      return UtensilsCrossed;
    case 'Briefcase':
    case 'Salary':
      return Briefcase;
    case 'Bus':
    case 'Transport':
      return Bus;
    case 'ShoppingCart':
    case 'Shopping':
      return ShoppingCart;
    case 'Laptop':
    case 'Freelance':
      return Laptop;
    case 'Receipt':
    case 'Bills':
      return Receipt;
    default:
      return Tag;
  }
};

export default function RecentTransactions({
  transactions = [],
  onAddTransaction,
}) {
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
            Recent Transactions
          </h3>
          <p className="text-xs text-slate-500">Your latest financial activity</p>
        </div>

        {hasTransactions && (
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors font-display"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Transactions List or Empty State */}
      {!hasTransactions ? (
        <EmptyState
          icon={ReceiptText}
          title="No transactions yet"
          description="Start by adding your first income or expense to track your daily cash flow."
          actionLabel="+ Add Transaction"
          onAction={onAddTransaction}
          className="my-auto py-8"
        />
      ) : (
        <div className="space-y-3 divide-y divide-slate-100/80">
          {transactions.map((tx) => {
            const IconComponent = getCategoryIcon(tx.iconName, tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="pt-3 first:pt-0 flex items-center justify-between gap-3 group hover:bg-slate-50/80 p-1.5 -mx-1.5 rounded-xl transition-colors"
              >
                {/* Left: Category Icon & Metadata */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-slate-900 truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{tx.date}</span>
                      <span>&bull;</span>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Badge */}
                <div className="text-right shrink-0">
                  <div
                    className={`font-display font-extrabold text-sm sm:text-base ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.formattedAmount}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isIncome ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {isIncome ? 'Income' : 'Expense'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Link (Mobile prominent) */}
      {hasTransactions && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-center sm:hidden">
          <Link
            to="/transactions"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            View all transactions &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
