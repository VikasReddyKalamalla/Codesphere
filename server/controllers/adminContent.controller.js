const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const contentService = require('../services/adminContent.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

const emitContentChange = (action, payload = {}) => {
  try {
    getIO().emit('learning_path_changed', { action, timestamp: Date.now() });
    broadcastDataChange('learning', action, payload);
  } catch (err) {
    // ignore socket errors if disconnected
  }
};

const getLearningPaths = asyncHandler(async (req, res) => {
  const result = await contentService.getLearningPaths(req.query);
  successResponse(res, 200, 'Learning paths fetched', result);
});

const createLearningPath = asyncHandler(async (req, res) => {
  const result = await contentService.createLearningPath(req.body, req.user._id);
  emitContentChange('created');
  successResponse(res, 201, 'Learning path created', result);
});

const updateLearningPath = asyncHandler(async (req, res) => {
  const result = await contentService.updateLearningPath(req.params.id, req.body, req.user._id);
  emitContentChange('updated');
  successResponse(res, 200, 'Learning path updated', result);
});

const deleteLearningPath = asyncHandler(async (req, res) => {
  const result = await contentService.deleteLearningPath(req.params.id, req.user._id);
  emitContentChange('deleted');
  successResponse(res, 200, result.message, {});
});

const duplicateLearningPath = asyncHandler(async (req, res) => {
  const result = await contentService.duplicateLearningPath(req.params.id, req.user._id);
  emitContentChange('duplicated');
  successResponse(res, 201, 'Learning path duplicated', result);
});

const publishLearningPath = asyncHandler(async (req, res) => {
  const result = await contentService.publishLearningPath(req.params.id, req.user._id);
  emitContentChange('published');
  successResponse(res, 200, 'Learning path published', result);
});

const archiveLearningPath = asyncHandler(async (req, res) => {
  const result = await contentService.archiveLearningPath(req.params.id, req.user._id);
  emitContentChange('archived');
  successResponse(res, 200, 'Learning path archived', result);
});

const getLearningPathStructure = asyncHandler(async (req, res) => {
  const result = await contentService.getLearningPathStructure(req.params.id);
  successResponse(res, 200, 'Learning path structure fetched', result);
});

const getLearningPathAnalytics = asyncHandler(async (req, res) => {
  const result = await contentService.getLearningPathAnalytics(req.params.id);
  successResponse(res, 200, 'Learning path analytics fetched', result);
});

const reorderModules = asyncHandler(async (req, res) => {
  const { learningPathId, moduleIds } = req.body;
  const result = await contentService.reorderModules(learningPathId, moduleIds, req.user._id);
  emitContentChange('reordered_modules');
  successResponse(res, 200, result.message);
});

const reorderLessons = asyncHandler(async (req, res) => {
  const { moduleId, lessonIds } = req.body;
  const result = await contentService.reorderLessons(moduleId, lessonIds, req.user._id);
  emitContentChange('reordered_lessons');
  successResponse(res, 200, result.message);
});

const getResources = asyncHandler(async (req, res) => {
  const result = await contentService.getResources(req.query);
  successResponse(res, 200, 'Resources fetched', result);
});

const deleteResource = asyncHandler(async (req, res) => {
  const result = await contentService.deleteResource(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

const getCommunities = asyncHandler(async (req, res) => {
  const result = await contentService.getCommunities(req.query);
  successResponse(res, 200, 'Communities fetched', result);
});

const updateCommunity = asyncHandler(async (req, res) => {
  const community = await contentService.updateCommunity(req.params.id, req.body, req.user._id);
  successResponse(res, 200, 'Community updated', { community });
});

const deleteCommunity = asyncHandler(async (req, res) => {
  const result = await contentService.deleteCommunity(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

const getEvents = asyncHandler(async (req, res) => {
  const result = await contentService.getEvents(req.query);
  successResponse(res, 200, 'Events fetched', result);
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await contentService.updateEvent(req.params.id, req.body, req.user._id);
  successResponse(res, 200, 'Event updated', { event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const result = await contentService.deleteEvent(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

const getSandboxProjects = asyncHandler(async (req, res) => {
  const result = await contentService.getSandboxProjects(req.query);
  successResponse(res, 200, 'Sandbox projects fetched', result);
});

const getWorkspaces = asyncHandler(async (req, res) => {
  const result = await contentService.getWorkspaces(req.query);
  successResponse(res, 200, 'Workspaces fetched', result);
});

const getAssessments = asyncHandler(async (req, res) => {
  const result = await contentService.getAssessments(req.query);
  successResponse(res, 200, 'Assessments fetched', result);
});

const getLiveSessions = asyncHandler(async (req, res) => {
  const result = await contentService.getLiveSessions(req.query);
  successResponse(res, 200, 'Live sessions fetched', result);
});

module.exports = {
  getLearningPaths,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  duplicateLearningPath,
  publishLearningPath,
  archiveLearningPath,
  getLearningPathStructure,
  getLearningPathAnalytics,
  reorderModules,
  reorderLessons,
  getResources,
  deleteResource,
  getCommunities,
  updateCommunity,
  deleteCommunity,
  getEvents,
  updateEvent,
  deleteEvent,
  getSandboxProjects,
  getWorkspaces,
  getAssessments,
  getLiveSessions,
};
