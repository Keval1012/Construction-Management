import express from 'express';
import { deleteEquipment, addUpdateEquipment, getAllEquipment, getAllEquipmentWithoutPaginate, getEquipmentsByStatusWithoutPaginate, getEquipmentsByStatus, getAvailableDetailsOfEqptById } from '../controllers/equipment.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllEquipment)
.post(verifyJwtToken, authorize(), addUpdateEquipment);

router.route('/getEquipmentsByStatus')
.get(verifyJwtToken, authorize(), getEquipmentsByStatus);

router.route('/getAvailableDetailsOfEqptById/:id')
.get(verifyJwtToken, authorize(), getAvailableDetailsOfEqptById);

router.route('/getEquipmentsByStatusWithoutPaginate')
.get(verifyJwtToken, authorize(), getEquipmentsByStatusWithoutPaginate);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteEquipment)
.put(verifyJwtToken, authorize(), addUpdateEquipment);

router.route('/all')
.get(getAllEquipmentWithoutPaginate)

export default router;