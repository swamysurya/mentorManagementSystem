import express from "express";
import {
  createDoubt,
  deleteDoubt,
  getDoubts,
} from "../controllers/doubtController.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", authenticateToken, createDoubt);
router.delete("/:doubtId", authenticateToken, deleteDoubt);
router.get("/", authenticateToken, getDoubts);

export default router;
