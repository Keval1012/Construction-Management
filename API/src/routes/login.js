import express from 'express';
import { changePassword, getUserLogin } from '../controllers/login.js';

const router = express.Router();

router.route('/')
.post(getUserLogin);

router.route('/changePassword')
.post(changePassword)

export default router;