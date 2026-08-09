const express = require('express');
const router  = express.Router();
const { getProfile, updateProfile, uploadAvatar, getPublicProfile, uploadCertificate } = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadAvatar: avatarUpload, uploadCertificate: certificateUpload } = require('../middlewares/upload.middleware');

router.get('/',          protect, getProfile);
router.put('/',          protect, updateProfile);
router.post('/avatar',   protect, avatarUpload.single('avatar'), uploadAvatar);

// Public profile and custom certificates
router.get('/public/:username', getPublicProfile);
router.post('/certificates', protect, certificateUpload.single('certificate'), uploadCertificate);

module.exports = router;
