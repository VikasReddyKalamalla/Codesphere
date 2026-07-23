const asyncHandler           = require('../utils/asyncHandler');
const { successResponse }    = require('../utils/apiResponse');
const sandboxDownloadService = require('../services/sandboxDownload.service');

// GET /api/downloads
const getUserDownloads = asyncHandler(async (req, res) => {
  const data = await sandboxDownloadService.getUserDownloads(req.user._id, req.query);
  return successResponse(res, 200, 'Download history fetched successfully', data);
});

module.exports = { getUserDownloads };
