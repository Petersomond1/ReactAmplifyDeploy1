import bcrypt from 'bcryptjs';
import dbQuery from '../config/dbQuery.js';
import CustomError from '../utils/CustomError.js';
import {sendEmail} from '../utils/email.js';

export const registerUserService = async (userData) => {
    const { username, email, password, phone } = userData;
  
    // Check if user already exists
    const existingUser = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      throw new CustomError('User already exists', 400);
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Store user in DB
    const sql = 'INSERT INTO users (name, email, password_hash) VALUES ( ?, ?, ?)';
    const result = await dbQuery(sql, [username, email, hashedPassword]);
  
    // Send a welcome email
    const subject = 'Welcome to Our Platform!';
    const text = `Hello ${username},\n\nWelcome to our platform! We're glad to have you. Please proceed with choosing your class on the form page.`;
   // await sendEmail(email, subject, text);
  

    return result.insertId;
  };

export const loginUserService = async (email, password) => {
// Find the user by email
const sql = 'SELECT * FROM users WHERE email = ?';
const user = await dbQuery(sql, [email]);

if (user.length === 0) {
    throw new CustomError('Invalid credentials', 401);
}

// Check if the password matches
const isMatch = await bcrypt.compare(password, user[0].passwordHash);
if (!isMatch) {
    throw new CustomError('Invalid credentials', 401);
}

// Generate JWT token
const payload = {
    userId: user[0].id,
    isAdmin: user[0].isAdmin,
    isConfirmed: false,
    email: user[0].email,
};
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

return token;
};

export const sendPasswordResetEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await db.query(sql, [email]);
  
    if (user.length === 0) {
      throw new CustomError('User not found', 404);
    }
  
    // Generate password reset token
    const token = crypto.randomBytes(20).toString('hex');
    // Store the reset token and its expiry in the database (you would add columns for this)
    await db.query('UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?', [token, Date.now() + 3600000, email]);
  
    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Password Reset Request';
    const text = `To reset your password, please click the link below:\n\n${resetLink}`;
    await sendEmail(email, subject, text);
  };