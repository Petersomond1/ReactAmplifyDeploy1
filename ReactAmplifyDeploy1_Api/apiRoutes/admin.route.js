import express from 'express';
import { getUsers, getSubmissions, banUser, unbanUser, grantPostingRights, updateUser, featureSubmission, removeSubmission } from '../apiControllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// GET /users route
router.get('/users', authenticate, getUsers);

// GET /submissions route
router.get('/submissions', authenticate, getSubmissions);

// POST /user/ban route
router.post('/user/ban', authenticate, banUser);

// POST /user/unban route
router.post('/user/unban', authenticate, unbanUser);

// POST /user/grant route
router.post('/user/grant', authenticate, grantPostingRights);

// POST /user/update route
router.post('/user/update', authenticate, updateUser);

// POST /submission/feature route
router.post('/submission/feature', authenticate, featureSubmission);

// POST /submission/remove route
router.post('/submission/remove', authenticate, removeSubmission);

export default router;