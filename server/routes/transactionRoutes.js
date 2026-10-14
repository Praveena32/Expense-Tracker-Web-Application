import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateTransaction } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All transaction routes are protected
router.use(protect);

router.route('/')
  .post(validateTransaction, createTransaction)
  .get(getTransactions);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
