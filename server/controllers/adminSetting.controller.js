const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const settingService = require('../services/adminSetting.service');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.getSettings();
  successResponse(res, 200, 'Settings fetched', { settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingService.updateSettings(req.body, req.user._id);
  successResponse(res, 200, 'Settings updated', { settings });
});

module.exports = { getSettings, updateSettings };
