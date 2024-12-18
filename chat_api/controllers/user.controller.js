import { getUserProfileService, updateUserProfileService } from '../services/user.service.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userProfile = await getUserProfileService(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error in getUserProfile:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updatedProfile = await updateUserProfileService(userId, req.body);
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error in updateUserProfile:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the user profile.' });
    }
};