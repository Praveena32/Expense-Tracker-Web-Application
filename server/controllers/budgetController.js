import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

/**
 * Helper to calculate actual spending against a budget for a given month and year
 */
export const calculateBudgetProgress = async (userId, budgetDoc) => {
  const month = budgetDoc.month;
  const year = budgetDoc.year;

  // Compute month start and end dates
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  // Aggregate actual expense transactions for this user & category in this month
  const expenseAggregation = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'expense',
        category: { $regex: new RegExp(`^${budgetDoc.category}$`, 'i') },
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: '$amount' },
      },
    },
  ]);

  const spent = expenseAggregation.length > 0 ? expenseAggregation[0].totalSpent : 0;
  const budgetAmount = budgetDoc.amount;
  const remaining = budgetAmount - spent;
  const progressPercent = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;

  let status = 'normal';
  let color = '#10B981';
  if (progressPercent >= 100) {
    status = 'exceeded';
    color = '#EF4444';
  } else if (progressPercent >= 75) {
    status = 'warning';
    color = '#F59E0B';
  }

  return {
    id: budgetDoc._id,
    _id: budgetDoc._id,
    category: budgetDoc.category,
    month: budgetDoc.month,
    year: budgetDoc.year,
    budget: budgetAmount,
    spent,
    remaining,
    progress: progressPercent,
    status,
    color,
    formattedBudget: `Rs. ${budgetAmount.toLocaleString('en-IN')}`,
    formattedSpent: `Rs. ${spent.toLocaleString('en-IN')}`,
    formattedRemaining:
      remaining >= 0
        ? `Rs. ${remaining.toLocaleString('en-IN')}`
        : `-Rs. ${Math.abs(remaining).toLocaleString('en-IN')}`,
    createdAt: budgetDoc.createdAt,
    updatedAt: budgetDoc.updatedAt,
  };
};

/**
 * @desc    Create or upsert a category budget
 * @route   POST /api/budgets
 * @access  Private
 */
export const createBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    const now = new Date();
    const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();

    // Upsert budget if already exists for this category/month/year
    const budget = await Budget.findOneAndUpdate(
      {
        userId: req.user._id,
        category: category.trim(),
        month: targetMonth,
        year: targetYear,
      },
      {
        amount: Number(amount),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    const calculated = await calculateBudgetProgress(req.user._id, budget);

    res.status(201).json({
      success: true,
      message: 'Budget saved successfully',
      data: calculated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all budgets with calculated progress for authenticated user
 * @route   GET /api/budgets
 * @access  Private
 */
export const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const now = new Date();
    const query = { userId: req.user._id };

    if (month !== undefined) {
      query.month = parseInt(month, 10);
    } else {
      query.month = now.getMonth() + 1; // Default to current month
    }

    if (year !== undefined) {
      query.year = parseInt(year, 10);
    } else {
      query.year = now.getFullYear(); // Default to current year
    }

    const budgets = await Budget.find(query).sort({ category: 1 });

    const calculatedBudgets = await Promise.all(
      budgets.map((b) => calculateBudgetProgress(req.user._id, b))
    );

    res.status(200).json({
      success: true,
      count: calculatedBudgets.length,
      data: calculatedBudgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single budget with progress
 * @route   GET /api/budgets/:id
 * @access  Private
 */
export const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    const calculated = await calculateBudgetProgress(req.user._id, budget);

    res.status(200).json({
      success: true,
      data: calculated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a budget
 * @route   PUT /api/budgets/:id
 * @access  Private
 */
export const updateBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    if (category) budget.category = category.trim();
    if (amount !== undefined) budget.amount = Number(amount);
    if (month !== undefined) budget.month = parseInt(month, 10);
    if (year !== undefined) budget.year = parseInt(year, 10);

    await budget.save();

    const calculated = await calculateBudgetProgress(req.user._id, budget);

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: calculated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a budget
 * @route   DELETE /api/budgets/:id
 * @access  Private
 */
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
