require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

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

// Authentication
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User registered successfully' });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(401).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, results[0].password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: results[0].id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
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