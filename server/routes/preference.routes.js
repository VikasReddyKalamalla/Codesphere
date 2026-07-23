const express = require('express');
const router  = express.Router();

const {
  getPreferences,
  updatePreferences,
} = require('../controllers/preference.controller');

const { protect } = require('../middlewares/auth.middleware');

// Every user manages their own preferences – auth required
router.get('/', protect, getPreferences);
router.put('/', protect, updatePreferences);

module.exports = router;
