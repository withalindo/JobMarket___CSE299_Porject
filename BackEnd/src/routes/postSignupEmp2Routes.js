import express from "express";
import { requireEmployee } from "../middleware/auth.js";
import { uploadResumeFile } from "../middleware/upload.js";
import { uploadResume } from "../controllers/postSignupEmp2Controller.js";

const router = express.Router();

// requireEmployee runs first: the stored file name is derived from the session user.
router.post("/post-signup-emp2/upload-resume", requireEmployee, uploadResumeFile, uploadResume);

export default router;
