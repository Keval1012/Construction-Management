import express from 'express';
import { deletePurchaseOrder, addUpdatePurchaseOrder, getAllPurchaseOrder, getAllPurchaseOrderWithoutPaginate, getAllPurchaseOrderByProjectId, getPurchaseOrderByProjectId, getTotalAmountPOByProjectId } from '../controllers/purchaseOrder.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllPurchaseOrder)
.post(verifyJwtToken, authorize(), addUpdatePurchaseOrder);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deletePurchaseOrder)
.put(verifyJwtToken, authorize(), addUpdatePurchaseOrder);

router.route('/all')
.get(getAllPurchaseOrderWithoutPaginate)

router.route('/getAllByProjectId')
.get(getAllPurchaseOrderByProjectId)

router.route('/getByProjectId')
.get(getPurchaseOrderByProjectId)

router.route('/getTotalAmountPOByProjectId')
.get(getTotalAmountPOByProjectId)

export default router;