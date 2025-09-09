import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads/images and uploads/videos if not exists
const imagesDir = path.join(__dirname, "../uploads/images");
const videosDir = path.join(__dirname, "../uploads/videos");
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check file type
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(ext)) {
      cb(null, imagesDir);
    } else if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
      cb(null, videosDir);
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload route
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const folder = req.file.mimetype.startsWith("image") ? "images" : "videos";
  res.json({
    message: "File uploaded successfully",
    filePath: `/uploads/${folder}/${req.file.filename}`,
  });
});

export default router;
