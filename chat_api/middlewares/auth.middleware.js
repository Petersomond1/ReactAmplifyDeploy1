export const authenticate = async (req, res, next) => {
  try {
    // Logic for authenticating the user (e.g., verifying JWT)
    next();
  } catch (error) {
    console.error('Error in authenticate middleware:', error.message);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

export const authorize = (role) => {
  return async (req, res, next) => {
    try {
      // Logic for authorizing a user based on their role
      next();
    } catch (error) {
      console.error('Error in authorize middleware:', error.message);
      res.status(403).json({ error: 'Authorization failed.' });
    }
  };
};
