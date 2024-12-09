import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import db from '../config/db.js';
import { generatePreRegistrationToken, generateToken } from '../utils/jwt.js';
import { registerUserService, loginUserService, submitFormService } from '../services/auth.service.js';

const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, phone } = req.body;
        console.log('req.body', req.body);
        if (!username || !email || !password || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        console.log("here");
        const userId = await registerUserService({ username, email, password, phone });
        console.log("kjsfd");
        
        const user = { userId, email, password, isVerified: false, isAdmin: false, isConfirmed: false };
        const token = generatePreRegistrationToken(user);

        res.cookie('access_token', token, { httpOnly: true });

        res.status(201).json({
            message: 'Pre-Registration successful; please take the survey to complete registration',
            redirectTo: '/formPage',
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const token = await loginUserService(email, password);

        res.cookie('access_token', token, { httpOnly: true });

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("access_token");
    return res.json({ Status: "Success" });
};

export const verifyUser = async (req, res) => {
    try {
        const sql = "SELECT * FROM users WHERE email=?";
        const [result] = await db.execute(sql, [req.params.token]);

        if (result.length === 0) {
            return res.json({ error: "Invalid token" });
        }

        const updateSql = "UPDATE users SET isVerified=1 WHERE email=?";
        await db.execute(updateSql, [req.params.token]);

        res.redirect(`http://localhost:5173/formpage/${req.params.token}`);
    } catch (err) {
        console.error(err);
        return res.json({ error: err.message || "Error verifying token" });
    }
};

export const getAuthenticatedUser = (req, res) => {
    res.set("Access-Control-Allow-Credentials", "true");
    return res.json({ Status: "Success", username: req.user.username, setAuth: true });
};

export const submitForm = async (req, res, next) => {
    try {
        console.log('submitForm controller:', req.body);

        const result = await submitFormService( req.body);

        res.status(200).json({
            Message: 'Form submitted successfully',
            Redirect: '/thank-you',
        });
    } catch (error) {
        console.error('Error in submitForm controller:', error);
        next(error);
    }
};