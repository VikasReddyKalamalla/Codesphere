/**
 * Advanced Analytics Service
 * Comprehensive platform analytics and reporting
 */

const User = require('../models/User');
const SandboxProject = require('../models/SandboxProject');
const SandboxProgress = require('../models/SandboxProgress');
const Payment = require('../models/Payment');
const Session = require('../models/Session');
const logger = require('../utils/logger');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get comprehensive dashboard metrics
 */
const getDashboardMetrics = async (dateRange = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - dateRange);

  try {
    // User metrics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: startDate },
    });
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Revenue metrics
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: startDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Course metrics
    const totalProjects = await SandboxProject.countDocuments();
    const publishedProjects = await SandboxProject.countDocuments({ isPublished: true });

    // Engagement metrics
    const totalEnrollments = await SandboxProgress.countDocuments({
      createdAt: { $gte: startDate },
    });

    const completedProjects = await SandboxProgress.countDocuments({
      status: 'completed',
      completedAt: { $gte: startDate },
    });

    // Session metrics
    const activeSessions = await Session.countDocuments({
      status: 'active',
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        avgPerUser: totalRevenue[0]?.total / activeUsers || 0,
      },
      courses: {
        total: totalProjects,
        published: publishedProjects,
      },
      engagement: {
        enrollments: totalEnrollments,
        completionRate: (completedProjects / totalEnrollments) * 100 || 0,
      },
      sessions: {
        active: activeSessions,
      },
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`Dashboard metrics error: ${error.message}`);
    throw createError('Failed to fetch dashboard metrics', 500);
  }
};

/**
 * Get user cohort analysis
 */
const getCohortAnalysis = async () => {
  try {
    const cohorts = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }, // Last 12 months
    ]);

    return {
      cohorts: cohorts.map((c) => ({
        month: c._id,
        users: c.count,
      })),
      total: cohorts.reduce((sum, c) => sum + c.count, 0),
    };
  } catch (error) {
    logger.error(`Cohort analysis error: ${error.message}`);
    throw createError('Failed to fetch cohort analysis', 500);
  }
};

/**
 * Get revenue trends
 */
const getRevenueTrends = async (months = 12) => {
  try {
    const trends = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
            },
          },
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      trends: trends.map((t) => ({
        month: t._id,
        revenue: t.revenue,
        transactions: t.transactions,
      })),
      totalRevenue: trends.reduce((sum, t) => sum + t.revenue, 0),
      avgTransactionValue: trends.reduce((sum, t) => sum + t.revenue, 0) /
        trends.reduce((sum, t) => sum + t.transactions, 0) || 0,
    };
  } catch (error) {
    logger.error(`Revenue trends error: ${error.message}`);
    throw createError('Failed to fetch revenue trends', 500);
  }
};

/**
 * Get top performing courses
 */
const getTopCourses = async (limit = 10) => {
  try {
    const topCourses = await SandboxProject.find({ isPublished: true })
      .select('title enrolledCount completedCount averageRating')
      .sort({ enrolledCount: -1 })
      .limit(limit);

    return {
      courses: topCourses.map((c) => ({
        id: c._id,
        title: c.title,
        enrollments: c.enrolledCount,
        completions: c.completedCount,
        completionRate: (c.completedCount / c.enrolledCount) * 100 || 0,
        rating: c.averageRating,
      })),
    };
  } catch (error) {
    logger.error(`Top courses error: ${error.message}`);
    throw createError('Failed to fetch top courses', 500);
  }
};

/**
 * Get user engagement metrics
 */
const getUserEngagement = async () => {
  try {
    const engagement = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeLastWeek: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$lastLogin',
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
          activeLastMonth: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$lastLogin',
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const data = engagement[0] || { totalUsers: 0, activeLastWeek: 0, activeLastMonth: 0 };

    return {
      total: data.totalUsers,
      activeLastWeek: data.activeLastWeek,
      activeLastMonth: data.activeLastMonth,
      retentionWeekly: (data.activeLastWeek / data.totalUsers) * 100 || 0,
      retentionMonthly: (data.activeLastMonth / data.totalUsers) * 100 || 0,
    };
  } catch (error) {
    logger.error(`User engagement error: ${error.message}`);
    throw createError('Failed to fetch user engagement', 500);
  }
};

/**
 * Generate comprehensive report
 */
const generateReport = async (reportType = 'full') => {
  try {
    const report = {
      generatedAt: new Date(),
      type: reportType,
      data: {},
    };

    if (reportType === 'full' || reportType === 'dashboard') {
      report.data.dashboard = await getDashboardMetrics();
    }

    if (reportType === 'full' || reportType === 'cohort') {
      report.data.cohort = await getCohortAnalysis();
    }

    if (reportType === 'full' || reportType === 'revenue') {
      report.data.revenue = await getRevenueTrends();
    }

    if (reportType === 'full' || reportType === 'courses') {
      report.data.topCourses = await getTopCourses();
    }

    if (reportType === 'full' || reportType === 'engagement') {
      report.data.engagement = await getUserEngagement();
    }

    return report;
  } catch (error) {
    logger.error(`Report generation error: ${error.message}`);
    throw createError('Failed to generate report', 500);
  }
};

module.exports = {
  getDashboardMetrics,
  getCohortAnalysis,
  getRevenueTrends,
  getTopCourses,
  getUserEngagement,
  generateReport,
};
