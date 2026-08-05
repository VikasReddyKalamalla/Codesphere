const express = require('express');
const router = express.Router();

const {
  triggerFullBackup,
  backupMongoDB,
  backupRedis,
  listBackups,
  restoreBackup,
  cleanupBackups,
} = require('../controllers/backup.controller');

const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const { restrictAdminIP, requireAdminMFA } = require('../middlewares/adminSecurity.middleware');

// All backup routes require admin access, IP whitelisting check
router.use(protect);
router.use(restrictTo('admin'));
router.use(restrictAdminIP);

// Backup endpoints
router.get('/list',       listBackups);
router.post('/full',      triggerFullBackup);
router.post('/mongodb',   backupMongoDB);
router.post('/redis',     backupRedis);

// Sensitive Admin Operations Require MFA Token Verification
router.post('/restore',   requireAdminMFA, restoreBackup);
router.post('/cleanup',   requireAdminMFA, cleanupBackups);

module.exports = router;
