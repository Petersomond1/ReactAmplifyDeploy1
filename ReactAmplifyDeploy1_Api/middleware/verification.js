import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "Authentication needed - No token found" });
    } else {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json({ Error: "Invalid token" });
            } else {
                req.username = decoded.username;
                req.email = decoded.email;
                req.submitter = decoded.submitter;
                next();
            }
        });
    }
};