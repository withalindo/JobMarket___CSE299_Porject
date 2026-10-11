import express from "express";
import { login } from "../controllers/loginController.js";

const router = express.Router();

// Login Route
router.post("/login", login);

export default router;