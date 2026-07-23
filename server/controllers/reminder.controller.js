const asyncHandler          = require('../utils/asyncHandler');
const { successResponse }   = require('../utils/apiResponse');
const reminderService       = require('../services/reminder.service');

// POST /api/sessions/:id/reminder
const createReminder = asyncHandler(async (req, res) => {
  const data = await reminderService.createReminder(req.params.id, req.user._id, req.body);
  return successResponse(res, 201, 'Reminder set successfully', data);
});

// GET /api/sessions/:id/reminders
const getReminders = asyncHandler(async (req, res) => {
  const data = await reminderService.getReminders(req.params.id, req.user._id);
  return successResponse(res, 200, 'Reminders fetched successfully', data);
});

// DELETE /api/reminders/:id
const deleteReminder = asyncHandler(async (req, res) => {
  const data = await reminderService.deleteReminder(req.params.id, req.user._id);
  return successResponse(res, 200, 'Reminder deleted successfully', data);
});

module.exports = { createReminder, getReminders, deleteReminder };
