const express = require('express');
const router = express.Router({ mergeParams: true });

const { getWorkspaceAnalytics } = require('../controllers/workspaceAnalytics.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, getWorkspaceAnalytics);

module.exports = router;
