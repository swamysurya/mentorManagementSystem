import express from "express";
import * as IssueController from "../controllers/issueController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/issues", authenticateToken, IssueController.createIssue);
router.get("/issues", authenticateToken, IssueController.getAllIssues);
router.get("/issues/:id", authenticateToken, IssueController.getIssueById);
router.patch(
  "/issues/:id",
  authenticateToken,
  IssueController.updateIssueStatus
);

export default router;
