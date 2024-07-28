import express from 'express';
import { deleteTax, addUpdateTax, getAllTax, getAllTaxWithoutPaginate } from '../controllers/tax.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllTax)
.post(verifyJwtToken, authorize(), addUpdateTax);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteTax)
.put(verifyJwtToken, authorize(), addUpdateTax);

router.route('/all')
.get(getAllTaxWithoutPaginate)

export default router;