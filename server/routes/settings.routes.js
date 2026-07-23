const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', settingsController.getSettings);
router.put('/section/:section', settingsController.updateSettingsSection);

router.get('/devices', settingsController.getDevices);
router.delete('/devices/:deviceId', settingsController.revokeDevice);
router.post('/devices/logout-all', settingsController.revokeAllDevices);

router.get('/api-keys', settingsController.getApiKeys);
router.post('/api-keys', settingsController.generateApiKey);
router.delete('/api-keys/:keyId', settingsController.revokeApiKey);

router.get('/backups', settingsController.getBackups);
router.post('/backups', settingsController.triggerBackup);

router.get('/activity-logs', settingsController.getActivityLogs);
router.get('/export-data', settingsController.exportUserData);

module.exports = router;
