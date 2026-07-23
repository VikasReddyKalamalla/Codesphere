const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const downloadService     = require('../services/download.service');

// POST /api/resources/:id/download
const trackDownload = asyncHandler(async (req, res) => {
  const ip   = req.ip || req.headers['x-forwarded-for'] || '';
  const data = await downloadService.trackDownload(req.user._id, req.params.id, ip);
  return successResponse(res, 200, 'Download tracked successfully', data);
});

// GET /api/resources/:id/download-history
const getDownloadHistory = asyncHandler(async (req, res) => {
  const data = await downloadService.getDownloadHistory(req.params.id, req.query);
  return successResponse(res, 200, 'Download history fetched successfully', data);
});

// GET /api/downloads/me
const getUserDownloads = asyncHandler(async (req, res) => {
  const data = await downloadService.getUserDownloads(req.user._id, req.query);
  return successResponse(res, 200, 'Your download history fetched successfully', data);
});

module.exports = { trackDownload, getDownloadHistory, getUserDownloads };
