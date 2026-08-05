const express = require('express');
const router  = express.Router();
const { register, login, googleAuth, getMe, updateProfile, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);


// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get ('/me',      protect, getMe);
router.put ('/profile', protect, updateProfile);
router.post('/logout',  protect, logout);

module.exports = router;
