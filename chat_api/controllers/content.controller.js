export const getAllContent = async (req, res) => {
    try {
      // Business logic for fetching all content
    } catch (error) {
      console.error('Error in getAllContent:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching content.' });
    }
  };
  
  export const getContentById = async (req, res) => {
    try {
      // Business logic for fetching content by ID
    } catch (error) {
      console.error('Error in getContentById:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching content by ID.' });
    }
  };
  
  export const createContent = async (req, res) => {
    try {
      // Business logic for creating content
    } catch (error) {
      console.error('Error in createContent:', error.message);
      res.status(500).json({ error: 'An error occurred while creating content.' });
    }
  };
  
  export const addCommentToContent = async (req, res) => {
    try {
      // Business logic for adding a comment to content
    } catch (error) {
      console.error('Error in addCommentToContent:', error.message);
      res.status(500).json({ error: 'An error occurred while adding a comment.' });
    }
  };
  
  export const getCommentsByContentId = async (req, res) => {
    try {
      // Business logic for fetching comments for specific content
    } catch (error) {
      console.error('Error in getCommentsByContentId:', error.message);
      res.status(500).json({ error: 'An error occurred while fetching comments.' });
    }
  };
  