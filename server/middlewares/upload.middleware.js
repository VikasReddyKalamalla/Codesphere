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

  const diskStorage = multer.diskStorage({
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

  if (isCloudinaryConfigured()) {
    try {
      const { CloudinaryStorage } = require('multer-storage-cloudinary');
      const cloudinary = require('../config/cloudinary');
      return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
          const ext = path.extname(file.originalname || '').toLowerCase().replace('.', '');
          const isPdf = ext === 'pdf' || file.mimetype === 'application/pdf';
          return {
            folder: `codesphere/${folderName}`,
            resource_type: isPdf ? 'raw' : 'auto',
            type: 'upload',
            access_mode: 'public',
          };
        },
      });
    } catch (err) {
      console.warn(`[UploadMiddleware] Cloudinary storage init failed: ${err.message}. Using local disk storage fallback.`);
    }
  }

  return diskStorage;
};

const fileFilter = (req, file, cb) => {
  // Accept all resource uploads (PDF, PPT, DOCX, ZIP, MP4, images, code files, etc.)
  cb(null, true);
};

const uploadAvatar      = multer({ storage: createStorage('avatar'),      fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });  // 5MB
const uploadResource    = multer({ storage: createStorage('resource'),    fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
const uploadCertificate = multer({ storage: createStorage('certificate'), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });  // 5MB
const uploadSandbox     = multer({ storage: createStorage('sandbox'),     fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });  // 20MB

module.exports = { uploadAvatar, uploadResource, uploadCertificate, uploadSandbox };

