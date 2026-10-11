import express from "express";
import {
  getHomeUserInfo,
  getTopJobsBySkills,
  getAllJobs,
} from "../controllers/HomeUserController.js";

const router = express.Router();

// NOTE: GET /api/employees lives in userRoutes.js (it supports ?search=). It used to be
// registered here too, and this earlier copy shadowed the searchable one.
router.get("/all-jobs", getAllJobs);
router.get("/homeuser-info", getHomeUserInfo);
router.get("/employee-info", getHomeUserInfo); // kept for the Jobs page header
router.get("/top-jobs", getTopJobsBySkills);

export default router;
