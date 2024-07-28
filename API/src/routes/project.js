import express from 'express';
import { deleteProject, addUpdateProject, getAllProject, getAllProjectWithoutPaginate, getAllProjectsByBuilderAndStatus, getAllProjectsByBuilderAndStatusWithoutPaginate, getAllEmployeeOfProject, addProjectDailyStatus, updateProjectDocuments, getAllProjectsCountByMonth, deleteProjectDocument, getAttachmentsOfProject, getAllAssignEmployeeOfBuilder } from '../controllers/project.js';
import { authorize, verifyJwtToken } from '../helper.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/')
.get(verifyJwtToken, authorize(), getAllProject)
// .post(verifyJwtToken, authorize(), upload.array('attachment'), addUpdateProject);
.post(verifyJwtToken, authorize(), addUpdateProject);

router.route('/updateProjectDocuments')
.post(verifyJwtToken, authorize(), upload.array('attachment'), updateProjectDocuments);

router.route('/deleteProjectDocument/:id')
.delete(verifyJwtToken, authorize(), deleteProjectDocument);

// router.route('/byBuilder')
// .get(verifyJwtToken, authorize(), getAllProjectsByBuilder);

router.route('/dailyStatus')
.post(verifyJwtToken, authorize(), addProjectDailyStatus);

router.route('/getAllProjectsByBuilderAndStatus')
.get(verifyJwtToken, authorize(), getAllProjectsByBuilderAndStatus);

router.route('/getAllProjectsByBuilderAndStatusWithoutPaginate')
.post(verifyJwtToken, authorize(), getAllProjectsByBuilderAndStatusWithoutPaginate);

router.route('/getAllEmployeeOfProject')
.post(verifyJwtToken, authorize(), getAllEmployeeOfProject);

router.route('/getAllProjectsCountByMonth')
.get(verifyJwtToken, authorize(), getAllProjectsCountByMonth);

router.route('/getAttachmentsOfProject')
.get(verifyJwtToken, authorize(), getAttachmentsOfProject);

router.route('/getAllAssignEmployeeOfBuilder')
.get(verifyJwtToken, authorize(), getAllAssignEmployeeOfBuilder);

router.route('/:id')
.delete(verifyJwtToken, authorize('admin'), deleteProject)
.put(verifyJwtToken, authorize(), upload.array('attachment'), addUpdateProject);
// .put(verifyJwtToken, authorize(), addUpdateProject);

router.route('/all')
.get(getAllProjectWithoutPaginate);

export default router;