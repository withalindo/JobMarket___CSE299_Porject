import express from "express";
import { getTopEmployees, getTopJobsBySalary } from "../controllers/LandPage3Controller.js";

const router = express.Router();

// Public endpoints for the landing page, mounted under /api/landing
router.get("/top-employees", getTopEmployees);
router.get("/top-jobs", getTopJobsBySalary);

export default router;
