import express from 'express';
import { deleteBudgetCategory, addUpdateBudgetCategory, getAllBudgetCategory, getAllBudgetCategoryWithoutPaginate } from '../controllers/budgetCategory.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllBudgetCategory)
.post(verifyJwtToken, authorize(), addUpdateBudgetCategory);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteBudgetCategory)
.put(verifyJwtToken, authorize(), addUpdateBudgetCategory);

router.route('/all')
.get(getAllBudgetCategoryWithoutPaginate)

export default router;