import dbQuery from '../config/dbQuery.js';
import { v4 as uuidv4 } from 'uuid';

export const getPendingContentService = async () => {
  const sql = 'SELECT * FROM content WHERE approval_status = "pending"';
  const content = await dbQuery(sql);
  return content;
};

export const approveContentService = async (contentId) => {
  const sql = 'UPDATE content SET approval_status = "approved" WHERE id = ?';
  await dbQuery(sql, [contentId]);
};

export const rejectContentService = async (contentId) => {
  const sql = 'UPDATE content SET approval_status = "rejected" WHERE id = ?';
  await dbQuery(sql, [contentId]);
};

export const manageContentService = async () => {
  const sql = 'SELECT * FROM content';
  const content = await dbQuery(sql);
  return content;
};

export const uploadContentService = async (files, title, description, audience) => {
  const sql = 'INSERT INTO content (title, description, audience, files) VALUES (?, ?, ?, ?)';
  const fileUrls = files.map(file => file.location); // Assuming files are uploaded to S3 and location contains the URL
  await dbQuery(sql, [title, description, audience, JSON.stringify(fileUrls)]);
};

export const uploadClarionContentService = async (files, clarionContent) => {
  const sql = 'INSERT INTO clarion_content (id, type, file_url, clarionContent) VALUES (?, ?, ?, ?)';
  const contentId = uuidv4();
  const filePromises = files.map(file => {
    return dbQuery(sql, [contentId, file.type, file.location, clarionContent]);
  });
  await Promise.all(filePromises);
};

export const manageUsersService = async () => {
  const sql = 'SELECT * FROM users';
  const users = await dbQuery(sql);
  return users;
};

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