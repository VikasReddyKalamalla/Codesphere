const PlatformAnalytics = require('../models/PlatformAnalytics');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const Community = require('../models/Community');
const Event = require('../models/Event');
const SandboxProject = require('../models/SandboxProject');
const Test = require('../models/Test');
const LiveSession = require('../models/LiveSession');
const Payment = require('../models/Payment');
const Workspace = require('../models/Workspace');
const analyticsRealtimeService = require('./analyticsRealtime.service');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get stored monthly analytics records (up to 24 months).
 */
const getAnalytics = async (query = {}) => {
  const { months = 12 } = query;
  const records = await PlatformAnalytics.find()
    .sort({ period: -1 })
    .limit(Number(months));

  return { analytics: records };
};

/**
 * Generate (or refresh) the current-month platform analytics snapshot.
 */
const generateAnalytics = async (adminId) => {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    activeUsers,
    newUsers,
    premiumUsers,
    instructors,
    learningPaths,
    communities,
    events,
    sandboxProjects,
    liveSessions,
    tests,
    workspaces,
    revenue,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ plan: { $in: ['standard', 'premium'] } }),
    User.countDocuments({ role: 'instructor' }),
    LearningPath.countDocuments({ isPublished: true }),
    Community.countDocuments({ status: 'active' }),
    Event.countDocuments(),
    SandboxProject.countDocuments(),
    LiveSession.countDocuments(),
    Test.countDocuments(),
    Workspace.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'completed', paidAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const snapshot = {
    period,
    users: {
      total: totalUsers,
      active: activeUsers,
      newThisMonth: newUsers,
      premium: premiumUsers,
      instructors,
    },
    content: {
      learningPaths,
      communities,
      events,
      sandboxProjects,
      liveSessions,
      tests,
      workspaces,
    },
    revenue: {
      total: revenue[0]?.total || 0,
    },
  };

  const record = await PlatformAnalytics.findOneAndUpdate(
    { period },
    snapshot,
    { upsert: true, new: true }
  );

  return record;
};

/**
 * Fetch real-time snapshot payload
 */
const getRealtimeAnalytics = async (query = {}) => {
  return await analyticsRealtimeService.getRealtimeAnalyticsSnapshot(query);
};

/**
 * Fetch historical/paginated analytics events with category & search filters
 */
const getAnalyticsEvents = async (query = {}) => {
  const { category, search, page = 1, limit = 30 } = query;
  const filter = {};

  if (category && category !== 'all') {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { userName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [events, total] = await Promise.all([
    AnalyticsEvent.find(filter).sort({ timestamp: -1 }).skip(skip).limit(Number(limit)).lean(),
    AnalyticsEvent.countDocuments(filter),
  ]);

  return {
    events,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Trigger simulated traffic event
 */
const simulateTrafficEvent = async (category) => {
  return await analyticsRealtimeService.simulateTrafficEvent(category);
};

/**
 * Seed initial analytics data
 */
const seedAnalyticsData = async () => {
  const events = await analyticsRealtimeService.seedInitialAnalyticsEvents();
  return { seededEventsCount: events.length };
};

module.exports = {
  getAnalytics,
  generateAnalytics,
  getRealtimeAnalytics,
  getAnalyticsEvents,
  simulateTrafficEvent,
  seedAnalyticsData,
};
