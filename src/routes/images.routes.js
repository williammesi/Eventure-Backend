import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/images.controller.js';
import { guardAuthorizationJWT } from '../middlewares/authorization.jwt.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Protected routes - require authentication
router.post('/upload', guardAuthorizationJWT, upload.single('image'), uploadImage);
router.delete('/:pathname', guardAuthorizationJWT, deleteImage);

export default router;
