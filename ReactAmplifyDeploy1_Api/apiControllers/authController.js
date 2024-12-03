import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import db from '../config/db.js';

const SECRET_KEY = process.env.SECRET_KEY;

export const signup = async (req, res) => {
    try {
        const sql = "INSERT INTO users (username, email, password, verification_token, userclass, submitter) VALUES (?)";
        const token = crypto.randomBytes(32).toString('hex');
        const submitterId = crypto.randomBytes(3).toString('hex');
        
        // Hash password
        const hash = await bcrypt.hash(req.body.password.toString(), 10);

        const values = [req.body.username, req.body.email, hash, token, req.body.userclass, submitterId];

        // Insert user into DB
        await db.execute(sql, [values]);

        // Create and send the verification email
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

        await transporter.sendMail(mailOptions);

        return res.json({ Status: "Success", Message: "Verification email sent", token });
    } catch (error) {
        res.status(500).send("issue with sign up");
    }
}

export const login = async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE email=?";
        const [data] = await db.execute(sql, [req.body.email]);

        if (data.length > 0) {
            const match = await bcrypt.compare(req.body.password.toString(), data[0].password);

            if (match) {
                const { username, email, submitter } = data[0];
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
        } else {
            return res.json({ Error: "No email existed or User not found" });
        }

    } catch (err) {
        res.status(500).send("issue with login");
    }
}

export const logout = (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: "Success" });
}

export const verify = async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE verification_token=?";
        const [result] = await db.execute(sql, [req.params.token]);

        if (result.length === 0) {
            return res.json({ Error: "Invalid token" });
        }

        const updateSql = "UPDATE users SET is_verified=1 WHERE verification_token=?";
        await db.execute(updateSql, [req.params.token]);

        res.redirect(`http://localhost:5173/formpage/${req.params.token}`);

    } catch (err) {
        console.error(err);
        return res.json({ Error: err.message || "Error verifying token" });
    }
}

export const getAuthenticatedUser = (req, res) => {
    res.set("Access-Control-Allow-Credentials", "true");
    return res.json({ Status: "Success", username: req.user.username, setAuth: true });
}