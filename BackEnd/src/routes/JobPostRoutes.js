import express from "express";
import { requireCompany } from "../middleware/auth.js";
import { postJob } from "../controllers/JobPostController.js";

const router = express.Router();

router.post("/post-job", requireCompany, postJob);

export default router;
