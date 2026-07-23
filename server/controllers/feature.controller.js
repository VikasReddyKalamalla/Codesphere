const asyncHandler      = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const featureService    = require('../services/feature.service');

// GET /api/features
const getMyFeatures = asyncHandler(async (req, res) => {
  const data = await featureService.getMyFeatures(req.user._id);
  return successResponse(res, 200, 'Feature access fetched successfully', data);
});

// GET /api/features/access?feature=codexAccess
const checkAccess = asyncHandler(async (req, res) => {
  const { feature } = req.query;
  if (!feature) {
    const { errorResponse } = require('../utils/apiResponse');
    return errorResponse(res, 400, 'Feature name is required');
  }
  const data = await featureService.checkAccess(req.user._id, feature);
  return successResponse(res, 200, 'Feature access checked', data);
});

module.exports = { getMyFeatures, checkAccess };
