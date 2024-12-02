import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import db from '../config/db.js'; // Assuming this is where you import your DB connection

const router = express.Router();

// GET /users route
router.get('/users', authenticate, async (req, res) => {
  try {
    const sql = "SELECT * FROM users";
    const [result] = await db.execute(sql);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error retrieving users" });
  }
});

// GET /submissions route
router.get('/submissions', authenticate, async (req, res) => {
  try {
    const sql = "SELECT * FROM submissions";
    const [result] = await db.execute(sql);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error retrieving submissions" });
  }
});

// POST /user/ban route
router.post('/user/ban', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const sql = "UPDATE users SET banned=1 WHERE id=?";
    const [result] = await db.execute(sql, [userId]);
    res.json({ id: userId, banned: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error banning user" });
  }
});

// POST /user/unban route
router.post('/user/unban', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const sql = "UPDATE users SET banned=0 WHERE id=?";
    const [result] = await db.execute(sql, [userId]);
    res.json({ id: userId, banned: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error unbanning user" });
  }
});

// POST /user/grant route
router.post('/user/grant', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const sql = "UPDATE users SET posting_rights=1 WHERE id=?";
    const [result] = await db.execute(sql, [userId]);
    res.json({ id: userId, posting_rights: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error granting posting rights" });
  }
});

// POST /user/update route
router.post('/user/update', authenticate, async (req, res) => {
  try {
    const { userId, rating, userclass } = req.body;
    
    // Validate userclass format
    if (!/^[a-zA-Z0-9]{6}$/.test(userclass)) {
      return res.status(400).json({ Error: "Userclass must be a 6-figure alphanumeric ID" });
    }

    const sql = "UPDATE users SET rating=?, userclass=? WHERE id=?";
    const [result] = await db.execute(sql, [rating, userclass, userId]);
    res.json({ id: userId, rating, userclass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error updating user" });
  }
});

// POST /submission/feature route
router.post('/submission/feature', authenticate, async (req, res) => {
  try {
    const { submissionId } = req.body;
    const sql = "UPDATE submissions SET featured=1 WHERE id=?";
    const [result] = await db.execute(sql, [submissionId]);
    res.json({ id: submissionId, featured: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error featuring submission" });
  }
});

// POST /submission/remove route
router.post('/submission/remove', authenticate, async (req, res) => {
  try {
    const { submissionId } = req.body;
    const sql = "DELETE FROM submissions WHERE id=?";
    const [result] = await db.execute(sql, [submissionId]);
    res.json({ id: submissionId, removed: 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Error removing submission" });
  }
});

export default router;
