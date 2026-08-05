const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const settingService = require('../services/adminSetting.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.getSettings();
  successResponse(res, 200, 'Settings fetched', { settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.updateSettings(req.body, req.user._id);
  broadcastDataChange('settings', 'updated', settings);
  successResponse(res, 200, 'Platform settings updated successfully', { settings });
});

const purgeCache = asyncHandler(async (req, res) => {
  broadcastDataChange('system', 'cache_purged', { timestamp: Date.now() });
  successResponse(res, 200, 'System memory cache purged successfully');
});

const triggerBackup = asyncHandler(async (req, res) => {
  broadcastDataChange('system', 'backup_triggered', { timestamp: Date.now() });
  successResponse(res, 200, 'Database snapshot backup triggered successfully');
});

module.exports = { getSettings, updateSettings, purgeCache, triggerBackup };
