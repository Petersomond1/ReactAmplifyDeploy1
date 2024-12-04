import express from 'express';
import {
  getAllContent,
  getContentById,
  createContent,
  addCommentToContent,
  getCommentsByContentId,
  uploadContent
} from '../controllers/content.controller.js';
import { uploadMiddleware, uploadToS3 } from '../middlewares/uploadMiddleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all public and assigned class content
router.get('/', authenticate, getAllContent);

// Get specific content by ID
router.get('/:id', authenticate, getContentById);

// Create new content (approval required for public/class)
router.post('/', authenticate, createContent);

// Add comment to specific content
router.post('/:id/comments', authenticate, addCommentToContent);

// Get comments for a specific content
router.get('/:id/comments', authenticate, getCommentsByContentId);

// Upload content
router.post('/upload', authenticate, uploadMiddleware.array('files', 10), uploadToS3, uploadContent);

export default router;