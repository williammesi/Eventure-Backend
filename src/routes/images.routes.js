import { Router } from "express";
import multer from "multer";
import { uploadImage, deleteImage } from "../controllers/images.controller.js";
import { guardAuthorizationJWT } from "../middlewares/authorization.jwt.js";
import imageRepository from "../repositories/image.repository.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protected routes - require authentication
router.post(
  "/upload",
  guardAuthorizationJWT,
  upload.single("image"),
  (err, req, res, next) => {
    // Multer error handler
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  uploadImage
);

// Protected routes - require authentication
router.post(
  "/event/upload",
  guardAuthorizationJWT,
  upload.array("images", 5),
  (err, req, res, next) => {
    // Multer error handler
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  uploadEventImages
);

router.delete("/:pathname", guardAuthorizationJWT, deleteImage);

export default router;
