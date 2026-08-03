const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

router.post('/create', workspaceController.createWorkspace);
router.post('/start', workspaceController.startWorkspace);
router.post('/stop', workspaceController.stopWorkspace);
router.delete('/delete', workspaceController.deleteWorkspace);
router.delete('/', workspaceController.deleteWorkspace);
router.get('/status', workspaceController.getStatus);
router.get('/status/:workspaceId', workspaceController.getStatus);
router.get('/url', workspaceController.getUrl);
router.get('/url/:workspaceId', workspaceController.getUrl);

module.exports = router;
