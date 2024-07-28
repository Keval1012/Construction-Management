import express from 'express';
import { deleteMilestone, addUpdateMilestone, getAllMilestone, getAllMilestoneWithoutPaginate, getAllMilestoneByProjectId } from '../controllers/milestone.js';
import { authorize, verifyJwtToken } from '../helper.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllMilestone)
.post(verifyJwtToken, authorize(), addUpdateMilestone);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteMilestone)
.put(verifyJwtToken, authorize(), addUpdateMilestone);

router.route('/all')
.get(getAllMilestoneWithoutPaginate)

router.route('/getAllByProjectId')
.get(getAllMilestoneByProjectId)

export default router;