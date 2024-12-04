// utils/uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// Set the destination and filename for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder to store the uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; // To avoid name collision
    cb(null, filename);
  }
});

// Only accept certain file types (e.g., texts, musics, images, videos, emoji, gifs, etc.)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Max size: 100MB
  fileFilter: fileFilter
});

export default uploadMiddleware;

//To allow multiple files to be uploaded into same content