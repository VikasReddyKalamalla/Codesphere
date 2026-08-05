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
  // Accept all resource uploads (PDF, PPT, DOCX, ZIP, MP4, images, code files, etc.)
  cb(null, true);
};

const uploadAvatar    = multer({ storage: storage('avatar'),      fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });  // 5MB
const uploadResource  = multer({ storage: storage('resource'),    fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
const uploadCertificate = multer({ storage: storage('certificate'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
const uploadSandbox   = multer({ storage: storage('sandbox'),     fileFilter, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

module.exports = { uploadAvatar, uploadResource, uploadCertificate, uploadSandbox };
