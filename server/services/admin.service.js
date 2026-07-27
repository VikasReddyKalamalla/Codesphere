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
    admins,
    usersCurrentlyOnline,
    newUsersToday,
    avgProgressAgg,
    avgStreakAgg,
    certificatesIssued,
    totalSandboxProjects,
    totalCodexWorkspaces,
    pendingApplications,
    pendingReports,
    totalRevenue,
    recentSubmissions,
    recentAlerts,
    activeCollabs,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    User.countDocuments({ role: 'mentor' }),
    User.countDocuments({ role: 'recruiter' }),
    User.countDocuments({ role: 'organization' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isOnline: true }),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    User.aggregate([{ $group: { _id: null, avg: { $avg: '$learningProgress' } } }]),
    User.aggregate([{ $group: { _id: null, avg: { $avg: '$dayStreak' } } }]),
    Certificate.countDocuments(),
    SandboxProject.countDocuments(),
    Workspace.countDocuments(),
    require('../models/InstructorApplication').countDocuments({ status: 'Pending' }),
    require('../models/Report').countDocuments({ status: 'pending' }),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    require('../models/SandboxSubmission')
      .find()
      .sort({ submittedAt: -1 })
      .limit(4)
      .populate('projectId', 'title')
      .populate('userId', 'fullName'),
    AdminLog.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('admin', 'fullName'),
    Workspace.countDocuments(),
  ]);

  // Daily registrations for the last 7 days (User Analytics)
  const registrationStats = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    const count = await User.countDocuments({ createdAt: { $gte: dayStart, $lt: dayEnd } });
    const label = dayStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    registrationStats.push({ label, count });
  }

  // Get system health snapshot dynamically
  const healthService = require('./adminHealth.service');
  let health = null;
  try {
    health = await healthService.getSystemHealth();
  } catch (err) {
    // fallback
  }

  // Monthly growth calculation
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevUsersCount = await User.countDocuments({
    createdAt: { $gte: previousMonthStart, $lt: startOfMonth },
  });
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
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
    admins,
    usersCurrentlyOnline,
    newUsersToday,
    averageLearningProgress: Math.round(avgProgressAgg[0]?.avg || 0),
    averageStreak: Math.round(avgStreakAgg[0]?.avg || 0),
    certificatesIssued,
    totalCourses,
    totalSandboxProjects,
    totalCodexWorkspaces,
    totalRevenue: totalRevenue[0]?.total || 0,
    activeCollabs,
    registrationStats,
    health,
    pending: {
      applications: pendingApplications,
      reports: pendingReports,
      courses: await LearningPath.countDocuments({ isPublished: false }),
      events: await Event.countDocuments({ status: 'pending' }),
    },
    recentSubmissions: recentSubmissions.map(s => ({
      a: s.projectId?.title || 'React Project',
      c: s.userId?.fullName || 'John Doe',
      s: new Date(s.submittedAt).toLocaleDateString('en-US')
    })),
    recentAlerts: recentAlerts.map(a => ({
      text: a.action,
      sub: a.module,
      time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })),
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
