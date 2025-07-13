import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /upload-media
router.post("/upload-media", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    // Remove file from local uploads after upload
    fs.unlink(req.file.path, () => {});
    res.json({ success: true, mediaLink: result.secure_url });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Upload failed", error: err.message });
  }
});

// GET /cloudinary-status
router.get("/cloudinary-status", async (req, res) => {
  try {
    // This will throw if credentials are invalid
    await cloudinary.api.ping();
    res.json({ active: true });
  } catch (err) {
    res.json({ active: false, error: err.message });
  }
});

export default router;
