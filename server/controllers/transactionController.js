import Transaction from '../models/Transaction.js';

/**
 * Format currency helper
 */
const formatCurrency = (amount, type) => {
  const formatted = `Rs. ${Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;
  return type === 'income' ? `+${formatted}` : `-${formatted}`;
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
export const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: Number(amount),
      category: category.trim(),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: `${type === 'income' ? 'Income' : 'Expense'} recorded successfully`,
      data: {
        ...transaction.toObject(),
        formattedAmount: formatCurrency(transaction.amount, transaction.type),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all transactions for the authenticated user
 * @route   GET /api/transactions
 * @access  Private
 */
export const getTransactions = async (req, res, next) => {
  try {
    const { type, category, search, month, year, startDate, endDate, page, limit } = req.query;

    // Strict user ownership filter
    const query = { userId: req.user._id };

    // Filter by type (income or expense)
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Search by description or category
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // Filter by month & year or date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    } else if (month !== undefined && year !== undefined) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    // Pagination support (optional)
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const formattedTransactions = transactions.map((tx) => ({
      ...tx.toObject(),
      formattedAmount: formatCurrency(tx.amount, tx.type),
    }));

    res.status(200).json({
      success: true,
      count: formattedTransactions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: formattedTransactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single transaction by ID
 * @route   GET /api/transactions/:id
 * @access  Private
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...transaction.toObject(),
        formattedAmount: formatCurrency(transaction.amount, transaction.type),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
export const updateTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (category) transaction.category = category.trim();
    if (description) transaction.description = description.trim();
    if (date) transaction.date = new Date(date);

    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: {
        ...transaction.toObject(),
        formattedAmount: formatCurrency(transaction.amount, transaction.type),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
