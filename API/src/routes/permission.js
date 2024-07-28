import express from 'express';
import { addUpdateAccessPermissionsByRole, getAllAccessPermissionByUserId, getAllAccessPermissionByRoleId, getAllModulePermissionWithoutPaginate } from '../controllers/permission.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/modulePermission')
.get(verifyJwtToken, authorize(), getAllModulePermissionWithoutPaginate)

router.route('/accessPermission')
.post(verifyJwtToken, authorize(), addUpdateAccessPermissionsByRole)

router.route('/accessPermissionByUserId/:id')
.get(verifyJwtToken, authorize(), getAllAccessPermissionByUserId)

router.route('/accessPermissionByRoleId/:id')
.get(verifyJwtToken, authorize(), getAllAccessPermissionByRoleId)

export default router;