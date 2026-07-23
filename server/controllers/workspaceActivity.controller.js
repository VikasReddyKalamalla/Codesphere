const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const activityService       = require('../services/workspaceActivity.service');

// GET /api/workspaces/:id/activities
const getActivities = asyncHandler(async (req, res) => {
  const data = await activityService.getActivities(req.params.id, req.query);
  return successResponse(res, 200, 'Activities fetched successfully', data);
});

module.exports = { getActivities };
