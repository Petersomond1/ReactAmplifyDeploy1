import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { authenticate } from '../middleware/authenticate.js';
import db from '../config/db.js'; // Assuming this is where you import your DB connection

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Generate image thumbnail
const generateImageThumbnail = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .resize({ width: 100 })
            .toFile(outputPath);
        console.log('Thumbnail created successfully');
    } catch (error) {
        console.error('Error generating thumbnail:', error);
    }
};

// Generate video thumbnail
const generateVideoThumbnail = async (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .screenshots({
                timestamps: ['50%'],
                filename: outputPath,
                size: '320x240'
            })
            .on('end', () => {
                console.log('Thumbnail created successfully');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error generating thumbnail:', err);
                reject(err);
            });
    });
};

// Generate music thumbnail
const generateMusicThumbnail = async (inputPath, outputPath) => {
    try {
        await sharp({
            create: {
                width: 100,
                height: 100,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0.5 }
            }
        })
            .png()
            .toFile(outputPath);
        console.log('Music thumbnail created successfully');
    } catch (error) {
        console.error('Error generating music thumbnail:', error);
    }
};

// Upload route with thumbnail generation
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const outputPath = path.join('thumbnails', `${file.filename}.jpg`);

        // Determine which type of file and generate a corresponding thumbnail
        if (file.mimetype.startsWith('image/')) {
            await generateImageThumbnail(file.path, outputPath);
        } else if (file.mimetype.startsWith('video/')) {
            await generateVideoThumbnail(file.path, outputPath);
        } else if (file.mimetype.startsWith('audio/')) {
            await generateMusicThumbnail(file.path, outputPath);
        }

        // Insert record into the database
        const sql = "INSERT INTO submissions (title, image_url, video_url, music_url, icon, submitter, audience) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            file.originalname,
            file.mimetype.startsWith('image/') ? file.path : null,
            file.mimetype.startsWith('video/') ? file.path : null,
            file.mimetype.startsWith('audio/') ? file.path : null,
            outputPath,
            req.user.submitter,
            req.body.audience
        ];
        const [result] = await db.execute(sql, values);

        res.json({ message: 'File uploaded and thumbnail generated', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: "Error uploading file and generating thumbnail" });
    }
});

// API upload route
router.post('/upload', authenticate, async (req, res) => {
    try {
        const { title, description, text, image_url, video_url, music_url, emoji, icon, audience } = req.body;
        const sql = "INSERT INTO submissions (title, description, text, image_url, video_url, music_url, emoji, icon, submitter, audience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await db.execute(sql, [title, description, text, image_url, video_url, music_url, emoji, icon, req.user.submitter, audience]);

        res.json({ id: result.insertId, title, description, text, image_url, video_url, music_url, emoji, icon, submitter: req.user.submitter, audience });
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: "Error uploading submission" });
    }
});

// Display latest submission
router.get('/display', authenticate, async (req, res) => {
    try {
        const [result] = await db.execute('SELECT * FROM submissions ORDER BY id DESC LIMIT 1');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: "Error retrieving the latest submission" });
    }
});

// Get all messages
router.get('/messages', authenticate, async (req, res) => {
    try {
        const [result] = await db.execute('SELECT * FROM messages');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: "Error retrieving messages" });
    }
});

// Post a new message
router.post('/messages', authenticate, async (req, res) => {
    try {
        const { message, audience } = req.body;
        const { username, email, submitter } = req.user;
        const messageLog = crypto.randomBytes(16).toString('hex');
        const sql = "INSERT INTO messages (username, email, content, messagelog, submitter, audience) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await db.execute(sql, [username, email, message, messageLog, submitter, audience]);

        res.json({ id: result.insertId, username, email, content: message, messagelog: messageLog, submitter, audience });
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: "Error posting message" });
    }
});

export default router;
