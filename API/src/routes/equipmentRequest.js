import express from 'express';
import { deleteEquipmentRequest, addUpdateEquipmentRequest, getAllEquipmentRequest, getAllEquipmentRequestWithoutPaginate, getEquipmentRequestsByStatusWithoutPaginate, getEquipmentRequestsByStatus, updateEqptReqDocuments, changeStatusOfEqptReq } from '../controllers/equipmentRequest.js';
import { authorize, verifyJwtToken } from '../helper.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllEquipmentRequest)
.post(verifyJwtToken, authorize(), addUpdateEquipmentRequest);

router.route('/getEquipmentRequestsByStatus')
.get(verifyJwtToken, authorize(), getEquipmentRequestsByStatus);

router.route('/updateEqptReqDocuments')
.post(verifyJwtToken, authorize(), upload.single('attachment'), updateEqptReqDocuments);

router.route('/changeStatusOfEqptReq/:id')
.put(verifyJwtToken, authorize(), upload.single('attachment'), changeStatusOfEqptReq);

router.route('/getEquipmentRequestsByStatusWithoutPaginate')
.get(verifyJwtToken, authorize(), getEquipmentRequestsByStatusWithoutPaginate);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteEquipmentRequest)
.put(verifyJwtToken, authorize(), upload.single('attachment'), addUpdateEquipmentRequest);

router.route('/all')
.get(getAllEquipmentRequestWithoutPaginate)

export default router;