import db from '../config/db.js';

export const uploadContentService = async (description, userId, classId, ispublic) => {
  const sql = 'INSERT INTO content (description, userId, class_id, ispublic, approval_status) VALUES (?, ?, ?, ?, ?)';
  const values = [description, userId, classId, ispublic, 'pending'];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};

export const getAllContentService = async (userId) => {
  const sql = `
    SELECT c.id, c.title, c.description, c.userId, c.class_id, c.ispublic, c.approval_status, c.created_at, u.name as submitter, cf.type, cf.file_url
    FROM content c
    LEFT JOIN users u ON c.userId = u.id
    LEFT JOIN content_files cf ON c.id = cf.content_id
    WHERE c.userId = ? OR c.ispublic = 1
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
  const { title, description, classId, ispublic } = contentData;
  const sql = 'INSERT INTO content (title, description, userId, class_id, ispublic, approval_status) VALUES (?, ?, ?, ?, ?)';
  const values = [title. description, userId, classId, ispublic, 'pending'];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};

export const addCommentToContentService = async (contentId, commentData, userId) => {
  const { comment_text, comment_video, comment_music, comment_emoji, comment_image } = commentData;
  const sql = 'INSERT INTO comments (content_id, userId, comment_text, comment_video, comment_music, comment_emoji, comment_image) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [contentId, userId, comment_text, comment_video, comment_music, comment_emoji, comment_image];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};

export const getCommentsByContentIdService = async (contentId) => {
  const sql = 'SELECT * FROM comments WHERE content_id = ?';
  const [comments] = await db.execute(sql, [contentId]);
  return comments;
};

export const getClarionContentService = async () => {
  const sql = 'SELECT * FROM clarion_content ORDER BY created_at DESC';
  const [content] = await db.execute(sql);
  return content;
};

export const uploadClarionContentService = async (files, clarionContent) => {
  const contentId = uuidv4();
  const filePromises = files.map(file => {
    return db.execute('INSERT INTO clarion_content (id, type, file_url, clarionContent) VALUES (?, ?, ?, ?)', [contentId, file.type, file.fileUrl, clarionContent]);
  });
  await Promise.all(filePromises);
  return contentId;
};