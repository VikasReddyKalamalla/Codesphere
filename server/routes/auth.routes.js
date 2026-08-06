const express = require('express');
const router  = express.Router();
const {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  logout,
  setup2FA,
  verify2FA,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register',        register);
router.post('/login',           login);
router.post('/google',          googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get ('/me',         protect, getMe);
router.put ('/profile',    protect, updateProfile);
router.post('/logout',     protect, logout);
router.post('/2fa/setup',  protect, setup2FA);
router.post('/2fa/verify', protect, verify2FA);

module.exports = router;
