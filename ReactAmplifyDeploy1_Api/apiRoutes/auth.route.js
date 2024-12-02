import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { verifyUser } from '../middleware/verification.js';

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/signup", (req, res) => {
    const sql = "INSERT INTO users (username, email, password, verification_token, userclass, submitter) VALUES (?)";
    const token = crypto.randomBytes(32).toString('hex');
    const submitterId = crypto.randomBytes(3).toString('hex');
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [req.body.username, req.body.email, hash, token, req.body.userclass, submitterId];
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Error inserting data into server" });

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
                if (error) return res.json({ Error: "Error sending email" });
                res.json({ Status: "Success", Message: "Verification email sent", token });
            });
        });
    });
});

router.post("/login", (req, res) => {
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
                        sameSite: "lax",
                        secure: false
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

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: "Success" });
});

router.get("/verify/:token", (req, res) => {
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

router.get("/", verifyUser, (req, res) => {
    res.set("Access-Control-Allow-Credentials", "true");
    return res.json({ Status: "Success", username: req.username, setAuth: true });
});

export default router;