const express = require('express');
const router  = express.Router();

const {
  getLogs,
  getLogById,
} = require('../controllers/log.controller');

const { protect } = require('../middlewares/auth.middleware');

// Logs are read-only – service layer enforces access control
router.get('/',    protect, getLogs);
router.get('/:id', protect, getLogById);

module.exports = router;
