import express from 'express';
import { deleteTask, addUpdateTask, getAllTask, getAllTaskWithoutPaginate, getAllTasksByProjectId, getAllTasksByEmployee } from '../controllers/task.js';
import { authorize, verifyJwtToken } from '../helper.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllTask)
.post(verifyJwtToken, authorize(), upload.array('attachment'), addUpdateTask)

router.route('/byProjectId')
.get(verifyJwtToken, authorize(), (req, res) => getAllTasksByProjectId(req, res, true));
router.route('/byProjectIdWithoutPaginate')
.get(verifyJwtToken, authorize(), (req, res) => getAllTasksByProjectId(req, res, false));

router.route('/byEmployee')
.get(verifyJwtToken, authorize(), (req, res) => getAllTasksByEmployee(req, res, true));
router.route('/byEmployeeWithoutPaginate')
.get(verifyJwtToken, authorize(), (req, res) => getAllTasksByEmployee(req, res, false));

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteTask)
.put(verifyJwtToken, authorize(), upload.array('attachment'), addUpdateTask);

router.route('/all')
.get(getAllTaskWithoutPaginate);

export default router;