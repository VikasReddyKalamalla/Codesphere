const express = require('express');
const router  = express.Router();
const { register, login, getMe, updateProfile, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login',    login);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get ('/me',      protect, getMe);
router.put ('/profile', protect, updateProfile);
router.post('/logout',  protect, logout);

module.exports = router;
