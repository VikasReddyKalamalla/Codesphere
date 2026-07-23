const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const taskAttachmentService = require('../services/taskAttachment.service');

// GET /api/tasks/:id/attachments
const getTaskAttachments = asyncHandler(async (req, res) => {
  const data = await taskAttachmentService.getTaskAttachments(req.params.id, req.user._id);
  return successResponse(res, 200, 'Attachments fetched successfully', data);
});

// POST /api/tasks/:id/attachments
const uploadAttachment = asyncHandler(async (req, res) => {
  // File data comes from request body (populated by upload middleware when used)
  const fileData = {
    fileName: req.body.fileName || (req.file && req.file.originalname),
    fileUrl:  req.body.fileUrl  || (req.file && `/uploads/${req.file.filename}`),
    fileType: req.body.fileType || (req.file && req.file.mimetype) || '',
    fileSize: req.body.fileSize || (req.file && req.file.size)    || 0,
  };
  const data = await taskAttachmentService.uploadAttachment(req.params.id, fileData, req.user._id);
  return successResponse(res, 201, 'Attachment uploaded successfully', data);
});

// DELETE /api/attachments/:id
const deleteAttachment = asyncHandler(async (req, res) => {
  const data = await taskAttachmentService.deleteAttachment(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Attachment deleted successfully', data);
});

module.exports = { getTaskAttachments, uploadAttachment, deleteAttachment };
