const User = require('../models/User');
const Instructor = require('../models/Instructor');
const LearningPath = require('../models/LearningPath');
const Community = require('../models/Community');
const Event = require('../models/Event');
const SandboxProject = require('../models/SandboxProject');
const Test = require('../models/Test');
const LiveSession = require('../models/LiveSession');
const Payment = require('../models/Payment');
const PlatformAnalytics = require('../models/PlatformAnalytics');
const AdminLog = require('../models/AdminLog');
const Presence = require('../models/Presence');
const Workspace = require('../models/Workspace');
const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── DASHBOARD STATISTICS ─────────────────────────────────────────────────────

/**
 * Build the admin dashboard summary using parallel aggregations.
 */
const getDashboard = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    students,
    instructors,
    mentors,
    recruiters,
    organizations,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    usersCurrentlyOnline,
    certificatesIssued,
    totalSandboxProjects,
    totalCodexWorkspaces,
    progressAgg,
    streakAgg,
    pendingApplications,
    pendingReports,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    User.countDocuments({ role: 'mentor' }),
    User.countDocuments({ role: 'recruiter' }),
    User.countDocuments({ role: 'organization' }),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    User.countDocuments({ createdAt: { $gte: startOfWeek } }),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Presence.countDocuments({ isOnline: true }),
    Certificate.countDocuments(),
    SandboxProject.countDocuments(),
    Workspace.countDocuments(),
    Progress.aggregate([
      { $group: { _id: null, avgProgress: { $avg: '$completionPercentage' } } }
    ]),
    User.aggregate([
      { $group: { _id: null, avgStreak: { $avg: '$dayStreak' } } }
    ]),
    require('../models/InstructorApplication').countDocuments({ status: 'Pending' }),
    require('../models/Report').countDocuments({ status: 'pending' }),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const averageLearningProgress = progressAgg[0]?.avgProgress || 0;
  const averageStreak = streakAgg[0]?.avgStreak || 0;

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevUsersCount = await User.countDocuments({
    createdAt: { $gte: previousMonthStart, $lt: startOfMonth },
  });

  const monthlyGrowth =
    prevUsersCount > 0
      ? Number((((newUsersThisMonth - prevUsersCount) / prevUsersCount) * 100).toFixed(1))
      : 0;

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    students,
    instructors,
    mentors,
    recruiters,
    organizations,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth,
    usersCurrentlyOnline,
    averageLearningProgress: Number(averageLearningProgress.toFixed(1)),
    averageStreak: Number(averageStreak.toFixed(1)),
    certificatesIssued,
    totalSandboxProjects,
    totalCodexWorkspaces,
    pendingApplications,
    pendingReports,
    totalRevenue: totalRevenue[0]?.total || 0,
    monthlyGrowth,
  };
};

/**
 * Generate overall platform statistics for deeper reporting.
 */
const getStatistics = async () => {
  const [usersByRole, usersByPlan, revenueByMonth] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }]),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]),
  ]);

  const formatGroup = (arr) =>
    arr.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

  return {
    usersByRole: formatGroup(usersByRole),
    usersByPlan: formatGroup(usersByPlan),
    revenueByMonth,
  };
};

module.exports = { getDashboard, getStatistics };
