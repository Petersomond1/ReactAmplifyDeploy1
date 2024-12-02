import express from 'express';
import { authenticate } from '../middleware/authenticate.js'; // Ensure you have an authenticate middleware

const router = express.Router();

// Admin Endpoints
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