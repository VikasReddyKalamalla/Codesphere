const announcementService = require('../services/announcement.service');

/**
 * GET /api/announcements
 * Get all announcements (Admin only).
 */
const getAllAnnouncements = async (req, res) => {
  const result = await announcementService.getAllAnnouncements(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * GET /api/announcements/:id
 * Get a single announcement by ID (Admin only).
 */
const getAnnouncementById = async (req, res) => {
  const announcement = await announcementService.getAnnouncementById(req.params.id);

  res.status(200).json({
    success: true,
    announcement,
  });
};

/**
 * POST /api/announcements
 * Create a new announcement (Admin only).
 */
const createAnnouncement = async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Announcement created successfully',
    announcement,
  });
};

/**
 * POST /api/announcements/:id/broadcast
 * Broadcast an announcement to its target audience (Admin only).
 */
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

/**
 * PUT /api/announcements/:id
 * Update an announcement (Admin only).
 */
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

/**
 * DELETE /api/announcements/:id
 * Delete an announcement (Admin only).
 */
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
  deleteAnnouncement,
};
