const announcementService = require('../services/announcement.service');

const getAllAnnouncements = async (req, res) => {
  const result = await announcementService.getAllAnnouncements(req.query);
  res.status(200).json({
    success: true,
    ...result,
  });
};

const getAnnouncementById = async (req, res) => {
  const announcement = await announcementService.getAnnouncementById(req.params.id);
  res.status(200).json({
    success: true,
    announcement,
  });
};

const createAnnouncement = async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Announcement posted successfully',
    announcement,
  });
};

const broadcastAnnouncement = async (req, res) => {
  const result = await announcementService.broadcastAnnouncement(
    req.params.id,
    req.user._id
  );
  res.status(200).json({
    success: true,
    ...result,
  });
};

const updateAnnouncement = async (req, res) => {
  const announcement = await announcementService.updateAnnouncement(
    req.params.id,
    req.body,
    req.user._id
  );
  res.status(200).json({
    success: true,
    message: 'Announcement updated successfully',
    announcement,
  });
};

const togglePinAnnouncement = async (req, res) => {
  const announcement = await announcementService.togglePinAnnouncement(req.params.id);
  res.status(200).json({
    success: true,
    message: announcement.isPinned ? 'Announcement pinned to top' : 'Announcement unpinned',
    announcement,
  });
};

const likeAnnouncement = async (req, res) => {
  const announcement = await announcementService.likeAnnouncement(req.params.id);
  res.status(200).json({
    success: true,
    announcement,
  });
};

const repostAnnouncement = async (req, res) => {
  const announcement = await announcementService.repostAnnouncement(req.params.id);
  res.status(200).json({
    success: true,
    announcement,
  });
};

const deleteAnnouncement = async (req, res) => {
  const result = await announcementService.deleteAnnouncement(req.params.id);
  res.status(200).json({
    success: true,
    ...result,
  });
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  broadcastAnnouncement,
  updateAnnouncement,
  togglePinAnnouncement,
  likeAnnouncement,
  repostAnnouncement,
  deleteAnnouncement,
};
