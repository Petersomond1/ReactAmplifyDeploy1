import db from '../config/db.js';

export const uploadContentService = async (description, userId, classId, ispublic) => {
  const sql = 'INSERT INTO content (description, user_id, class_id, public, approval_status) VALUES (?, ?, ?, ?, ?)';
  const values = [description, userId, classId, ispublic, 'pending'];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};

export const getAllContentService = async (userId) => {
  const sql = `
    SELECT c.id, c.description, c.user_id, c.class_id, c.public, c.approval_status, c.created_at, u.name as submitter, cf.type, cf.file_url
    FROM content c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN content_files cf ON c.id = cf.content_id
    WHERE c.user_id = ? OR c.public = 1
    ORDER BY c.created_at DESC
  `;
  const [content] = await db.execute(sql, [userId]);
  return content;
};

export const getContentByIdService = async (contentId) => {
  const sql = 'SELECT * FROM content WHERE id = ?';
  const [content] = await db.execute(sql, [contentId]);
  return content[0];
};

export const createContentService = async (contentData, userId) => {
  const { description, classId, ispublic } = contentData;
  const sql = 'INSERT INTO content (description, user_id, class_id, public, approval_status) VALUES (?, ?, ?, ?, ?)';
  const values = [description, userId, classId, ispublic, 'pending'];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};

export const addCommentToContentService = async (contentId, comment, userId) => {
  const sql = 'INSERT INTO comments (content_id, user_id, comment) VALUES (?, ?, ?)';
  const values = [contentId, userId, comment];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};

export const getCommentsByContentIdService = async (contentId) => {
  const sql = 'SELECT * FROM comments WHERE content_id = ?';
  const [comments] = await db.execute(sql, [contentId]);
  return comments;
};