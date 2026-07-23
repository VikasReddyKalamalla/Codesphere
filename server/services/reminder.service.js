const SessionReminder = require('../models/SessionReminder');
const LiveSession     = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Reminder offset map ──────────────────────────────────────────────────────
const OFFSETS = {
  '24h':    24 * 60 * 60 * 1000,
  '1h':     1  * 60 * 60 * 1000,
  '15min':  15 * 60 * 1000,
};

// ─── CREATE REMINDER ──────────────────────────────────────────────────────────
const createReminder = async (sessionId, userId, body) => {
  const { reminderType = '1h', customMinutes } = body;

  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.status === 'completed' || session.status === 'cancelled') {
    throw createError('Cannot set reminder for a completed or cancelled session', 400);
  }

  let remindAt;

  if (reminderType === 'custom') {
    if (!customMinutes || customMinutes < 5) {
      throw createError('Custom reminder must be at least 5 minutes before the session', 400);
    }
    remindAt = new Date(session.startTime.getTime() - customMinutes * 60 * 1000);
  } else {
    remindAt = new Date(session.startTime.getTime() - OFFSETS[reminderType]);
  }

  if (remindAt < new Date()) {
    throw createError('Reminder time has already passed', 400);
  }

  // Upsert — allow updating existing reminder of same type
  const reminder = await SessionReminder.findOneAndUpdate(
    { sessionId, userId, reminderType },
    { remindAt, isSent: false },
    { upsert: true, new: true }
  );

  return reminder;
};

// ─── GET REMINDERS ────────────────────────────────────────────────────────────
const getReminders = async (sessionId, userId) => {
  return SessionReminder.find({ sessionId, userId }).sort({ remindAt: 1 });
};

// ─── DELETE REMINDER ──────────────────────────────────────────────────────────
const deleteReminder = async (reminderId, userId) => {
  const reminder = await SessionReminder.findById(reminderId);
  if (!reminder) throw createError('Reminder not found', 404);

  if (reminder.userId.toString() !== userId.toString()) {
    throw createError('You can only delete your own reminders', 403);
  }

  await reminder.deleteOne();
  return { message: 'Reminder deleted successfully' };
};

module.exports = { createReminder, getReminders, deleteReminder };
