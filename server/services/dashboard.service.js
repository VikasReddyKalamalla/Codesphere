const User             = require('../models/User');
const LearningPath     = require('../models/LearningPath');
const Progress         = require('../models/Progress');
const Bookmark         = require('../models/Bookmark');
const Community        = require('../models/Community');
const Session          = require('../models/Session');
const Event            = require('../models/Event');
const Notification     = require('../models/Notification');
const Certificate      = require('../models/Certificate');
const Subscription     = require('../models/Subscription');
const Post             = require('../models/Post');
const Task             = require('../models/Task');
const Test             = require('../models/Test');
const TestAttempt      = require('../models/TestAttempt');
const SessionReminder  = require('../models/SessionReminder');
const EventReminder    = require('../models/EventReminder');

// ─── Quick Actions config (static) ───────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Continue Learning',  route: '/learning'    },
  { label: 'Join Session',       route: '/sessions'    },
  { label: 'Register Event',     route: '/events'      },
  { label: 'Open Workspace',     route: '/workspace'   },
  { label: 'Take Assessment',    route: '/tests'       },
  { label: 'Browse Resources',   route: '/resources'   },
  { label: 'Create Community',   route: '/community'   },
];

// ─── HELPER: run queries in parallel safely ───────────────────────────────────
const safe = (promise) => promise.catch(() => null);

// ─────────────────────────────────────────────────────────────────────────────
// 1. FULL DASHBOARD  (GET /api/dashboard)
// ─────────────────────────────────────────────────────────────────────────────
const getFullDashboard = async (userId) => {
  const [
    user,
    stats,
    continueLearning,
    upcomingSessions,
    registeredEvents,
    savedResources,
    notifications,
    achievements,
    subscription,
    deadlines,
    reminders,
  ] = await Promise.all([
    safe(getUserInfo(userId)),
    safe(getStats(userId)),
    safe(getContinueLearning(userId)),
    safe(getUpcomingSessions(userId)),
    safe(getRegisteredEvents(userId)),
    safe(getSavedResources(userId)),
    safe(getNotifications(userId)),
    safe(getAchievements(userId)),
    safe(getSubscription(userId)),
    safe(getUpcomingDeadlines(userId)),
    safe(getReminders(userId)),
  ]);

  return {
    user,
    stats,
    continueLearning,
    upcomingSessions,
    registeredEvents,
    savedResources,
    notifications,
    achievements,
    subscription,
    deadlines: deadlines || [],
    reminders: reminders || [],
    bookings: [],
    jobStats: { applied: 0, inReview: 0, shortlisted: 0, rejected: 0 },
    interviews: [],
    quickActions: QUICK_ACTIONS,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. USER INFO
// ─────────────────────────────────────────────────────────────────────────────
const getUserInfo = async (userId) => {
  const user = await User.findById(userId).select(
    'fullName username avatar role plan dayStreak achievementPoints isVerified isInstructor'
  );
  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. STATISTICS  (GET /api/dashboard/stats)
// ─────────────────────────────────────────────────────────────────────────────
const getStats = async (userId) => {
  const [
    learningPathsEnrolled,
    resourcesSaved,
    communitiesJoined,
    eventsRegistered,
    sessionsJoined,
    certificatesEarned,
    attemptedTests,
    tasksCount,
    tasksDueThisWeek,
    notStartedPaths,
  ] = await Promise.all([
    Progress.countDocuments({ userId }),
    Bookmark.countDocuments({ userId }),
    Community.countDocuments({ members: userId }),
    Event.countDocuments({ attendees: userId }),
    Session.countDocuments({ participants: userId }),
    Certificate.countDocuments({ userId }),
    safe(TestAttempt.find({ userId, status: 'submitted' }).distinct('testId')),
    safe(Task.countDocuments({ assignedTo: userId, status: { $ne: 'completed' } })),
    safe(Task.countDocuments({
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    })),
    Progress.countDocuments({ userId, isCompleted: false, completionPercentage: 0 }),
  ]);

  let assignmentsDue = 0;
  let assignmentsDueThisWeek = 0;

  if (learningPathsEnrolled > 0) {
    const attemptedTestIds = attemptedTests || [];
    const publishedTestsCount = await safe(Test.countDocuments({ status: 'published', isPublished: true, _id: { $nin: attemptedTestIds } })) || 0;
    assignmentsDue = publishedTestsCount + (tasksCount || 0);
    assignmentsDueThisWeek = tasksDueThisWeek || 0;
  }

  return {
    learningPathsEnrolled,
    resourcesSaved,
    communitiesJoined,
    eventsRegistered,
    sessionsJoined,
    certificatesEarned,
    assignmentsDue,
    assignmentsDueThisWeek,
    notStartedPaths,
  };
};

const getUpcomingDeadlines = async (userId) => {
  const tasks = await Task.find({
    assignedTo: userId,
    status: { $ne: 'completed' },
    dueDate: { $ne: null },
  })
    .sort({ dueDate: 1 })
    .limit(5)
    .select('title dueDate priority');

  return tasks.map(t => {
    const diffTime = t.dueDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      title: t.title,
      desc: diffDays > 0 ? `Due in ${diffDays} days` : diffDays === 0 ? 'Due today' : `Overdue by ${Math.abs(diffDays)} days`,
      tag: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
      color: t.priority === 'high' || t.priority === 'critical' ? 'bg-red-50 text-red-600' :
             t.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
    };
  });
};

const getReminders = async (userId) => {
  const [sessionReminders, eventReminders] = await Promise.all([
    safe(SessionReminder.find({ userId, isSent: false }).populate('sessionId', 'title startTime')),
    safe(EventReminder.find({ userId, isSent: false }).populate('eventId', 'title startDate')),
  ]);

  const reminders = [];

  if (sessionReminders && Array.isArray(sessionReminders)) {
    sessionReminders.forEach(r => {
      if (r.sessionId) {
        const diffTime = r.sessionId.startTime - new Date();
        const diffHrs = Math.round(diffTime / (1000 * 60 * 60));
        reminders.push({
          title: 'Study Reminder',
          desc: r.sessionId.title,
          time: diffHrs > 0 ? `in ${diffHrs} hrs` : 'started',
          icon: 'BookOpen',
          color: 'bg-blue-50 text-blue-500 border border-blue-100',
          timestamp: r.sessionId.startTime,
        });
      }
    });
  }

  if (eventReminders && Array.isArray(eventReminders)) {
    eventReminders.forEach(r => {
      if (r.eventId) {
        const diffTime = r.eventId.startDate - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        reminders.push({
          title: 'Event Reminder',
          desc: r.eventId.title,
          time: diffDays > 0 ? `in ${diffDays} days` : 'starts today',
          icon: 'Calendar',
          color: 'bg-purple-50 text-purple-500 border border-purple-100',
          timestamp: r.eventId.startDate,
        });
      }
    });
  }

  return reminders.sort((a, b) => a.timestamp - b.timestamp).slice(0, 5);
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTINUE LEARNING  (GET /api/dashboard/continue-learning)
// ─────────────────────────────────────────────────────────────────────────────
const getContinueLearning = async (userId) => {
  // Get all in-progress learning paths for this user (not yet completed)
  const progressRecords = await Progress.find({ userId, isCompleted: false })
    .populate({
      path:    'learningPathId',
      select:  'title thumbnail category difficulty modules',
      populate: {
        path:    'modules',
        select:  'title order lessons',
        options: { sort: { order: 1 }, limit: 1 },
      },
    })
    .sort({ updatedAt: -1 })
    .limit(5);

  return progressRecords.map((p) => {
    const path    = p.learningPathId;
    const modules = path?.modules || [];
    const firstModule = modules[0] || null;

    return {
      learningPathId:       path?._id,
      title:                path?.title,
      thumbnail:            path?.thumbnail,
      category:             path?.category,
      difficulty:           path?.difficulty,
      completionPercentage: p.completionPercentage,
      completedLessons:     p.completedLessons.length,
      currentModule:        firstModule ? { _id: firstModule._id, title: firstModule.title } : null,
      continueRoute:        `/learning/${path?._id}`,
    };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. UPCOMING SESSIONS  (GET /api/dashboard/upcoming-sessions)
// ─────────────────────────────────────────────────────────────────────────────
const getUpcomingSessions = async (userId) => {
  const now = new Date();

  return Session.find({
    participants: userId,
    startTime:    { $gte: now },
    status:       { $in: ['scheduled', 'active'] },
  })
    .populate('host',      'fullName avatar')
    .populate('community', 'name image')
    .sort({ startTime: 1 })
    .limit(5)
    .select('title description startTime endTime meetingLink status host community');
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. REGISTERED EVENTS  (GET /api/dashboard/events)
// ─────────────────────────────────────────────────────────────────────────────
const getRegisteredEvents = async (userId) => {
  const now = new Date();

  const events = await Event.find({ attendees: userId })
    .sort({ startDate: 1 })
    .limit(10)
    .select('title description eventType location startDate endDate registrationLink');

  return events.map((e) => ({
    ...e.toObject(),
    status:    e.startDate > now ? 'upcoming' : e.endDate > now ? 'ongoing' : 'ended',
    countdown: e.startDate > now ? Math.ceil((e.startDate - now) / (1000 * 60 * 60 * 24)) + ' days' : null,
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. SAVED RESOURCES  (GET /api/dashboard/resources)
// ─────────────────────────────────────────────────────────────────────────────
const getSavedResources = async (userId) => {
  const bookmarks = await Bookmark.find({ userId })
    .populate({
      path:   'resourceId',
      select: 'title description category resourceType fileUrl thumbnail views rating',
    })
    .sort({ createdAt: -1 })
    .limit(10);

  return bookmarks
    .filter((b) => b.resourceId) // guard against orphan bookmarks
    .map((b) => b.resourceId);
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. NOTIFICATIONS  (GET /api/dashboard/notifications)
// ─────────────────────────────────────────────────────────────────────────────
const getNotifications = async (userId) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title message type read createdAt'),
    Notification.countDocuments({ userId, read: false }),
  ]);

  return { unreadCount, notifications };
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. ACHIEVEMENTS  (GET /api/dashboard/achievements)
// ─────────────────────────────────────────────────────────────────────────────
const getAchievements = async (userId) => {
  const [user, certificates, completedPaths] = await Promise.all([
    User.findById(userId).select('dayStreak achievementPoints'),
    Certificate.find({ userId })
      .populate('course', 'title thumbnail')
      .sort({ issuedDate: -1 })
      .limit(10),
    Progress.countDocuments({ userId, isCompleted: true }),
  ]);

  // Derive badges from achievements
  const badges = deriveBadges(user?.achievementPoints || 0, completedPaths);

  return {
    dayStreak:         user?.dayStreak         || 0,
    achievementPoints: user?.achievementPoints || 0,
    completedPaths,
    certificates,
    badges,
  };
};

/**
 * Simple badge system based on thresholds.
 */
const deriveBadges = (points, completedPaths) => {
  const badges = [];
  if (points >= 100)           badges.push({ name: 'Rising Star',    icon: '⭐' });
  if (points >= 500)           badges.push({ name: 'Dedicated',      icon: '🔥' });
  if (points >= 1000)          badges.push({ name: 'Expert',         icon: '🏆' });
  if (completedPaths >= 1)     badges.push({ name: 'First Course',   icon: '🎓' });
  if (completedPaths >= 5)     badges.push({ name: 'Path Master',    icon: '🗺️' });
  if (completedPaths >= 10)    badges.push({ name: 'Knowledge Guru', icon: '💡' });
  return badges;
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. SUBSCRIPTION  (used inside full dashboard)
// ─────────────────────────────────────────────────────────────────────────────
const getSubscription = async (userId) => {
  const sub = await Subscription.findOne({ userId, status: 'active' })
    .sort({ createdAt: -1 })
    .select('plan billingCycle amount status startDate endDate');

  if (!sub) {
    return { plan: 'free', billingCycle: null, amount: 0, status: 'none', upgradeRecommendation: 'Upgrade to Pro for full access' };
  }

  return {
    ...sub.toObject(),
    upgradeRecommendation: sub.plan === 'free' ? 'Upgrade to Standard for more features' :
                           sub.plan === 'standard' ? 'Upgrade to Premium for full access' : null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. COMMUNITY FEED PREVIEW  (used inside full dashboard)
// ─────────────────────────────────────────────────────────────────────────────
const getCommunityFeed = async (userId) => {
  const myCommunities = await Community.find({ members: userId }).select('_id');
  const communityIds  = myCommunities.map((c) => c._id);

  const [recentPosts, trendingCommunities] = await Promise.all([
    Post.find({ communityId: { $in: communityIds } })
      .populate('author',      'fullName avatar')
      .populate('communityId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('content images likes createdAt author communityId'),
    Community.find()
      .sort({ 'members.length': -1 })
      .limit(5)
      .select('name description image tags'),
  ]);

  return { recentPosts, trendingCommunities };
};

module.exports = {
  getFullDashboard,
  getUserInfo,
  getStats,
  getContinueLearning,
  getUpcomingSessions,
  getRegisteredEvents,
  getSavedResources,
  getNotifications,
  getAchievements,
  getSubscription,
  getCommunityFeed,
};
