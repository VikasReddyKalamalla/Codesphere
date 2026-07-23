const SessionAttendance = require('../models/SessionAttendance');
const LiveSession       = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── CHECK IN ─────────────────────────────────────────────────────────────────
const checkIn = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.status !== 'live' && session.status !== 'upcoming') {
    throw createError('Session is not available for check-in', 400);
  }

  let attendance = await SessionAttendance.findOne({ sessionId, userId });

  if (attendance && attendance.joinedAt) {
    throw createError('You have already checked in', 409);
  }

  if (!attendance) {
    attendance = await SessionAttendance.create({ sessionId, userId, joinedAt: new Date() });
  } else {
    attendance.joinedAt = new Date();
    await attendance.save();
  }

  return attendance;
};

// ─── CHECK OUT ────────────────────────────────────────────────────────────────
const checkOut = async (sessionId, userId) => {
  const attendance = await SessionAttendance.findOne({ sessionId, userId });
  if (!attendance || !attendance.joinedAt) {
    throw createError('You have not checked in', 400);
  }

  if (attendance.leftAt) {
    throw createError('You have already checked out', 409);
  }

  const session  = await LiveSession.findById(sessionId);
  const now      = new Date();

  attendance.leftAt   = now;
  attendance.duration = Math.round((now - attendance.joinedAt) / 60000); // minutes

  // Calculate attendance percentage
  if (session.duration > 0) {
    attendance.percentage = Math.min(
      100,
      Math.round((attendance.duration / session.duration) * 100)
    );
  }

  // Mark as completed if attended >= 80%
  attendance.isCompleted = attendance.percentage >= 80;

  await attendance.save();
  return attendance;
};

// ─── GET ATTENDANCE (for host) ────────────────────────────────────────────────
const getAttendance = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can view attendance', 403);
  }

  const attendance = await SessionAttendance.find({ sessionId })
    .populate('userId', 'fullName avatar email')
    .sort({ joinedAt: 1 });

  const summary = {
    totalAttended:   attendance.length,
    completedCount:  attendance.filter((a) => a.isCompleted).length,
    averageDuration: attendance.length
      ? Math.round(attendance.reduce((s, a) => s + a.duration, 0) / attendance.length)
      : 0,
  };

  return { summary, attendance };
};

module.exports = { checkIn, checkOut, getAttendance };
