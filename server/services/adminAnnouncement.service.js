const AnnouncementNotification = require('../models/AnnouncementNotification');
const announcementService = require('./announcement.service');
const AdminLog = require('../models/AdminLog');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all announcements — delegates to the shared announcement service.
 */
const getAnnouncements = async (query) => {
  return announcementService.getAllAnnouncements(query);
};

/**
 * Create an announcement draft.
 */
const createAnnouncement = async (data, adminId) => {
  const announcement = await announcementService.createAnnouncement(data, adminId);

  await AdminLog.create({
    admin: adminId,
    action: 'Announcement Created',
    module: 'Announcements',
    affectedResourceId: announcement._id,
    affectedResourceType: 'Announcement',
    details: { title: announcement.title, targetAudience: announcement.targetAudience },
  });

  return announcement;
};

/**
 * Update an announcement.
 */
const updateAnnouncement = async (announcementId, data, adminId) => {
  const announcement = await announcementService.updateAnnouncement(
    announcementId,
    data,
    adminId
  );

  await AdminLog.create({
    admin: adminId,
    action: 'Announcement Updated',
    module: 'Announcements',
    affectedResourceId: announcementId,
    affectedResourceType: 'Announcement',
    details: data,
  });

  return announcement;
};

/**
 * Broadcast an announcement to the target audience.
 */
const broadcastAnnouncement = async (announcementId, adminId) => {
  const result = await announcementService.broadcastAnnouncement(announcementId, adminId);

  await AdminLog.create({
    admin: adminId,
    action: 'Announcement Broadcast',
    module: 'Announcements',
    affectedResourceId: announcementId,
    affectedResourceType: 'Announcement',
    details: { recipientCount: result.recipientCount },
  });

  return result;
};

/**
 * Delete an announcement.
 */
const deleteAnnouncement = async (announcementId, adminId) => {
  const result = await announcementService.deleteAnnouncement(announcementId);

  await AdminLog.create({
    admin: adminId,
    action: 'Announcement Deleted',
    module: 'Announcements',
    affectedResourceId: announcementId,
    affectedResourceType: 'Announcement',
  });

  return result;
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  broadcastAnnouncement,
  deleteAnnouncement,
};
