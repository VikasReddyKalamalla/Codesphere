const express = require('express');
const router  = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadAvatar: avatarUpload } = require('../middlewares/upload.middleware');

router.get('/',          protect, getProfile);
router.put('/',          protect, updateProfile);
router.post('/avatar',   protect, avatarUpload.single('avatar'), uploadAvatar);

module.exports = router;
