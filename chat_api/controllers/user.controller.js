export const getUserProfile = async (req, res) => {
    try {
      // Business logic for fetching user profile
    } catch (error) {
      console.error('Error in getUserProfile:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
    }
  };
  
  export const updateUserProfile = async (req, res) => {
    try {
      // Business logic for updating user profile
    } catch (error) {
      console.error('Error in updateUserProfile:', error.message);
      res.status(500).json({ error: 'An error occurred while updating the user profile.' });
    }
  };
  