const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chat_system'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/api/display', (req, res) => {
  db.query('SELECT * FROM display_content ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

app.get('/api/messages', (req, res) => {
  db.query('SELECT * FROM messages', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/api/messages', (req, res) => {
  const { message } = req.body;
  db.query('INSERT INTO messages (content) VALUES (?)', [message], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, content: message });
  });
});

app.post('/api/submit', (req, res) => {
  const { content } = req.body;
  db.query('INSERT INTO submissions (content) VALUES (?)', [content], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, content });
  });
});

app.post('/api/upload', (req, res) => {
  const { type, url } = req.body;
  db.query('INSERT INTO display_content (type, url) VALUES (?, ?)', [type, url], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, type, url });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});