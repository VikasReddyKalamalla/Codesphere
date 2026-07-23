const path = require('path');

/**
 * Generate unique filename with timestamp
 * @param {Object} file - Multer file object
 * @returns {String} Unique filename
 */
const generateUniqueFilename = (file) => {
  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext).replace(/\s+/g, '_');
  return `${basename}_${timestamp}${ext}`;
};

/**
 * Get file upload destination path
 * @param {String} type - Upload type (avatar, resource, certificate, sandbox)
 * @returns {String} Upload path
 */
const getUploadPath = (type = 'resources') => {
  const uploadPaths = {
    avatar: 'uploads/avatars',
    resource: 'uploads/resources',
    certificate: 'uploads/certificates',
    sandbox: 'uploads/sandbox',
  };
  return uploadPaths[type] || 'uploads/resources';
};

module.exports = { generateUniqueFilename, getUploadPath };
