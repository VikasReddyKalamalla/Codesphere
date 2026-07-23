const express = require('express');
const router  = express.Router();

const { getMyFeatures, checkAccess } = require('../controllers/feature.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Feature Access APIs ──────────────────────────────────────────────────────
router.get('/',       protect, getMyFeatures);
router.get('/access', protect, checkAccess);

module.exports = router;
