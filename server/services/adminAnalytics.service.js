const PlatformAnalytics = require('../models/PlatformAnalytics');
const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const Community = require('../models/Community');
const Event = require('../models/Event');
const SandboxProject = require('../models/SandboxProject');
const Test = require('../models/Test');
const LiveSession = require('../models/LiveSession');
const Payment = require('../models/Payment');
const Workspace = require('../models/Workspace');
const Progress = require('../models/Progress');
const TestAttempt = require('../models/TestAttempt');

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

module.exports = { getAnalytics, generateAnalytics };
