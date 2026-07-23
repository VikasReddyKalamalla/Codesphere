const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const moderationService = require('../services/adminModeration.service');

const getModerationQueue = asyncHandler(async (req, res) => {
  const result = await moderationService.getModerationQueue(req.query);
  successResponse(res, 200, 'Moderation queue fetched', result);
});

const approveContent = asyncHandler(async (req, res) => {
  const item = await moderationService.approveContent(
    req.params.id,
    req.user._id,
    req.body.adminNotes
  );
  successResponse(res, 200, 'Content approved', { item });
});

const rejectContent = asyncHandler(async (req, res) => {
  const result = await moderationService.rejectContent(
    req.params.id,
    req.user._id,
    req.body.adminNotes
  );
  successResponse(res, 200, result.message, { item: result.item });
});

const deleteModerationItem = asyncHandler(async (req, res) => {
  const result = await moderationService.deleteModerationItem(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

module.exports = {
  getModerationQueue,
  approveContent,
  rejectContent,
  deleteModerationItem,
};
