import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';

// Import routes
import authRoutes from './apiRoutes/auth.route.js';
import contentRoutes from './apiRoutes/content.route.js';
import adminRoutes from './apiRoutes/admin.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});