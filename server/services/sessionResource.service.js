const SessionResource = require('../models/SessionResource');
const LiveSession = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getResources = async (sessionId) => {
  return SessionResource.find({ sessionId }).sort({ createdAt: -1 });
};

const uploadResource = async (sessionId, userId, body) => {
  const { title, url, resourceType, fileSizeMB } = body;
  if (!title) throw createError('Title is required', 400);
  if (!url) throw createError('URL is required', 400);

  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can upload resources for this session', 403);
  }

  return SessionResource.create({
    sessionId,
    title,
    url,
    resourceType: resourceType || 'pdf',
    fileSizeMB: fileSizeMB || 0,
    uploadedBy: userId,
  });
};

const deleteResource = async (resourceId, userId) => {
  const resource = await SessionResource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  const session = await LiveSession.findById(resource.sessionId);
  const isHost = session && session.host.toString() === userId.toString();
  const isUploader = resource.uploadedBy.toString() === userId.toString();

  if (!isHost && !isUploader) {
    throw createError('You are not authorized to delete this resource', 403);
  }

  await resource.deleteOne();
  return { message: 'Resource deleted successfully' };
};

module.exports = {
  getResources,
  uploadResource,
  deleteResource,
};
