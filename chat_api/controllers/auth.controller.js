import { registerUserService, loginUserService, sendPasswordResetEmail } from "../services/auth.service.js";
import {generateToken} from "../utils/jwt.js";

export const registerUser = async (req, res, next) => {
    try {
      const { username, email, password, phone = "2514632" } = req.body;

      // Validation (you could use a package like express-validator for this)
      if (!username || !email || !password || !phone) {
        throw new CustomError('All fields are required', 400);
      }
      console.log("user data", req.body);
      const userId = await registerUserService({ username, email, password, phone });
      
      const user = { userId, email, isAdmin: false, isConfirmed: false }; // You can modify this to fetch the actual user's details after registration
      const token = generateToken(user);

      res.cookie('access_token', token, { httpOnly: true }); // Set the token in a cookie
  
      // Send the response with the token and redirect URL
      res.status(201).json({
        message: 'Registration successful',
        redirectTo: '/formPage', // Provide the redirection URL for frontend to handle
      });

    } catch (error) {
      next(error); // Forward error to the error handler
    }
  };
  
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError('Email and password are required', 400);
    }

    const token = await loginUserService(email, password);

    res.cookie('access_token', token, { httpOnly: true }); // Set the token in a cookie

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err); // Forward error to the error handler
  }
};

export const logoutUser = async (req, res) => {
try {
    // Business logic for user logout
} catch (error) {
    console.error('Error in logoutUser:', error.message);
    res.status(500).json({ error: 'An error occurred while logging out the user.' });
}
};
  