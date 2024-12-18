import bcrypt from 'bcryptjs';
import dbQuery from '../config/dbQuery.js';
import CustomError from '../utils/CustomError.js';
import { sendEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../config/db.js';

export const registerUserService = async (userData) => {
    const { username, email, password, phone } = userData;
    try {
        const existingUser = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return { error: true, message: 'User already exists' };
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = 'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)';
        const result = await dbQuery(sql, [username, email, hashedPassword, phone]);

        const subject = 'Welcome to Our Platform!';
        const text = `Hello ${username},\n\nWelcome to our platform! We're glad to have you. Please proceed with choosing your class on the form page.`;
        await sendEmail(email, subject, text);

        return result.insertId;
    } catch (error) {
        throw new CustomError('uncompleted request failed', 500, error);
    }
};

export const loginUserService = async (email, password) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await dbQuery(sql, [email]);

    if (user.length === 0) {
        throw new CustomError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) {
        throw new CustomError('Invalid credentials', 401);
    }

    const payload = {
        userId: user[0].id,
        email: user[0].email,
        isAdmin: user[0].isAdmin,
        isVerified: user[0].isVerified,
        isConfirmed: user[0].isConfirmed,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token; // Return the token to the controller for setting the cookie during login
};

export const sendPasswordResetEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await dbQuery(sql, [email]);

    if (user.length === 0) {
        throw new CustomError('User not found', 404);
    }

    const token = crypto.randomBytes(20).toString('hex'); // Generate a random token for password reset different from the JWT token
    await dbQuery('UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', [token, Date.now() + 3600000, email]);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Password Reset Request';
    const text = `To reset your password, please click the link below:\n\n${resetLink}`;
    await sendEmail(email, subject, text);
};

export const submitFormService = async (answers, email) => {

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const user = await dbQuery(sql, [email]);

        if (user.length === 0) {
            throw new CustomError('no user found issue!', 400);
        }
       
        const userId = user[0].id;

        const insertSql = 'INSERT INTO survey_answers (user_id, email, answers) VALUES (?, ?, ?)';
        const savedForm = await dbQuery(insertSql, [userId, email, JSON.stringify(answers)]);
        
        if (savedForm.affectedRows === 0) {
            throw new CustomError('data  failed to be saved in db', 500);
        }
        
        await dbQuery('UPDATE users SET isVerified = 1 WHERE id = ?', [userId]);
        
        
        const subject = 'Survey Submission Confirmation';
        const text = `Hello ${user[0].name},\n\nThank you for submitting the survey. Your responses have been recorded.`;
        await sendEmail(email, subject, text);

        return { success: true };
    } catch (error) {
        console.log("the issue", error)
        throw new CustomError('Form submission failed', 500, error.message);
    }
};