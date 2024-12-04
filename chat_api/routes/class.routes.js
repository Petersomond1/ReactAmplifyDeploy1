import express from 'express';
import { assignUserToClass, getClassContent } from '../controllers/class.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Assign user to class
router.post('/assign', authenticate, assignUserToClass);

// Get content for a specific class
router.get('/:classId/content', authenticate, getClassContent);

export default router;