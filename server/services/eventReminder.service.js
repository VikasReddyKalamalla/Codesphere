const EventReminder = require('../models/EventReminder');
const Event         = require('../models/Event');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Reminder offset map ──────────────────────────────────────────────────────
const OFFSETS = {
  '7d': 7  * 24 * 60 * 60 * 1000,
  '1d': 1  * 24 * 60 * 60 * 1000,
  '1h': 1  * 60 * 60 * 1000,
};

// ─── CREATE REMINDER ──────────────────────────────────────────────────────────
const createReminder = async (eventId, userId, body) => {
  const { reminderType = '1d', customMinutes } = body;

  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  if (event.status === 'completed' || event.status === 'cancelled') {
    throw createError('Cannot set reminder for a completed or cancelled event', 400);
  }

  let remindAt;

  if (reminderType === 'custom') {
    if (!customMinutes || customMinutes < 5) {
      throw createError('Custom reminder must be at least 5 minutes before the event', 400);
    }
    remindAt = new Date(event.startDate.getTime() - customMinutes * 60 * 1000);
  } else {
    remindAt = new Date(event.startDate.getTime() - OFFSETS[reminderType]);
  }

  if (remindAt < new Date()) {
    throw createError('Reminder time has already passed', 400);
  }

  // Upsert — update existing reminder of same type for this user
  const reminder = await EventReminder.findOneAndUpdate(
    { eventId, userId, reminderType },
    { remindAt, customMinutes: reminderType === 'custom' ? customMinutes : null, isSent: false },
    { upsert: true, new: true }
  );

  return reminder;
};

// ─── GET REMINDERS ────────────────────────────────────────────────────────────
const getReminders = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  return EventReminder.find({ eventId, userId }).sort({ remindAt: 1 });
};

// ─── DELETE REMINDER ──────────────────────────────────────────────────────────
const deleteReminder = async (reminderId, userId) => {
  const reminder = await EventReminder.findById(reminderId);
  if (!reminder) throw createError('Reminder not found', 404);

  if (reminder.userId.toString() !== userId.toString()) {
    throw createError('You can only delete your own reminders', 403);
  }

  await reminder.deleteOne();
  return { message: 'Reminder deleted successfully' };
};

module.exports = { createReminder, getReminders, deleteReminder };
