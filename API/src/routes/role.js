import express from 'express';
import { deleteRole, addUpdateRole, getAllRole, getAllRoleWithoutPaginate } from '../controllers/role.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllRole)
.post(verifyJwtToken, authorize(), addUpdateRole);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteRole)
.put(verifyJwtToken, authorize(), addUpdateRole);

router.route('/all')
.get(getAllRoleWithoutPaginate)

export default router;