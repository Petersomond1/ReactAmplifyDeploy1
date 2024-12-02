import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

const SECRET_KEY = process.env.SECRET_KEY;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

const generateUniqueId = () => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-figure alphanumeric ID
};

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "Authentication needed - No token found" });
    } else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json({ Error: "Invalid token" });
            } else {
                req.username = decoded.username;
                req.email = decoded.email;
                req.submitter = decoded.submitter;
                next();
            }
        });
    }
};

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.get("/", verifyUser, (req, res) => {
    res.set("Access-Control-Allow-Credentials", "true");
    return res.json({ Status: "Success", username: req.username, setAuth: true });
});

app.get("/verify/:token", (req, res) => {
    const sql = "SELECT * FROM users WHERE verification_token=?";
    db.query(sql, [req.params.token], (err, result) => {
        if (err || result.length === 0) return res.json({ Error: "Invalid token" });

        const updateSql = "UPDATE users SET is_verified=1 WHERE verification_token=?";
        db.query(updateSql, [req.params.token], (err) => {
            if (err) return res.json({ Error: "Error updating verification status" });
            res.redirect(`http://localhost:5173/formpage/${req.params.token}`);
        });
    });
});

app.post("/signup", (req, res) => {
    console.log('req.body at /signup', req.body);
    const sql = "INSERT INTO users (username, email, password, verification_token, userclass, submitter) VALUES (?)";
    const token = crypto.randomBytes(32).toString('hex');
    const submitterId = generateUniqueId();
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [req.body.username, req.body.email, hash, token, req.body.userclass, submitterId];
        db.query(sql, [values], (err, result) => {
            console.log('result at server', result);
            if (err) {
                console.error('Error inserting data into server:', err);
                return res.json({ Error: "Error inserting data into server" });
            }

            // Send email
            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVICE,
                auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
                tls: { rejectUnauthorized: false }
            });

            const mailOptions = {
                from: process.env.MAIL_USER,
                to: req.body.email,
                subject: 'Confirm your email',
                html: `<p>Click <a href="http://localhost:3000/verify/${token}">here</a> to verify your registration.</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.json({ Error: "Error sending email" });
                }
                res.json({ Status: "Success", Message: "Verification email sent", token });
            });
        });
    });
});

app.post("/submit-form", (req, res) => {
    const { token, answers } = req.body;
    const sql = "SELECT * FROM users WHERE verification_token=?";
    db.query(sql, [token], (err, result) => {
        if (err || result.length === 0) {
            return res.json({ Status: "Error", Message: "Invalid token or user not found" });
        }

        // Simulate admin rating process
        const rating = Math.floor(Math.random() * 11); // Random rating between 0 and 10
        let message = "";
        let redirect = "";

        if (rating >= 7) {
            message = "Congratulations! Your answers have been highly rated.";
            redirect = "/chatpage";
        } else if (rating >= 4) {
            message = "Your answers have been rated moderately.";
            redirect = "/chatpage";
        } else {
            message = "Unfortunately, your answers did not meet the expectations.";
            redirect = "/advisory";
        }

        const updateSql = "UPDATE users SET rating=? WHERE verification_token=?";
        db.query(updateSql, [rating, token], (err) => {
            if (err) return res.json({ Status: "Error", Message: "Error updating user data" });

            // Send email
            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVICE,
                auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
                tls: { rejectUnauthorized: false }
            });

            const mailOptions = {
                from: process.env.MAIL_USER,
                to: result[0].email,
                subject: 'Your Application Rating',
                html: `<p>${message}</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.json({ Status: "Error", Message: "Error sending email" });
                }
                res.json({ Status: "Success", Message: message, Redirect: redirect });
            });
        });
    });
});

app.post("/login", (req, res) => {
    const sql = "SELECT * FROM users WHERE email=?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login Error querying server database" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Error comparing passwords" });
                if (response) {
                    const username = data[0].username;
                    const email = data[0].email;
                    const submitter = data[0].submitter;
                    const token = jwt.sign({ username, email, submitter }, SECRET_KEY, { expiresIn: "1d" });
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "lax", // Use "none" for cross-origin; ensure HTTPS if secure
                        secure: false // Set to true if using HTTPS
                    });
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Invalid email or password not matched" });
                }
            });
        } else {
            return res.json({ Error: "No email existed or User not found" });
        }
    });
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: "Success" });
});

// Middleware for JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.use('/auth', authRoutes);
app.use('/content', contentRoutes);
app.use('/admin', adminRoutes);

app.get('/api/display', authenticate, (req, res) => {
  db.query('SELECT * FROM submissions ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

app.get('/api/messages', authenticate, (req, res) => {
  db.query('SELECT * FROM messages', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/api/messages', authenticate, (req, res) => {
  const { message, audience, targetId } = req.body;
  const { username, email, submitter } = req.user;
  const sql = "INSERT INTO messages (username, email, content, messagelog, submitter, audience, targetId) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const messageLog = crypto.randomBytes(16).toString('hex');
  db.query(sql, [username, email, message, messageLog, submitter, audience, targetId], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, username, email, content: message, messagelog: messageLog, submitter, audience, targetId });
  });
});

// Function to generate image thumbnail
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

// Function to generate video thumbnail
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

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const outputPath = path.join('thumbnails', `${file.filename}.jpg`);

  if (file.mimetype.startsWith('image/')) {
    generateImageThumbnail(file.path, outputPath);
  } else if (file.mimetype.startsWith('video/')) {
    generateVideoThumbnail(file.path, outputPath);
  }

  // Save file and thumbnail info to the database
  const sql = "INSERT INTO submissions (title, image_url, video_url, icon, submitter, audience, targetId) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [file.originalname, file.mimetype.startsWith('image/') ? file.path : null, file.mimetype.startsWith('video/') ? file.path : null, outputPath, req.user.submitter, req.body.audience, req.body.targetId];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving to database:', err);
      return res.status(500).json({ Error: "Error saving to database" });
    }
    res.json({ message: 'File uploaded and thumbnail generated', id: result.insertId });
  });
});

app.post('/api/upload', authenticate, (req, res) => {
  const { title, description, text, image_url, video_url, emoji, icon, audience, targetId } = req.body;
  const sql = "INSERT INTO submissions (title, description, text, image_url, video_url, emoji, icon, submitter, audience, targetId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, description, text, image_url, video_url, emoji, icon, req.user.submitter, audience, targetId], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, title, description, text, image_url, video_url, emoji, icon, submitter: req.user.submitter, audience, targetId });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});