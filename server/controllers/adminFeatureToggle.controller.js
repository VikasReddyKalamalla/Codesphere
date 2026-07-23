const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const featureService = require('../services/adminFeatureToggle.service');

const getFeatureToggles = asyncHandler(async (req, res) => {
  const result = await featureService.getFeatureToggles(req.query);
  successResponse(res, 200, 'Feature toggles fetched', result);
});

const updateFeatureToggle = asyncHandler(async (req, res) => {
  const toggle = await featureService.updateFeatureToggle(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, 200, 'Feature toggle updated', { toggle });
});

module.exports = { getFeatureToggles, updateFeatureToggle };
