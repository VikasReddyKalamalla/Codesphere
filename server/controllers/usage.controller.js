const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const usageService = require('../services/usage.service');

const getUsageData = asyncHandler(async (req, res) => {
  const data = await usageService.getUsageData(req.user._id);
  return successResponse(res, 200, 'Usage metrics fetched successfully', data);
});

module.exports = {
  getUsageData,
};
