import express from 'express';
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateBudget } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All budget routes are protected
router.use(protect);

router.route('/')
  .post(validateBudget, createBudget)
  .get(getBudgets);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

export default router;
