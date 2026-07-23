const Download = require('../models/Download');
const Resource = require('../models/Resource');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── TRACK DOWNLOAD ───────────────────────────────────────────────────────────
const trackDownload = async (userId, resourceId, ipAddress = '') => {
  const resource = await Resource.findById(resourceId);
  if (!resource) throw createError('Resource not found', 404);

  // Record download
  await Download.create({ userId, resourceId, ipAddress });

  // Increment downloadsCount on resource
  await Resource.findByIdAndUpdate(resourceId, { $inc: { downloadsCount: 1 } });

  return { message: 'Download tracked successfully' };
};

// ─── GET DOWNLOAD HISTORY (by resource) ───────────────────────────────────────
const getDownloadHistory = async (resourceId, { page = 1, limit = 20 }) => {
  const total = await Download.countDocuments({ resourceId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const downloads = await Download.find({ resourceId })
    .populate('userId', 'fullName avatar')
    .sort({ downloadedAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, downloads };
};

// ─── GET USER DOWNLOAD HISTORY ────────────────────────────────────────────────
const getUserDownloads = async (userId, { page = 1, limit = 20 }) => {
  const total = await Download.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const downloads = await Download.find({ userId })
    .populate({
      path:   'resourceId',
      select: 'title description thumbnail resourceType category',
      populate: { path: 'category', select: 'name icon' },
    })
    .sort({ downloadedAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, downloads };
};

module.exports = { trackDownload, getDownloadHistory, getUserDownloads };
