import express from "express";
import { requireAuth, requireEmployee } from "../middleware/auth.js";
import { uploadProfileImage } from "../middleware/upload.js";
import { getMe, updateProfilePicture } from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.post("/profile/picture", requireEmployee, uploadProfileImage, updateProfilePicture);

export default router;
