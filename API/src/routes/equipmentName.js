import express from 'express';
import { deleteEquipmentName, addUpdateEquipmentName, getAllEquipmentName, getAllEquipmentNameWithoutPaginate } from '../controllers/equipmentName.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllEquipmentName)
.post(verifyJwtToken, authorize(), addUpdateEquipmentName);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteEquipmentName)
.put(verifyJwtToken, authorize(), addUpdateEquipmentName);

router.route('/all')
.get(getAllEquipmentNameWithoutPaginate)

export default router;