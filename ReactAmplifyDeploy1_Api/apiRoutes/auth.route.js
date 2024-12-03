import express from 'express';
import { signup, login, logout, verify, getAuthenticatedUser } from '../apiControllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// POST /signup route
router.post("/signup", signup);

// POST /login route
router.post("/login", login);

// GET /logout route
router.get("/logout", logout);

// GET /verify/:token route
router.get("/verify/:token", verify);

// GET / route for authenticated user
router.get("/", authenticate, getAuthenticatedUser);

export default router;