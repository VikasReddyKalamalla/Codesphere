const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const eventReminderService  = require('../services/eventReminder.service');

// POST /api/events/:id/reminder
const createReminder = asyncHandler(async (req, res) => {
  const data = await eventReminderService.createReminder(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Reminder set successfully', data);
});

// GET /api/events/:id/reminders
const getReminders = asyncHandler(async (req, res) => {
  const data = await eventReminderService.getReminders(req.params.id, req.user._id);
  return successResponse(res, 200, 'Reminders fetched successfully', data);
});

// DELETE /api/event-reminders/:id
const deleteReminder = asyncHandler(async (req, res) => {
  const data = await eventReminderService.deleteReminder(req.params.id, req.user._id);
  return successResponse(res, 200, 'Reminder deleted successfully', data);
});

module.exports = { createReminder, getReminders, deleteReminder };
