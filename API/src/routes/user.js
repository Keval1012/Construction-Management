import express from 'express';
import { addUpdateUser, deleteUser , getAllEmployeeWithoutPaginate, getAllEmployeeByBuilder, getAllEmployeeTotalCountByBuilder,
    getAllEmployeeByBuilderWithoutPaginate, getRoleByUserId, getUserDataById, getUsers, getAllBuilder, getAllEmployee, getAllBuilderWithoutPaginate,
    getAllBuilderTotalCount, getAllEmployeeTotalCount, getAllUsers, getAllUserCount, getAllUsersCountByMonth } from '../controllers/user.js';
import { authorize, verifyJwtToken } from '../helper.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getUsers)
.post(verifyJwtToken, authorize(), upload.single('image'), addUpdateUser);

router.route('/getRoleByUserId')
.post(verifyJwtToken, authorize(), getRoleByUserId)

router.route('/getAllEmployeeWithoutPaginate')
.get(verifyJwtToken, authorize(), getAllEmployeeWithoutPaginate)

router.route('/getAllBuilder')
.get(verifyJwtToken, authorize(), getAllBuilder)

router.route('/getAllEmployee')
.get(verifyJwtToken, authorize(), getAllEmployee)

router.route('/getAllBuilderWithoutPaginate')
.get(verifyJwtToken, authorize(), getAllBuilderWithoutPaginate)

router.route('/getAllEmployeeByBuilder')
.get(verifyJwtToken, authorize(), getAllEmployeeByBuilder)

router.route('/getAllBuilderTotalCount')
.get(verifyJwtToken, authorize(), getAllBuilderTotalCount)

router.route('/getAllEmployeeTotalCount')
.get(verifyJwtToken, authorize(), getAllEmployeeTotalCount)

router.route('/getAllEmployeeTotalCountByBuilder')
.get(verifyJwtToken, authorize(), getAllEmployeeTotalCountByBuilder)

router.route('/getAllEmployeeByBuilderWithoutPaginate')
.post(verifyJwtToken, authorize(), getAllEmployeeByBuilderWithoutPaginate)

router.route('/all')
.get(verifyJwtToken, authorize(), getAllUsers)

router.route('/getAllUserCount')
.get(verifyJwtToken, authorize(), getAllUserCount)

router.route('/getAllUsersCountByMonth')
.get(verifyJwtToken, authorize(), getAllUsersCountByMonth)

router.route('/:id')
.get(verifyJwtToken, authorize(), getUserDataById)
.delete(verifyJwtToken, authorize('admin'), deleteUser)
.put(verifyJwtToken, authorize(), upload.single('image'), addUpdateUser);

export default router;