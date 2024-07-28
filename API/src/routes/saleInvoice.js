import express from 'express';
import { deleteSaleInvoice, addUpdateSaleInvoice, getAllSaleInvoice, getAllSaleInvoiceWithoutPaginate, getAllSaleInvoiceByProjectId, getSaleInvoiceByProjectId, getTotalAmountSIByProjectId, deleteInvoiceDocument, updateInvoiceDocuments } from '../controllers/saleInvoice.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllSaleInvoice)
.post(verifyJwtToken, authorize(), addUpdateSaleInvoice);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteSaleInvoice)
.put(verifyJwtToken, authorize(), addUpdateSaleInvoice);

router.route('/all')
.get(getAllSaleInvoiceWithoutPaginate)

router.route('/getAllByProjectId')
.get(getAllSaleInvoiceByProjectId)

router.route('/getByProjectId')
.get(getSaleInvoiceByProjectId)

router.route('/getTotalAmountSIByProjectId')
.get(getTotalAmountSIByProjectId)

router.route('/deleteInvoiceDocument')
.get(deleteInvoiceDocument)

router.route('/updateInvoiceDocuments')
.get(updateInvoiceDocuments)

export default router;