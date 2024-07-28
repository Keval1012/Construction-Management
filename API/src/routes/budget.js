import express from 'express';
import { deleteBudget, addUpdateBudget, getAllBudget, getAllBudgetWithoutPaginate, getAllBudgetByProjectId, getAllBudgetByProjectAndCategoryGroup, getBudgetByProjectId, getBudgetByProjectAndCategoryGroup } from '../controllers/budget.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllBudget)
.post(verifyJwtToken, authorize(), addUpdateBudget);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteBudget)
.put(verifyJwtToken, authorize(), addUpdateBudget);

router.route('/all')
.get(getAllBudgetWithoutPaginate)

router.route('/getAllByProjectId')
.get(getAllBudgetByProjectId)

router.route('/getByProjectId')
.get(getBudgetByProjectId)

router.route('/getBudgetByProjectAndCategoryGroup')
.get(getBudgetByProjectAndCategoryGroup)

router.route('/getAllBudgetByProjectAndCategoryGroup')
.get(getAllBudgetByProjectAndCategoryGroup)

export default router;