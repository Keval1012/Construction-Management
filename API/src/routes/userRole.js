import express from 'express';
import { getAllUserRoleWithoutPaginate } from '../controllers/userRole.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/all')
.get(verifyJwtToken, authorize(), getAllUserRoleWithoutPaginate)

export default router;