import express from "express";
import {
  submitFeedback,
  getFeedbackHistory,
  getAllFeedbackDates,
} from "../controllers/feedbackController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, submitFeedback);
router.get("/history", authenticateToken, getFeedbackHistory);
router.get("/dates", authenticateToken, getAllFeedbackDates);

export default router;
