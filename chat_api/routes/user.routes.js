import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, getUserProfile);

// Update user profile
router.put('/profile', authenticate, updateUserProfile);

export default router;