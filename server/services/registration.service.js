const SessionRegistration = require('../models/SessionRegistration');
const LiveSession         = require('../models/LiveSession');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
const registerForSession = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.status !== 'upcoming' && session.status !== 'draft') {
    throw createError('Cannot register for this session at this time', 400);
  }

  // Check if already registered
  const existing = await SessionRegistration.findOne({ sessionId, userId });
  if (existing && existing.status === 'registered') {
    throw createError('You are already registered', 409);
  }

  // Check capacity
  let status = 'registered';
  if (session.registeredCount >= session.maxCapacity) {
    if (!session.isWaitlistEnabled) {
      throw createError('Session is full', 400);
    }
    status = 'waitlisted';
  }

  const registration = await SessionRegistration.create({ sessionId, userId, status });

  // Increment registered count (even if waitlisted)
  await LiveSession.findByIdAndUpdate(sessionId, { $inc: { registeredCount: 1 } });

  return registration;
};

// ─── CANCEL REGISTRATION ──────────────────────────────────────────────────────
const cancelRegistration = async (sessionId, userId) => {
  const registration = await SessionRegistration.findOne({ sessionId, userId, status: 'registered' });
  if (!registration) throw createError('Registration not found', 404);

  registration.status       = 'cancelled';
  registration.cancelledAt  = new Date();
  await registration.save();

  // Decrement registered count
  await LiveSession.findByIdAndUpdate(sessionId, { $inc: { registeredCount: -1 } });

  return { message: 'Registration cancelled successfully' };
};

// ─── GET REGISTRATIONS (for host) ─────────────────────────────────────────────
const getRegistrations = async (sessionId, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can view registrations', 403);
  }

  return SessionRegistration.find({ sessionId, status: 'registered' })
    .populate('userId', 'fullName avatar email')
    .sort({ createdAt: 1 });
};

// ─── GET USER'S REGISTERED SESSIONS ───────────────────────────────────────────
const getUserRegistrations = async (userId) => {
  const registrations = await SessionRegistration.find({ userId, status: 'registered' })
    .populate({
      path:   'sessionId',
      select: 'title description startTime endTime status host community',
      populate: [
        { path: 'host', select: 'fullName avatar' },
        { path: 'community', select: 'name logo' },
      ],
    })
    .sort({ createdAt: -1 });

  return registrations.filter((r) => r.sessionId).map((r) => r.sessionId);
};

module.exports = { registerForSession, cancelRegistration, getRegistrations, getUserRegistrations };
