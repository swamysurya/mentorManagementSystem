import express from "express";
import {
  getSectionOptions,
  getSubjectOptions,
  getCategoryOptions,
} from "../controllers/optionController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes with authentication
router.use(authenticateToken);

// Get all options

router.get("/sections", getSectionOptions);
router.get("/subjects", getSubjectOptions);
router.get("/categories", getCategoryOptions);

export default router;
