const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sessionResourceService = require('../services/sessionResource.service');

const getResources = asyncHandler(async (req, res) => {
  const data = await sessionResourceService.getResources(req.params.id);
  return successResponse(res, 200, 'Resources retrieved successfully', data);
});

const uploadResource = asyncHandler(async (req, res) => {
  const data = await sessionResourceService.uploadResource(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Resource uploaded successfully', data);
});

const deleteResource = asyncHandler(async (req, res) => {
  const data = await sessionResourceService.deleteResource(req.params.rId, req.user._id);
  return successResponse(res, 200, 'Resource deleted successfully', data);
});

module.exports = {
  getResources,
  uploadResource,
  deleteResource,
};
