import express from 'express';
import { deleteInspection, addUpdateInspection, getAllInspection, getAllInspectionWithoutPaginate, getAllInspectionByQueryWithoutPaginate, getAllInspectionByQuery, getAllIssuesByInspection } from '../controllers/inspection.js';
import { authorize, verifyJwtToken } from '../helper.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllInspection)
.post(verifyJwtToken, authorize(), upload.array('document'), addUpdateInspection);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteInspection)
.put(verifyJwtToken, authorize(), upload.array('document'), addUpdateInspection);

router.route('/getAllIssuesByInspection')
.post(verifyJwtToken, authorize(), getAllIssuesByInspection);

router.route('/getAllInspectionByQuery')
.get(verifyJwtToken, authorize(), getAllInspectionByQuery)

router.route('/getAllInspectionByQueryWithoutPaginate')
.get(verifyJwtToken, authorize(), getAllInspectionByQueryWithoutPaginate)

router.route('/all')
.get(getAllInspectionWithoutPaginate)

export default router;