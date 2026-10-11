import express from "express";
import { login } from "../controllers/loginComController.js";

const router = express.Router();

// POST /api/company-login
router.post("/company-login", login);

export default router;