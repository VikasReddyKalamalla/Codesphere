const LiveSession            = require('../models/LiveSession');
const SessionRegistration    = require('../models/SessionRegistration');
const { getPagination }      = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL ──────────────────────────────────────────────────────────────────
const getAllSessions = async (query) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    difficulty,
    host,
    community,
    isPremium,
    search,
    sortBy = 'startTime',
    order  = 'asc',
  } = query;

  const filter = { isPublished: true };

  if (status)     filter.status     = status;
  if (category)   filter.category   = category;
  if (difficulty) filter.difficulty = difficulty;
  if (host)       filter.host       = host;
  if (community)  filter.community  = community;
  if (isPremium !== undefined) filter.isPremium = isPremium === 'true';
  if (search)     filter.$text = { $search: search };

  const total = await LiveSession.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const sortOptions = {};
  const sortOrder   = order === 'desc' ? -1 : 1;
  sortOptions[sortBy === 'popular' ? 'registeredCount' : sortBy] = sortOrder;

  const sessions = await LiveSession.find(filter)
    .populate('host',      'fullName avatar')
    .populate('coHost',    'fullName avatar')
    .populate('community', 'name logo')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, sessions };
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
const getSessionById = async (id) => {
  const session = await LiveSession.findById(id)
    .populate('host',      'fullName avatar bio')
    .populate('coHost',    'fullName avatar')
    .populate('community', 'name logo');

  if (!session) throw createError('Session not found', 404);

  session.viewCount += 1;
  await session.save();

  return session;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createSession = async (body, userId) => {
  const { title, startTime, endTime } = body;

  if (!title)     throw createError('Title is required', 400);
  if (!startTime) throw createError('Start time is required', 400);
  if (!endTime)   throw createError('End time is required', 400);

  if (new Date(startTime) >= new Date(endTime)) {
    throw createError('End time must be after start time', 400);
  }

  if (new Date(startTime) < new Date()) {
    throw createError('Session cannot be scheduled in the past', 400);
  }

  return LiveSession.create({ ...body, host: userId });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateSession = async (id, body, userId, userRole) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  const isHost  = session.host.toString() === userId.toString();
  if (!isHost && userRole !== 'admin') {
    throw createError('Only the host or admin can update this session', 403);
  }

  if (session.status === 'completed' || session.status === 'cancelled') {
    throw createError('Cannot update a completed or cancelled session', 400);
  }

  delete body.host;
  delete body.registeredCount;

  // Recalculate duration if times changed
  const newStart = body.startTime ? new Date(body.startTime) : session.startTime;
  const newEnd   = body.endTime   ? new Date(body.endTime)   : session.endTime;
  body.duration  = Math.round((newEnd - newStart) / 60000);

  return LiveSession.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deleteSession = async (id, userId, userRole) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  const isHost = session.host.toString() === userId.toString();
  if (!isHost && userRole !== 'admin') {
    throw createError('Only the host or admin can delete this session', 403);
  }

  await SessionRegistration.deleteMany({ sessionId: id });
  await session.deleteOne();
};

// ─── PUBLISH / CANCEL / RESCHEDULE ───────────────────────────────────────────
const publishSession = async (id, userId) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can publish this session', 403);
  }

  session.status      = 'upcoming';
  session.isPublished = true;
  await session.save();

  return session;
};

const cancelSession = async (id, userId, userRole) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  const isHost = session.host.toString() === userId.toString();
  if (!isHost && userRole !== 'admin') {
    throw createError('Only the host or admin can cancel this session', 403);
  }

  if (session.status === 'completed') {
    throw createError('Cannot cancel a completed session', 400);
  }

  session.status = 'cancelled';
  await session.save();

  return { message: 'Session cancelled successfully' };
};

const goLive = async (id, userId) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can start the session', 403);
  }

  session.status = 'live';
  await session.save();

  return session;
};

const endSession = async (id, userId) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can end the session', 403);
  }

  session.status  = 'completed';
  session.endTime = new Date();
  await session.save();

  return session;
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
const getSessionAnalytics = async (id, userId) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  if (session.host.toString() !== userId.toString()) {
    throw createError('Only the host can view analytics', 403);
  }

  const [totalRegistrations, cancelledRegistrations] = await Promise.all([
    SessionRegistration.countDocuments({ sessionId: id }),
    SessionRegistration.countDocuments({ sessionId: id, status: 'cancelled' }),
  ]);

  return {
    title:                session.title,
    status:               session.status,
    totalRegistrations,
    cancelledRegistrations,
    activeRegistrations:  totalRegistrations - cancelledRegistrations,
    capacity:             session.maxCapacity,
    fillRate:             `${Math.round((totalRegistrations / session.maxCapacity) * 100)}%`,
    viewCount:            session.viewCount,
    averageRating:        session.averageRating,
    totalFeedback:        session.totalFeedback,
  };
};

const duplicateSession = async (id, userId) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  const cloneData = session.toObject();
  delete cloneData._id;
  delete cloneData.createdAt;
  delete cloneData.updatedAt;
  delete cloneData.registeredCount;
  cloneData.title = `${cloneData.title} (Copy)`;
  cloneData.status = 'draft';
  cloneData.isPublished = false;
  cloneData.host = userId;

  const durationMs = new Date(cloneData.endTime) - new Date(cloneData.startTime);
  const now = new Date();
  cloneData.startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  cloneData.endTime = new Date(cloneData.startTime.getTime() + durationMs);

  return LiveSession.create(cloneData);
};

const archiveSession = async (id, userId, userRole) => {
  const session = await LiveSession.findById(id);
  if (!session) throw createError('Session not found', 404);

  const isHost = session.host.toString() === userId.toString();
  if (!isHost && userRole !== 'admin') {
    throw createError('Only the host or admin can archive this session', 403);
  }

  session.status = 'archived';
  await session.save();

  return session;
};

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  publishSession,
  cancelSession,
  goLive,
  endSession,
  getSessionAnalytics,
  duplicateSession,
  archiveSession,
};
