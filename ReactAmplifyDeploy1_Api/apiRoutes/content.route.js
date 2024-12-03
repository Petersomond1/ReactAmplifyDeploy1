import express from 'express';
import { uploadFile, uploadSubmission, displayLatestSubmission, getAllMessages, postMessage } from '../apiControllers/contentController.js';
import { authenticate } from '../middleware/authenticate.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload route with thumbnail generation
router.post('/upload', upload.single('file'), uploadFile);

// API upload route
router.post('/api/upload', authenticate, uploadSubmission);

// Display latest submission
router.get('/display', authenticate, displayLatestSubmission);

// Get all messages
router.get('/messages', authenticate, getAllMessages);

// Post a new message
router.post('/messages', authenticate, postMessage);

export default router;