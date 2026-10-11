import express from "express";
import { requireCompany } from "../middleware/auth.js";
import { uploadCompanyLogo } from "../middleware/upload.js";
import { addCompanyInfo } from "../controllers/postSignupComController.js";

const router = express.Router();

router.post("/post-signup-com/add-info", requireCompany, uploadCompanyLogo, addCompanyInfo);

export default router;
