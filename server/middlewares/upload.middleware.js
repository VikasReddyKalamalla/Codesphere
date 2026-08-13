const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(name && key && secret && !name.includes('your_') && name.trim() !== '');
};

const createStorage = (folderName) => {
  const uploadDir = path.join(__dirname, '../uploads', folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      cb(null, `${basename}-${uniqueSuffix}${ext}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  // Accept all resource uploads (PDF, PPT, DOCX, ZIP, MP4, images, code files, etc.)
  cb(null, true);
};

const uploadAvatar      = multer({ storage: createStorage('avatar'),      fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });  // 10MB
const uploadResource    = multer({ storage: createStorage('resource'),    fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
const uploadCertificate = multer({ storage: createStorage('certificate'), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });  // 10MB
const uploadSandbox     = multer({ storage: createStorage('sandbox'),     fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });  // 50MB

module.exports = { uploadAvatar, uploadResource, uploadCertificate, uploadSandbox, isCloudinaryConfigured };

