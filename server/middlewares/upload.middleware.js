const multer = require('multer');
const path = require('path');
const { generateUniqueFilename, getUploadPath } = require('../utils/fileUpload');

const storage = (type) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getUploadPath(type));
    },
    filename: (req, file, cb) => {
      cb(null, generateUniqueFilename(file));
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|doc|docx/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const uploadAvatar    = multer({ storage: storage('avatar'),      fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });  // 2MB
const uploadResource  = multer({ storage: storage('resource'),    fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB
const uploadCertificate = multer({ storage: storage('certificate'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
const uploadSandbox   = multer({ storage: storage('sandbox'),     fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

module.exports = { uploadAvatar, uploadResource, uploadCertificate, uploadSandbox };
