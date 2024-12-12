import dbQuery from '../config/dbQuery.js';
import CustomError from '../utils/CustomError.js';

export const getPendingContentService = async () => {
    // "status" is the column name in the content table that stores the approval status of the content
    // pending is the status of the content that is pending approval by the admin
    // pending content is content that has been uploaded by users but has not been approved by the admin
    
    // pending=0, approved=1, rejected=2;

    const sql = 'SELECT * FROM content WHERE status = "pending"';
  const content = await dbQuery(sql);
  return content;
};

export const approveContentService = async (contentId) => {
  const sql = 'UPDATE content SET status = "approved" WHERE id = ?';
  await dbQuery(sql, [contentId]);
};

export const rejectContentService = async (contentId) => {
  const sql = 'UPDATE content SET status = "rejected" WHERE id = ?';
  await dbQuery(sql, [contentId]);
};

export const manageContentService = async () => {
    const sql = 'SELECT * FROM content';
    const content = await dbQuery(sql);
    return content;
  };

  export const uploadContentService = async (files, description, audience, targetId) => {
    const sql = 'INSERT INTO content (description, audience, target_id, files) VALUES (?, ?, ?, ?)';
    const fileUrls = files.map(file => file.location); // Assuming files are uploaded to S3 and location contains the URL
    await dbQuery(sql, [description, audience, targetId, JSON.stringify(fileUrls)]);
  };

export const manageUsersService = async () => {
  const sql = 'SELECT * FROM users';
  const users = await dbQuery(sql);
  return users;
};

// PostingRights; banUserService =0, unbanUserService =1, grantPostingRightsService =1, and updateUserService functions
// PostingRights; banned=0, unbanned=active=1, grantPostingRightsService =1, and updateUserService functions
export const banUserService = async (userId) => {
  const sql = 'UPDATE users SET postingRight = "banned" WHERE id = ?';
  await dbQuery(sql, [userId]);
};

export const unbanUserService = async (userId) => {
  const sql = 'UPDATE users SET postingRight = "active" WHERE id = ?';
  await dbQuery(sql, [userId]);
};

export const grantPostingRightsService = async (userId) => {
  const sql = 'UPDATE users SET postingRight = "active" WHERE id = ?';
  await dbQuery(sql, [userId]);
};

export const updateUserService = async (userId, rating, userclass) => {
  const sql = 'UPDATE users SET rating = ?, userclass = ? WHERE id = ?';
  await dbQuery(sql, [rating, userclass, userId]);
  const updatedUser = await dbQuery('SELECT * FROM users WHERE id = ?', [userId]);
  return updatedUser[0];
};

