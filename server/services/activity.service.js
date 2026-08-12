const ActivityLog = require('../models/ActivityLog');
const DailyContribution = require('../models/DailyContribution');
const User = require('../models/User');

const getTodayDateStr = (d = new Date()) => {
  return new Date(d).toISOString().split('T')[0];
};

const getYesterdayDateStr = (d = new Date()) => {
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Record a user activity event, update daily streak, and track contributions.
 */
const recordUserActivity = async (userId, { module = 'General', action = 'user_action', referenceId, referenceType, metadata, socketId } = {}) => {
  if (!userId) return null;

  try {
    const todayStr = getTodayDateStr();
    const yesterdayStr = getYesterdayDateStr();

    // 1. Fetch user to update streak & total contributions
    const user = await User.findById(userId);
    let updatedStreak = 0;
    let totalContribs = 0;

    if (user) {
      const lastActiveStr = user.lastActiveDate ? getTodayDateStr(user.lastActiveDate) : null;

      if (!lastActiveStr) {
        user.dayStreak = 1;
      } else if (lastActiveStr === todayStr) {
        // Already active today — maintain current streak
        if (user.dayStreak === 0) user.dayStreak = 1;
      } else if (lastActiveStr === yesterdayStr) {
        // Active yesterday — increment streak
        user.dayStreak = (user.dayStreak || 0) + 1;
      } else {
        // Missed at least one day — reset streak to 1
        user.dayStreak = 1;
      }

      user.lastActiveDate = new Date();
      user.totalContributions = (user.totalContributions || 0) + 1;
      await user.save();

      updatedStreak = user.dayStreak;
      totalContribs = user.totalContributions;
    }

    // 2. Increment DailyContribution record
    await DailyContribution.findOneAndUpdate(
      { user: userId, date: todayStr },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    // 3. Log ActivityLog entry
    await ActivityLog.create({
      user: userId,
      module: module || 'General',
      action,
      referenceId,
      referenceType,
      metadata,
      socketId,
    });

    // 4. Emit socket event if available
    try {
      const { getIO } = require('../socket/socket');
      const io = getIO();
      if (io) {
        io.to(`user:${userId}`).emit('user:streak_updated', {
          dayStreak: updatedStreak,
          totalContributions: totalContribs,
          date: todayStr,
        });
      }
    } catch {
      // Non-critical socket notification
    }

    return { dayStreak: updatedStreak, totalContributions: totalContribs, date: todayStr };
  } catch (err) {
    console.error('Failed to record user activity:', err.message);
    return null;
  }
};

/**
 * Legacy log function wrapper
 */
const log = async (params) => {
  const { userId, ...rest } = params || {};
  if (userId) {
    return recordUserActivity(userId, rest);
  }
};

/**
 * Get recent activity feed for a user.
 */
const getUserActivity = async (userId, { limit = 20 } = {}) => {
  return ActivityLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();
};

/**
 * Get full 52-week contribution heatmap for a user.
 */
const getUserContributions = async (userId, numWeeks = 52) => {
  const user = await User.findById(userId).select('dayStreak totalContributions createdAt').lean();
  const dayStreak = user?.dayStreak || 0;
  const totalContribs = user?.totalContributions || 0;

  // Calculate 364-day range ending today
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (numWeeks * 7 - 1));

  const startStr = getTodayDateStr(startDate);

  // Fetch daily contribution records within range
  const dailyRecords = await DailyContribution.find({
    user: userId,
    date: { $gte: startStr },
  }).lean();

  const countMap = {};
  dailyRecords.forEach((rec) => {
    countMap[rec.date] = rec.count;
  });

  // Generate 52 weeks (364 days) list
  const weeks = [];
  const curr = new Date(startDate);

  for (let w = 0; w < numWeeks; w++) {
    const daysInWeek = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = getTodayDateStr(curr);
      const count = countMap[dateStr] || 0;
      daysInWeek.push({
        date: dateStr,
        count,
      });
      curr.setDate(curr.getDate() + 1);
    }
    weeks.push(daysInWeek);
  }

  return {
    dayStreak,
    totalContributions: totalContribs,
    weeks,
    rawCountMap: countMap,
  };
};

/**
 * Get the platform-wide recent activity feed (admin use).
 */
const getRecentActivity = async ({ limit = 50, module: mod } = {}) => {
  const filter = {};
  if (mod) filter.module = mod;

  return ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('user', 'fullName username avatar')
    .lean();
};

module.exports = {
  recordUserActivity,
  log,
  getUserActivity,
  getUserContributions,
  getRecentActivity,
};
