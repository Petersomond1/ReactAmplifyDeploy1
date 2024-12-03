import express from 'express';
import {
  getAllContent,
  getContentById,
  createContent,
  addCommentToContent,
  getCommentsByContentId,
} from '../controllers/content.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

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

export default router;
