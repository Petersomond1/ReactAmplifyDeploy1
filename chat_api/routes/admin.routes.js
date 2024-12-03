import express from 'express';
import {
  getPendingContent,
  approveContent,
  rejectContent,
  manageUsers,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all pending content for approval
router.get('/content/pending', authenticate, authorize('admin'), getPendingContent);

// Approve content
router.post('/content/approve/:id', authenticate, authorize('admin'), approveContent);

// Reject content
router.post('/content/reject/:id', authenticate, authorize('admin'), rejectContent);

// Manage users (e.g., view, deactivate, or delete)
router.get('/users', authenticate, authorize('admin'), manageUsers);

export default router;
