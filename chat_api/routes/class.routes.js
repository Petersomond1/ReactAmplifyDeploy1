import express from 'express';
import {
  assignClassToUser,
  getClassContent,
} from '../controllers/class.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Assign a class to a user (admin only)
router.post('/assign', authenticate, authorize('admin'), assignClassToUser);

// Get content for a specific class
router.get('/:classId/content', authenticate, getClassContent);

export default router;
