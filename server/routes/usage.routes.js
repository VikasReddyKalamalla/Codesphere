const express = require('express');
const router = express.Router();
const { getUsageData } = require('../controllers/usage.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/metrics', protect, getUsageData);

module.exports = router;
