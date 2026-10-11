import express from 'express';
import { requireEmployee } from '../middleware/auth.js';
import { uploadProfileImage } from '../middleware/upload.js';
import { saveEmployeeDetails } from '../controllers/postSignupEmpController.js';

const router = express.Router();

// POST /api/post-signup-emp
router.post('/', requireEmployee, uploadProfileImage, saveEmployeeDetails);

export default router;
