const User = require('../models/User');
const Instructor = require('../models/Instructor');
const AdminLog = require('../models/AdminLog');
const UserSettings = require('../models/UserSettings');
const Progress = require('../models/Progress');
const SandboxProject = require('../models/SandboxProject');
const Workspace = require('../models/Workspace');
const ActivityLog = require('../models/ActivityLog');
const TestAttempt = require('../models/TestAttempt');
const Certificate = require('../models/Certificate');
const Bookmark = require('../models/Bookmark');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Community = require('../models/Community');
const UserDevice = require('../models/UserDevice');
const Presence = require('../models/Presence');
const notificationService = require('./notification.service');
const bcrypt = require('bcryptjs');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Get all users with search, role/plan/status filtering, pagination, and dynamic aggregations.
 */
const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 20, search, role, plan, isActive, sort = 'newest' } = query;

  const filter = {};
  if (role) filter.role = role;
  if (plan) filter.plan = plan;
  if (isActive === 'true' || isActive === 'false' || typeof isActive === 'boolean') {
    filter.isActive = String(isActive) === 'true';
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOrder = { createdAt: -1 };
  if (sort === 'oldest') sortOrder = { createdAt: 1 };
  else if (sort === 'progress_desc') sortOrder = { learningProgress: -1 };
  else if (sort === 'streak_desc') sortOrder = { dayStreak: -1 };
  const skip = (Number(page) - 1) * Number(limit);

  const [usersList, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort(sortOrder)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    User.countDocuments(filter),
  ]);

  // Dynamically populate stats per user for the table
  const users = await Promise.all(
    usersList.map(async (u) => {
      const [
        progressRecords,
        projectsCount,
        certificatesCount,
        settings,
        presence,
      ] = await Promise.all([
        Progress.find({ userId: u._id }).populate('learningPathId', 'title').lean(),
        SandboxProject.countDocuments({ createdBy: u._id }),
        Certificate.countDocuments({ userId: u._id }),
        UserSettings.findOne({ userId: u._id }).select('account.phone profile.resumeUrl').lean(),
        Presence.findOne({ user: u._id }).select('isOnline lastActiveAt').lean(),
      ]);

      const completedCourses = progressRecords.filter((p) => p.isCompleted).length;
      const totalProgress = progressRecords.reduce((acc, p) => acc + p.completionPercentage, 0);
      const learningProgress = progressRecords.length > 0 ? Math.round(totalProgress / progressRecords.length) : 0;
      
      const currentPathRecord = progressRecords.find((p) => !p.isCompleted);
      const currentLearningPath = currentPathRecord?.learningPathId?.title || 'None';

      return {
        ...u,
        learningProgress,
        currentLearningPath,
        completedCourses,
        projects: projectsCount,
        certificates: certificatesCount,
        followers: u.followers?.length || 0,
        following: u.following?.length || 0,
        lastLogin: presence?.lastActiveAt || u.updatedAt,
        isOnline: presence?.isOnline || false,
        phone: settings?.account?.phone || u.phone || '',
        resume: settings?.profile?.resumeUrl || '',
      };
    })
  );

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a single user's detailed profile including all metadata tabs.
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) throw createError('User not found', 404);

  // Fetch Settings, Presence, Sandbox, Codex, Community, Assessments, Devices, and Activity Timeline
  const [
    settings,
    presence,
    progressRecords,
    sandboxProjects,
    workspaces,
    assessments,
    timeline,
    devices,
    postsCount,
    commentsCount,
    bookmarksCount,
    certificates,
  ] = await Promise.all([
    UserSettings.findOne({ userId }).lean(),
    Presence.findOne({ user: userId }).lean(),
    Progress.find({ userId }).populate('learningPathId', 'title category').lean(),
    SandboxProject.find({ createdBy: userId }).sort({ createdAt: -1 }).lean(),
    Workspace.find({ owner: userId }).sort({ createdAt: -1 }).lean(),
    TestAttempt.find({ userId }).populate('testId', 'title difficulty').sort({ createdAt: -1 }).lean(),
    ActivityLog.find({ user: userId }).sort({ createdAt: -1 }).limit(30).lean(),
    UserDevice.find({ userId }).sort({ lastActiveAt: -1 }).lean(),
    Post.countDocuments({ author: userId }),
    Comment.countDocuments({ author: userId }),
    Bookmark.countDocuments({ userId }),
    Certificate.find({ userId }).populate('course', 'title').lean(),
  ]);

  // Aggregate Learning Details
  const completedPaths = progressRecords.filter((p) => p.isCompleted).map((p) => p.learningPathId);
  const currentLearningPath = progressRecords.find((p) => !p.isCompleted)?.learningPathId?.title || 'None';
  const totalLessonsCompleted = progressRecords.reduce((acc, p) => acc + (p.completedLessons?.length || 0), 0);
  const totalLearningHours = Math.round(totalLessonsCompleted * 0.5); // Estimate 30 mins per lesson

  // Aggregate Sandbox Details
  const languagesUsedMap = {};
  sandboxProjects.forEach((p) => {
    if (p.language) languagesUsedMap[p.language] = (languagesUsedMap[p.language] || 0) + 1;
  });
  const languagesUsed = Object.keys(languagesUsedMap);
  const deployments = sandboxProjects.filter((p) => p.isDeployed).length;
  const executionCount = sandboxProjects.reduce((acc, p) => acc + (p.executionsCount || 0), 0);

  // Aggregate Codex/Workspace Details
  const tasksCompleted = workspaces.reduce((acc, w) => acc + (w.tasksCompletedCount || 0), 0);
  const gitCommits = workspaces.reduce((acc, w) => acc + (w.commitsCount || 0), 0);
  const pullRequests = workspaces.reduce((acc, w) => acc + (w.prCount || 0), 0);
  const issues = workspaces.reduce((acc, w) => acc + (w.issuesCount || 0), 0);

  // Aggregate Assessments Details
  const testScores = assessments.filter((a) => a.status === 'submitted');
  const avgScore = testScores.length > 0 ? Math.round(testScores.reduce((acc, a) => acc + a.percentage, 0) / testScores.length) : 0;
  const highestScore = testScores.length > 0 ? Math.max(...testScores.map((a) => a.percentage)) : 0;

  return {
    user,
    personal: {
      avatar: user.avatar || settings?.profile?.avatarUrl || '',
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: settings?.account?.phone || user.phone || '',
      country: settings?.account?.country || 'India',
      state: settings?.account?.location?.split(',')[1]?.trim() || '',
      city: settings?.account?.location?.split(',')[0]?.trim() || '',
      role: user.role,
      plan: user.plan,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: presence?.lastActiveAt || user.updatedAt,
      github: settings?.account?.socialLinks?.github || '',
      linkedin: settings?.account?.socialLinks?.linkedin || '',
      resume: settings?.profile?.resumeUrl || '',
      bio: settings?.account?.bio || user.bio || '',
    },
    learning: {
      currentLearningPath,
      completedLearningPaths: completedPaths,
      courseProgress: progressRecords.map((p) => ({
        pathId: p.learningPathId?._id,
        title: p.learningPathId?.title,
        progress: p.completionPercentage,
        isCompleted: p.isCompleted,
      })),
      modulesCompleted: progressRecords.length, // approximation
      lessonsCompleted: totalLessonsCompleted,
      quizScores: testScores.map((s) => ({ title: s.testId?.title, score: s.percentage, date: s.submittedAt })),
      learningStreak: user.dayStreak || 0,
      totalLearningHours,
      bookmarksCount,
      certificatesEarned: certificates,
    },
    sandbox: {
      projectsCreated: sandboxProjects.length,
      languagesUsed,
      deployments,
      executionCount,
      recentProjects: sandboxProjects.slice(0, 5),
    },
    codex: {
      workspaces: workspaces.map((w) => ({ name: w.name, id: w._id, role: 'Owner' })),
      tasksCompleted,
      gitCommits,
      pullRequests,
      issues,
    },
    community: {
      postsCount,
      commentsCount,
      likesCount: timeline.filter((t) => t.action === 'like').length, // mock/approx
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      communitiesJoinedCount: progressRecords.length, // fallback approximation
    },
    assessments: {
      testsAttempted: assessments.length,
      averageScore: avgScore,
      highestScore,
      contestRankings: user.achievementPoints || 0,
      badges: settings?.profile?.achievements || [],
    },
    timeline: timeline.map((t) => ({
      action: t.action,
      module: t.module,
      createdAt: t.createdAt,
      details: t.metadata || {},
    })),
    devices: devices.map((d) => ({
      id: d._id,
      deviceName: d.deviceName,
      os: d.os,
      browser: d.browser,
      ipAddress: d.ipAddress,
      location: d.location,
      lastActiveAt: d.lastActiveAt,
      isCurrent: d.isCurrent,
    })),
  };
};

/**
 * Update user fields (admin-safe subset: role, plan, isVerified, etc.).
 */
const updateUser = async (userId, data, adminId) => {
  const forbidden = ['password', '_id'];
  forbidden.forEach((f) => delete data[f]);

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw createError('User not found', 404);

  await AdminLog.create({
    admin: adminId,
    action: 'User Updated',
    module: 'Users',
    affectedUser: userId,
    details: data,
  });

  return user;
};

/**
 * Soft-delete a user by deactivating their account.
 */
const deleteUser = async (userId, adminId, hard = false) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);
  if (user.role === 'admin') throw createError('Admin accounts cannot be deleted this way', 403);

  if (hard) {
    await User.findByIdAndDelete(userId);
  } else {
    user.isActive = false;
    await user.save();
  }

  await AdminLog.create({
    admin: adminId,
    action: hard ? 'User Permanently Deleted' : 'User Deactivated',
    module: 'Users',
    affectedUser: userId,
  });

  return { message: hard ? 'User permanently deleted' : 'User deactivated successfully' };
};

/**
 * Suspend a user.
 */
const suspendUser = async (userId, adminId, reason) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);
  if (user.role === 'admin') throw createError('Admin accounts cannot be suspended', 403);
  if (!user.isActive) throw createError('User is already suspended', 400);

  user.isActive = false;
  await user.save();

  await notificationService.createNotification({
    recipient: userId,
    title: 'Account Suspended',
    message: reason || 'Your account has been suspended. Please contact support for more information.',
    category: 'Admin',
    type: 'Warning',
    priority: 'Critical',
    icon: 'shield-off',
  });

  await AdminLog.create({
    admin: adminId,
    action: 'User Suspended',
    module: 'Users',
    affectedUser: userId,
    details: { reason },
  });

  return { message: 'User suspended successfully' };
};

/**
 * Activate a suspended user.
 */
const activateUser = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);
  if (user.isActive) throw createError('User is already active', 400);

  user.isActive = true;
  await user.save();

  await notificationService.createNotification({
    recipient: userId,
    title: 'Account Reactivated',
    message: 'Your account has been reactivated. Welcome back!',
    category: 'Admin',
    type: 'Success',
    priority: 'High',
    icon: 'shield-check',
  });

  await AdminLog.create({
    admin: adminId,
    action: 'User Activated',
    module: 'Users',
    affectedUser: userId,
  });

  return { message: 'User activated successfully' };
};

/**
 * Update a user's role.
 */
const updateUserRole = async (userId, role, adminId) => {
  const validRoles = ['student', 'instructor', 'admin', 'mentor', 'recruiter', 'organization'];
  if (!validRoles.includes(role)) throw createError('Invalid role', 400);

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) throw createError('User not found', 404);

  await AdminLog.create({
    admin: adminId,
    action: `User Role Changed to ${role}`,
    module: 'Users',
    affectedUser: userId,
    details: { newRole: role },
  });

  return user;
};

/**
 * Reset User Password to a temporary one.
 */
const resetPassword = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);

  const tempPassword = 'tempUser123!';
  const hashedPassword = await bcrypt.hash(tempPassword, 12);
  user.password = hashedPassword;
  await user.save();

  await AdminLog.create({
    admin: adminId,
    action: 'Password Reset by Admin',
    module: 'Users',
    affectedUser: userId,
  });

  return { message: 'Password reset successfully', tempPassword };
};

/**
 * Send Notification to User.
 */
const sendNotification = async (userId, title, message, adminId) => {
  await notificationService.createNotification({
    recipient: userId,
    title,
    message,
    category: 'Admin',
    type: 'Info',
    priority: 'Normal',
    icon: 'bell',
  });

  await AdminLog.create({
    admin: adminId,
    action: 'Notification Sent by Admin',
    module: 'Users',
    affectedUser: userId,
    details: { title, message },
  });

  return { message: 'Notification sent successfully' };
};

/**
 * Send Email Simulation.
 */
const sendEmail = async (userId, subject, body, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);

  // Simulation log
  console.log(`Sending Email to ${user.email}: Subject: ${subject}, Body: ${body}`);

  await AdminLog.create({
    admin: adminId,
    action: 'Email Simulation Logged',
    module: 'Users',
    affectedUser: userId,
    details: { subject, body },
  });

  return { message: `Email simulation logged. Sent to ${user.email}.` };
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  updateUserRole,
  resetPassword,
  sendNotification,
  sendEmail,
};
