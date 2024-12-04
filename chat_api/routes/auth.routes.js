import express from 'express';
import { registerUser, loginUser, logoutUser, verifyUser, getAuthenticatedUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// User logout
router.post('/logout', logoutUser);

// User verification
router.get('/verify/:token', verifyUser);

// Get authenticated user
router.get("/", authenticate, getAuthenticatedUser);

export default router;