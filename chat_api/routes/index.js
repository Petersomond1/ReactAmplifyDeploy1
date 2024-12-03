import express from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import classRoutes from './class.routes.js';
import contentRoutes from './content.routes.js';
import adminRoutes from './admin.routes.js';


const router = express.Router();

 
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/classes", classRoutes);
router.use("/content", contentRoutes);
router.use("/admin", adminRoutes);

export default router;