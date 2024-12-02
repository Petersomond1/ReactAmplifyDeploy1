import express from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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

const generateVideoThumbnail = (inputPath, outputPath) => {
    ffmpeg(inputPath)
        .screenshots({
            timestamps: ['50%'],
            filename: outputPath,
            size: '320x240'
        })
        .on('end', () => {
            console.log('Thumbnail created successfully');
        })
        .on('error', (err) => {
            console.error('Error generating thumbnail:', err);
        });
};

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

router.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    const outputPath = path.join('thumbnails', `${file.filename}.jpg`);

    if (file.mimetype.startsWith('image/')) {
        generateImageThumbnail(file.path, outputPath);
    } else if (file.mimetype.startsWith('video/')) {
        generateVideoThumbnail(file.path, outputPath);
    } else if (file.mimetype.startsWith('audio/')) {
        generateMusicThumbnail(file.path, outputPath);
    }

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
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ Error: "Error saving to database" });
        res.json({ message: 'File uploaded and thumbnail generated', id: result.insertId });
    });
});

router.post('/api/upload', authenticate, (req, res) => {
    const { title, description, text, image_url, video_url, music_url, emoji, icon, audience } = req.body;
    const sql = "INSERT INTO submissions (title, description, text, image_url, video_url, music_url, emoji, icon, submitter, audience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, description, text, image_url, video_url, music_url, emoji, icon, req.user.submitter, audience], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, title, description, text, image_url, video_url, music_url, emoji, icon, submitter: req.user.submitter, audience });
    });
});

router.get('/api/display', authenticate, (req, res) => {
    db.query('SELECT * FROM submissions ORDER BY id DESC LIMIT 1', (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

router.get('/api/messages', authenticate, (req, res) => {
    db.query('SELECT * FROM messages', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/api/messages', authenticate, (req, res) => {
    const { message, audience } = req.body;
    const { username, email, submitter } = req.user;
    const sql = "INSERT INTO messages (username, email, content, messagelog, submitter, audience) VALUES (?, ?, ?, ?, ?, ?)";
    const messageLog = crypto.randomBytes(16).toString('hex');
    db.query(sql, [username, email, message, messageLog, submitter, audience], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, username, email, content: message, messagelog: messageLog, submitter, audience });
    });
});

export default router;