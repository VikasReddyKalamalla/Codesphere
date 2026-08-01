const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const resourceService     = require('../services/resource.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

// GET /api/resources
const getAllResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getAllResources(req.query);
  return successResponse(res, 200, 'Resources fetched successfully', data);
});

// GET /api/resources/:id
const getResourceById = asyncHandler(async (req, res) => {
  const data = await resourceService.getResourceById(req.params.id);
  return successResponse(res, 200, 'Resource fetched successfully', data);
});

// POST /api/resources
const createResource = asyncHandler(async (req, res) => {
  const data = await resourceService.createResource(req.body, req.file, req.user._id);
  broadcastDataChange('resource', 'created', data);
  return successResponse(res, 201, 'Resource created successfully', data);
});

// PUT /api/resources/:id
const updateResource = asyncHandler(async (req, res) => {
  const data = await resourceService.updateResource(req.params.id, req.body, req.file, req.user._id, req.user.role);
  broadcastDataChange('resource', 'updated', data);
  return successResponse(res, 200, 'Resource updated successfully', data);
});

// DELETE /api/resources/:id
const deleteResource = asyncHandler(async (req, res) => {
  await resourceService.deleteResource(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('resource', 'deleted', { id: req.params.id });
  return successResponse(res, 200, 'Resource deleted successfully');
});

// POST /api/resources/:id/like
const toggleLike = asyncHandler(async (req, res) => {
  const data = await resourceService.toggleLike(req.params.id, req.user._id);
  return successResponse(res, 200, 'Like toggled successfully', data);
});

// POST /api/resources/:id/rate
const rateResource = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const data = await resourceService.rateResource(req.params.id, req.user._id, value);
  return successResponse(res, 200, 'Resource rated successfully', data);
});

// GET /api/resources/featured
const getFeaturedResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getFeaturedResources();
  return successResponse(res, 200, 'Featured resources fetched successfully', data);
});

// GET /api/resources/trending
const getTrendingResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getTrendingResources();
  return successResponse(res, 200, 'Trending resources fetched successfully', data);
});

// GET /api/resources/recommended
const getRecommendedResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getRecommendedResources();
  return successResponse(res, 200, 'Recommended resources fetched successfully', data);
});

// POST /api/resources/:id/comments
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const data = await resourceService.addComment(req.params.id, req.user._id, req.user, text);
  return successResponse(res, 201, 'Comment added successfully', data);
});

// POST /api/resources/:id/download
const trackDownload = asyncHandler(async (req, res) => {
  const data = await resourceService.trackDownload(req.params.id);
  return successResponse(res, 200, 'Download tracked successfully', data);
});

// GET /api/resources/analytics
const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const data = await resourceService.getAnalyticsSummary();
  return successResponse(res, 200, 'Analytics summary fetched successfully', data);
});

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleLike,
  rateResource,
  getFeaturedResources,
  getTrendingResources,
  getRecommendedResources,
  addComment,
  trackDownload,
  getAnalyticsSummary,
};
