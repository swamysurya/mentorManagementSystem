// src/routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";
import { validateLoginInput } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", validateLoginInput, login);

export default router;
