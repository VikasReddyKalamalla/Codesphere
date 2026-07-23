const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const announcementService = require('../services/adminAnnouncement.service');

const getAnnouncements = asyncHandler(async (req, res) => {
  const result = await announcementService.getAnnouncements(req.query);
  successResponse(res, 200, 'Announcements fetched', result);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.body, req.user._id);
  successResponse(res, 201, 'Announcement created', { announcement });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.updateAnnouncement(
    req.params.id,
    req.body,
    req.user._id
  );
  successResponse(res, 200, 'Announcement updated', { announcement });
});

const broadcastAnnouncement = asyncHandler(async (req, res) => {
  const result = await announcementService.broadcastAnnouncement(req.params.id, req.user._id);
  successResponse(res, 200, result.message, { recipientCount: result.recipientCount });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const result = await announcementService.deleteAnnouncement(req.params.id, req.user._id);
  successResponse(res, 200, result.message, {});
});

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  broadcastAnnouncement,
  deleteAnnouncement,
};
