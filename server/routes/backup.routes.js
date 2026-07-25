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

// All backup routes require admin access
router.use(protect);
router.use(restrictTo('admin'));

// Backup endpoints
router.post('/full', triggerFullBackup);
router.post('/mongodb', backupMongoDB);
router.post('/redis', backupRedis);
router.get('/list', listBackups);
router.post('/restore', restoreBackup);
router.post('/cleanup', cleanupBackups);

module.exports = router;
