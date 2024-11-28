require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

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
    const sql = "INSERT INTO users (username, email, password, verification_token) VALUES (?)";
    const token = crypto.randomBytes(32).toString('hex');
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [req.body.username, req.body.email, hash, token];
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
                    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1d" });
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
app.get('/api/display', authenticate, (req, res) => {
    db.query('SELECT * FROM display_content ORDER BY id DESC LIMIT 1', (err, result) => {
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
    const { message } = req.body;
    db.query('INSERT INTO messages (content) VALUES (?)', [message], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, content: message });
    });
  });
  
  app.post('/api/upload', authenticate, (req, res) => {
    const { type, url } = req.body;
    db.query('INSERT INTO display_content (type, url) VALUES (?, ?)', [type, url], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, type, url });
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});