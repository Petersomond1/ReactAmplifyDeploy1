import express from 'express';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/users', authenticate, (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get('/submissions', authenticate, (req, res) => {
  const sql = "SELECT * FROM submissions";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post('/user/ban', authenticate, (req, res) => {
  const { userId } = req.body;
  const sql = "UPDATE users SET banned=1 WHERE id=?";
  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.json({ id: userId, banned: 1 });
  });
});

router.post('/user/unban', authenticate, (req, res) => {
  const { userId } = req.body;
  const sql = "UPDATE users SET banned=0 WHERE id=?";
  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.json({ id: userId, banned: 0 });
  });
});

router.post('/user/grant', authenticate, (req, res) => {
  const { userId } = req.body;
  const sql = "UPDATE users SET posting_rights=1 WHERE id=?";
  db.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.json({ id: userId, posting_rights: 1 });
  });
});

router.post('/user/update', authenticate, (req, res) => {
  const { userId, rating, userclass } = req.body;
  if (!/^[a-zA-Z0-9]{6}$/.test(userclass)) {
    return res.status(400).json({ Error: "Userclass must be a 6-figure alphanumeric ID" });
  }
  const sql = "UPDATE users SET rating=?, userclass=? WHERE id=?";
  db.query(sql, [rating, userclass, userId], (err, result) => {
    if (err) throw err;
    res.json({ id: userId, rating, userclass });
  });
});

router.post('/submission/feature', authenticate, (req, res) => {
  const { submissionId } = req.body;
  const sql = "UPDATE submissions SET featured=1 WHERE id=?";
  db.query(sql, [submissionId], (err, result) => {
    if (err) throw err;
    res.json({ id: submissionId, featured: 1 });
  });
});

router.post('/submission/remove', authenticate, (req, res) => {
  const { submissionId } = req.body;
  const sql = "DELETE FROM submissions WHERE id=?";
  db.query(sql, [submissionId], (err, result) => {
    if (err) throw err;
    res.json({ id: submissionId, removed: 1 });
  });
});

export default router;