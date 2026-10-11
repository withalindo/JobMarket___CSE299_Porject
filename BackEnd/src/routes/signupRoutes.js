import express from "express";
import { signupEmployee } from "../controllers/signupEmpController.js";
import { signupCompany } from "../controllers/signupComController.js";

const router = express.Router();

// Employee Signup Route
router.post("/employee", signupEmployee);

// Company Signup Route
router.post("/company", signupCompany);

export default router;