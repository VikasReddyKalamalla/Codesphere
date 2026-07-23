const asyncHandler            = require('../utils/asyncHandler');
const { successResponse }     = require('../utils/apiResponse');
const sandboxTemplateService  = require('../services/sandboxTemplate.service');
const sandboxDownloadService  = require('../services/sandboxDownload.service');

// GET /api/sandbox/:id/templates
const getProjectTemplates = asyncHandler(async (req, res) => {
  const data = await sandboxTemplateService.getProjectTemplates(req.params.id);
  return successResponse(res, 200, 'Templates fetched successfully', data);
});

// POST /api/templates
const createTemplate = asyncHandler(async (req, res) => {
  const data = await sandboxTemplateService.createTemplate(req.body, req.user._id, req.user.role);
  return successResponse(res, 201, 'Template created successfully', data);
});

// DELETE /api/templates/:id
const deleteTemplate = asyncHandler(async (req, res) => {
  await sandboxTemplateService.deleteTemplate(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Template deleted successfully');
});

// POST /api/templates/:id/download
const downloadTemplate = asyncHandler(async (req, res) => {
  const ip   = req.ip || req.headers['x-forwarded-for'] || '';
  const data = await sandboxDownloadService.recordDownload(req.params.id, req.user._id, ip);
  return successResponse(res, 200, 'Download recorded. Use the URL to download the file.', data);
});

module.exports = { getProjectTemplates, createTemplate, deleteTemplate, downloadTemplate };
