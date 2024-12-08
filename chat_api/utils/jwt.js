import jwt from 'jsonwebtoken';

export const generatePreRegistrationToken = (userData) => {
  const { userId, email, password } = userData;
  const payload = {
    userId,
    email,
    password,
    isAdmin: false,
    isVerified: false,
    isConfirmed: false,
  };

  // Create a JWT token with a 1 hour expiration
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const generateToken = (userData) => {
  const { userId, email, passwordHash, isAdmin, isVerified, isConfirmed } = userData;
  const payload = {
    userId,
    email,
    passwordHash,
    isAdmin,
    isVerified,
    isConfirmed,
  };

  // Create a JWT token with a 1 hour expiration
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};