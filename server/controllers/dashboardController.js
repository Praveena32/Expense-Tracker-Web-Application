import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { calculateBudgetProgress } from './budgetController.js';

const CATEGORY_COLORS = {
  Food: '#10B981',
  Transport: '#3B82F6',
  Shopping: '#8B5CF6',
  Bills: '#F59E0B',
  Entertainment: '#EC4899',
  Health: '#06B6D4',
  Education: '#6366F1',
  'Emergency Fund': '#EF4444',
  'Emergency': '#EF4444',
  'Savings (Deposit)': '#14B8A6',
  'Save (Deposit)': '#14B8A6',
  'Loan Settlements': '#F97316',
  Salary: '#10B981',
  Freelance: '#3B82F6',
  Investments: '#8B5CF6',
  Bonus: '#F59E0B',
  Other: '#64748B',
};

const DEFAULT_COLOR = '#64748B';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * @desc    Get dashboard metrics, charts, and recent activity
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // 1. Calculate Total Income & Total Expenses across all transactions
    const totalsAggregation = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncomeAmount = 0;
    let totalExpenseAmount = 0;

    totalsAggregation.forEach((item) => {
      if (item._id === 'income') totalIncomeAmount = item.total;
      if (item._id === 'expense') totalExpenseAmount = item.total;
    });

    const currentBalanceAmount = totalIncomeAmount - totalExpenseAmount;

    // 2. Monthly Budget Progress (Sum of all budgets for current month)
    const currentMonthBudgets = await Budget.find({
      userId,
      month: currentMonth,
      year: currentYear,
    });

    const calculatedBudgets = await Promise.all(
      currentMonthBudgets.map((b) => calculateBudgetProgress(userId, b))
    );

    const totalBudgetCap = calculatedBudgets.reduce((acc, b) => acc + b.budget, 0);
    const totalBudgetSpent = calculatedBudgets.reduce((acc, b) => acc + b.spent, 0);
    const budgetPercentage =
      totalBudgetCap > 0 ? Math.round((totalBudgetSpent / totalBudgetCap) * 100) : 0;

    // 3. Expense by Category (calculated from expense transactions)
    const expenseByCategoryAggregation = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
        },
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const expenseByCategory = expenseByCategoryAggregation.map((cat, index) => {
      const percentage =
        totalExpenseAmount > 0
          ? parseFloat(((cat.amount / totalExpenseAmount) * 100).toFixed(1))
          : 0;
      return {
        name: cat._id,
        amount: cat.amount,
        formatted: `Rs. ${cat.amount.toLocaleString('en-IN')}`,
        color: CATEGORY_COLORS[cat._id] || DEFAULT_COLOR,
        percentage,
      };
    });

    // 4. Income vs Expenses Monthly (Past 6 months trend for bar chart)
    const past6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      past6Months.push({
        monthName: MONTH_NAMES[d.getMonth()],
        month: m,
        year: y,
      });
    }

    const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);
    const monthlyTrendAggregation = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const incomeVsExpensesMonthly = past6Months.map((slot) => {
      let income = 0;
      let expenses = 0;
      monthlyTrendAggregation.forEach((record) => {
        if (record._id.year === slot.year && record._id.month === slot.month) {
          if (record._id.type === 'income') income = record.total;
          if (record._id.type === 'expense') expenses = record.total;
        }
      });
      return {
        month: slot.monthName,
        income,
        expenses,
      };
    });

    // 5. Recent Transactions (limit to 6)
    const recentTxDocs = await Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(6);

    const recentTransactions = recentTxDocs.map((tx) => {
      const d = new Date(tx.date);
      const formattedDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
      const formattedTime = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      return {
        id: tx._id,
        _id: tx._id,
        description: tx.description,
        category: tx.category,
        date: formattedDate,
        time: formattedTime,
        type: tx.type,
        amount: tx.amount,
        formattedAmount:
          tx.type === 'income'
            ? `+Rs. ${tx.amount.toLocaleString('en-IN')}`
            : `-Rs. ${tx.amount.toLocaleString('en-IN')}`,
        iconName: tx.category,
      };
    });

    // Time of day greeting
    const hour = now.getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';

    // Summary payload structured for immediate consumption by Dashboard
    const responsePayload = {
      user: {
        id: req.user._id,
        name: req.user.name,
        greeting,
        email: req.user.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          req.user.name
        )}&background=10B981&color=fff&bold=true`,
        plan: 'Pro User',
        notificationsCount: calculatedBudgets.filter((b) => b.status === 'exceeded').length,
      },
      summary: {
        totalIncome: {
          amount: totalIncomeAmount,
          formatted: `Rs. ${totalIncomeAmount.toLocaleString('en-IN')}`,
          change: 'Updated',
          timeframe: 'total recorded',
          trend: 'up',
          type: 'income',
        },
        totalExpenses: {
          amount: totalExpenseAmount,
          formatted: `Rs. ${totalExpenseAmount.toLocaleString('en-IN')}`,
          change: 'Updated',
          timeframe: 'total recorded',
          trend: totalExpenseAmount > 0 ? 'up' : 'neutral',
          type: 'expense',
        },
        currentBalance: {
          amount: currentBalanceAmount,
          formatted: `Rs. ${currentBalanceAmount.toLocaleString('en-IN')}`,
          change: 'Available',
          timeframe: 'Net balance',
          trend: currentBalanceAmount >= 0 ? 'neutral' : 'warning',
          type: 'balance',
        },
        monthlyBudget: {
          amount: totalBudgetCap,
          formatted: `Rs. ${totalBudgetCap.toLocaleString('en-IN')}`,
          spent: totalBudgetSpent,
          percentage: budgetPercentage,
          supporting: `${budgetPercentage}% used`,
          trend: budgetPercentage >= 100 ? 'warning' : 'neutral',
          type: 'budget',
        },
      },
      expenseByCategory,
      incomeVsExpensesMonthly,
      recentTransactions,
      budgetProgress: calculatedBudgets,
    };

    res.status(200).json({
      success: true,
      data: responsePayload,
    });
  } catch (error) {
    next(error);
  }
};
