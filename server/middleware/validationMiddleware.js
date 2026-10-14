/**
 * Validation Middleware Helpers
 */

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateTransaction = (req, res, next) => {
  const { type, amount, category, description, date } = req.body;
  const errors = [];

  if (!type || !['income', 'expense'].includes(type)) {
    errors.push('Transaction type must be either "income" or "expense"');
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    errors.push('Amount must be a positive number greater than 0');
  }

  if (!category || !String(category).trim()) {
    errors.push('Category is required');
  }

  if (!description || !String(description).trim()) {
    errors.push('Description is required');
  }

  if (date && isNaN(Date.parse(date))) {
    errors.push('Provided date is invalid');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateBudget = (req, res, next) => {
  const { category, amount, month, year } = req.body;
  const errors = [];

  if (!category || !String(category).trim()) {
    errors.push('Category is required');
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    errors.push('Budget amount must be a positive number greater than 0');
  }

  if (month !== undefined) {
    const numMonth = Number(month);
    if (isNaN(numMonth) || numMonth < 1 || numMonth > 12) {
      errors.push('Month must be a number between 1 and 12');
    }
  }

  if (year !== undefined) {
    const numYear = Number(year);
    if (isNaN(numYear) || numYear < 2000) {
      errors.push('Year must be a valid 4-digit year (2000 or later)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
