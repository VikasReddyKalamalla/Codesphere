/**
 * DSA Learning Path Controller
 * Handles all DSA roadmap, problem solving, progress tracking, and search logic.
 */

const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const judge0Service = require('../services/judge0.service');
const logger = require('../utils/logger');

const DSATopic      = require('../models/DSATopic');
const DSASection    = require('../models/DSASection');
const DSAProblem    = require('../models/DSAProblem');
const DSAUserProgress = require('../models/DSAUserProgress');
const DSASubmission = require('../models/DSASubmission');
const DSAAchievement = require('../models/DSAAchievement');
const DSAUserStats  = require('../models/DSAUserStats');

// ─── Helper: compute topic lock status ────────────────────────────────────────
const computeTopicLockStatus = async (topics, userId) => {
  const result = [];
  for (const topic of topics) {
    const topicObj = topic.toObject ? topic.toObject() : { ...topic };

    if (topicObj.order === 1) {
      // First topic is always unlocked
      topicObj.isLocked = false;
      topicObj.unlockMessage = '';
    } else {
      // Find previous topic
      const prevTopic = topics.find(t => (t.order || t.toObject?.().order) === topicObj.order - 1);
      if (!prevTopic) {
        topicObj.isLocked = false;
        topicObj.unlockMessage = '';
      } else {
        const prevTopicId = prevTopic._id || prevTopic.toObject?.()._id;
        const prevTotalProblems = prevTopic.totalProblems || prevTopic.toObject?.().totalProblems || 0;

        if (prevTotalProblems === 0) {
          topicObj.isLocked = false;
          topicObj.unlockMessage = '';
        } else {
          const solvedCount = await DSAUserProgress.countDocuments({
            userId,
            topicId: prevTopicId,
            status: 'solved',
          });
          const percentComplete = Math.round((solvedCount / prevTotalProblems) * 100);
          const threshold = topicObj.unlockThreshold || 60;
          topicObj.isLocked = percentComplete < threshold;
          topicObj.unlockMessage = topicObj.isLocked
            ? `Complete ${threshold}% of "${prevTopic.title || prevTopic.toObject?.().title}" to unlock (${percentComplete}% done)`
            : '';
          topicObj.previousTopicProgress = percentComplete;
        }
      }
    }

    // Compute user progress for this topic
    const solvedInTopic = await DSAUserProgress.countDocuments({
      userId,
      topicId: topicObj._id,
      status: 'solved',
    });
    const inProgressInTopic = await DSAUserProgress.countDocuments({
      userId,
      topicId: topicObj._id,
      status: 'in_progress',
    });
    topicObj.userSolved = solvedInTopic;
    topicObj.userInProgress = inProgressInTopic;
    topicObj.completionPercent = topicObj.totalProblems > 0
      ? Math.round((solvedInTopic / topicObj.totalProblems) * 100)
      : 0;

    result.push(topicObj);
  }
  return result;
};

// ─── Helper: update user stats ────────────────────────────────────────────────
const refreshUserStats = async (userId) => {
  const allProgress = await DSAUserProgress.find({ userId, status: 'solved' }).populate('problemId', 'difficulty');
  const solvedProblems = allProgress.filter(p => p.problemId);

  const easySolved   = solvedProblems.filter(p => p.problemId.difficulty === 'easy').length;
  const mediumSolved = solvedProblems.filter(p => p.problemId.difficulty === 'medium').length;
  const hardSolved   = solvedProblems.filter(p => p.problemId.difficulty === 'hard').length;
  const totalSolved  = easySolved + mediumSolved + hardSolved;

  // Calculate streak
  const sortedDates = allProgress
    .filter(p => p.solvedAt)
    .map(p => new Date(p.solvedAt).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // unique dates
    .sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates.length > 0 && (sortedDates[0] === today || sortedDates[0] === yesterday)) {
    currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = (new Date(sortedDates[i - 1]) - new Date(sortedDates[i])) / 86400000;
      if (diff <= 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Average solve time
  const timesSpent = allProgress.filter(p => p.totalTime > 0).map(p => p.totalTime);
  const averageSolveTime = timesSpent.length > 0
    ? Math.round(timesSpent.reduce((a, b) => a + b, 0) / timesSpent.length)
    : 0;

  // Weak/strong topics
  const topics = await DSATopic.find({ isPublished: true });
  const weakTopics = [];
  const strongTopics = [];
  for (const t of topics) {
    if (t.totalProblems === 0) continue;
    const solved = await DSAUserProgress.countDocuments({ userId, topicId: t._id, status: 'solved' });
    const pct = (solved / t.totalProblems) * 100;
    if (pct < 40 && t.totalProblems > 0) weakTopics.push(t.slug);
    if (pct >= 80) strongTopics.push(t.slug);
  }

  const totalAttempts = await DSASubmission.countDocuments({ userId });
  const totalAccepted = await DSASubmission.countDocuments({ userId, status: 'accepted' });

  await DSAUserStats.findOneAndUpdate(
    { userId },
    {
      totalSolved, easySolved, mediumSolved, hardSolved,
      currentStreak,
      longestStreak: currentStreak, // simplified
      lastSolvedDate: sortedDates.length > 0 ? new Date(sortedDates[0]) : null,
      averageSolveTime,
      totalAttempts, totalAccepted,
      weakTopics, strongTopics,
    },
    { upsert: true, new: true }
  );
};

// ─── Helper: check achievements ───────────────────────────────────────────────
const checkAchievements = async (userId) => {
  const stats = await DSAUserStats.findOne({ userId });
  if (!stats) return [];

  const achievements = await DSAAchievement.find({});
  const newlyUnlocked = [];

  for (const ach of achievements) {
    // Skip if already unlocked
    if (ach.unlockedBy.some(u => u.userId.toString() === userId.toString())) continue;

    let unlocked = false;
    const cond = ach.condition;

    if (cond.type === 'total_solved' && stats.totalSolved >= cond.value) unlocked = true;
    if (cond.type === 'streak' && stats.currentStreak >= cond.value) unlocked = true;
    if (cond.type === 'difficulty_solved') {
      if (cond.difficulty === 'easy' && stats.easySolved >= cond.value) unlocked = true;
      if (cond.difficulty === 'medium' && stats.mediumSolved >= cond.value) unlocked = true;
      if (cond.difficulty === 'hard' && stats.hardSolved >= cond.value) unlocked = true;
    }
    if (cond.type === 'topic_completed') {
      const topic = await DSATopic.findOne({ slug: cond.value });
      if (topic) {
        const solved = await DSAUserProgress.countDocuments({ userId, topicId: topic._id, status: 'solved' });
        if (topic.totalProblems > 0 && solved >= topic.totalProblems) unlocked = true;
      }
    }

    if (unlocked) {
      ach.unlockedBy.push({ userId, unlockedAt: new Date() });
      await ach.save();
      newlyUnlocked.push({ key: ach.key, title: ach.title, icon: ach.icon });
    }
  }

  return newlyUnlocked;
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/dsa/topics
 * Returns all topics with user progress and lock status.
 */
const getTopics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let topics = await DSATopic.find({ isPublished: true }).sort({ order: 1 });

  // Fallback to static seed data if MongoDB is empty / offline
  if (!topics || topics.length === 0) {
    const MOCK_TOPICS = [
      { _id: '650000000000000000000101', title: 'Arrays', slug: 'arrays', order: 1, icon: '📊', color: '#6366f1', difficulty: 'beginner', estimatedHours: 15, unlockThreshold: 0, totalProblems: 5, description: 'Master array operations, two-pointers, and sliding window.' },
      { _id: '650000000000000000000102', title: 'Strings', slug: 'strings', order: 2, icon: '🔤', color: '#8b5cf6', difficulty: 'beginner', estimatedHours: 12, unlockThreshold: 60, totalProblems: 2, description: 'String manipulation, anagrams, and substring matching.' },
      { _id: '650000000000000000000103', title: 'Linked Lists', slug: 'linked-lists', order: 3, icon: '🔗', color: '#ec4899', difficulty: 'beginner', estimatedHours: 10, unlockThreshold: 60, totalProblems: 1, description: 'Pointers, reversing lists, cycle detection.' },
      { _id: '650000000000000000000104', title: 'Stacks & Queues', slug: 'stacks-queues', order: 4, icon: '📚', color: '#f59e0b', difficulty: 'intermediate', estimatedHours: 8, unlockThreshold: 60, totalProblems: 0, description: 'LIFO & FIFO data structures, monotonic stacks.' },
      { _id: '650000000000000000000105', title: 'Trees', slug: 'trees', order: 5, icon: '🌳', color: '#10b981', difficulty: 'intermediate', estimatedHours: 18, unlockThreshold: 60, totalProblems: 1, description: 'Binary trees, BST traversal, depth-first search.' },
      { _id: '650000000000000000000106', title: 'Graphs', slug: 'graphs', order: 6, icon: '🕸️', color: '#06b6d4', difficulty: 'advanced', estimatedHours: 20, unlockThreshold: 60, totalProblems: 0, description: 'BFS, DFS, shortest path algorithms.' },
      { _id: '650000000000000000000107', title: 'Dynamic Programming', slug: 'dynamic-programming', order: 7, icon: '🧩', color: '#ef4444', difficulty: 'advanced', estimatedHours: 25, unlockThreshold: 60, totalProblems: 2, description: 'Memoization, tabulation, subproblems.' },
      { _id: '650000000000000000000108', title: 'Sorting & Searching', slug: 'sorting-searching', order: 8, icon: '🔍', color: '#84cc16', difficulty: 'intermediate', estimatedHours: 10, unlockThreshold: 60, totalProblems: 1, description: 'Binary search variants, quicksort, mergesort.' },
    ];
    topics = MOCK_TOPICS;
  }

  const topicsWithStatus = await computeTopicLockStatus(topics, userId);
  return successResponse(res, 200, 'Topics retrieved', { topics: topicsWithStatus });
});

/**
 * GET /api/dsa/topics/:slug
 * Returns topic detail with sections and problems.
 */
const getTopicBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const topic = await DSATopic.findOne({ slug, isPublished: true });
  if (!topic) return errorResponse(res, 404, 'Topic not found');

  const sections = await DSASection.find({ topicId: topic._id }).sort({ order: 1 });
  const problems = await DSAProblem.find({ topicId: topic._id, isPublished: true }).sort({ order: 1 });

  // Get user progress for all problems in this topic
  const progressMap = {};
  const progressRecords = await DSAUserProgress.find({ userId, topicId: topic._id });
  progressRecords.forEach(p => { progressMap[p.problemId.toString()] = p; });

  // Attach progress to problems
  const problemsWithProgress = problems.map(p => {
    const pObj = p.toObject();
    const progress = progressMap[p._id.toString()];
    pObj.userStatus = progress?.status || 'not_started';
    pObj.bookmarkLabels = progress?.bookmarkLabels || [];
    pObj.hasNotes = !!(progress?.personalNotes);
    // Don't send test cases to client
    delete pObj.testCases;
    delete pObj.editorial;
    return pObj;
  });

  // Group problems by section
  const sectionData = sections.map(s => {
    const sObj = s.toObject();
    sObj.problems = problemsWithProgress.filter(
      p => p.sectionId && p.sectionId.toString() === s._id.toString()
    );
    return sObj;
  });

  // Problems without a section
  const unsectioned = problemsWithProgress.filter(p => !p.sectionId);

  // Compute topic lock status
  const allTopics = await DSATopic.find({ isPublished: true }).sort({ order: 1 });
  const topicsWithStatus = await computeTopicLockStatus(allTopics, userId);
  const thisTopicStatus = topicsWithStatus.find(t => t.slug === slug);

  return successResponse(res, 200, 'Topic detail retrieved', {
    topic: { ...topic.toObject(), ...thisTopicStatus },
    sections: sectionData,
    unsectionedProblems: unsectioned,
  });
});

/**
 * GET /api/dsa/problems/:slug
 * Returns full problem detail (without hidden test cases or editorial unless unlocked).
 */
const getProblemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const problem = await DSAProblem.findOne({ slug, isPublished: true }).populate('topicId', 'title slug');
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  const pObj = problem.toObject();

  // Filter test cases — only show visible ones
  pObj.visibleTestCases = pObj.testCases.filter(tc => !tc.isHidden);
  pObj.hiddenTestCount = pObj.testCases.filter(tc => tc.isHidden).length;
  delete pObj.testCases;

  // Get user progress
  const progress = await DSAUserProgress.findOne({ userId, problemId: problem._id });
  pObj.userStatus = progress?.status || 'not_started';
  pObj.bookmarkLabels = progress?.bookmarkLabels || [];
  pObj.personalNotes = progress?.personalNotes || '';
  pObj.editorialUnlocked = progress?.editorialUnlocked || false;
  pObj.attempts = progress?.attempts || 0;

  // Only show editorial if solved or manually unlocked
  if (pObj.userStatus !== 'solved' && !pObj.editorialUnlocked) {
    pObj.editorial = null;
  }

  return successResponse(res, 200, 'Problem detail retrieved', { problem: pObj });
});

/**
 * GET /api/dsa/problems/:slug/editorial
 * Returns editorial (only if problem is solved or manually unlocked).
 */
const getEditorial = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  const progress = await DSAUserProgress.findOne({ userId, problemId: problem._id });
  const isSolved = progress?.status === 'solved';
  const isUnlocked = progress?.editorialUnlocked;

  if (!isSolved && !isUnlocked) {
    return errorResponse(res, 403, 'Solve this problem first or unlock the editorial');
  }

  return successResponse(res, 200, 'Editorial retrieved', { editorial: problem.editorial });
});

/**
 * POST /api/dsa/problems/:slug/unlock-editorial
 * Manually unlock editorial without solving.
 */
const unlockEditorial = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  await DSAUserProgress.findOneAndUpdate(
    { userId, problemId: problem._id },
    { editorialUnlocked: true, topicId: problem.topicId },
    { upsert: true, new: true }
  );

  return successResponse(res, 200, 'Editorial unlocked', { editorial: problem.editorial });
});

/**
 * POST /api/dsa/problems/:slug/run
 * Run code against sample (visible) test cases via Judge0.
 */
const runCode = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { code, language } = req.body;
  const userId = req.user._id;

  if (!code || !language) return errorResponse(res, 400, 'Code and language are required');

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  const visibleTests = problem.testCases.filter(tc => !tc.isHidden);

  // Execute against each visible test case
  const results = [];
  for (const tc of visibleTests) {
    const execResult = await judge0Service.executeCode(code, language, tc.input);
    const actualOutput = (execResult.output || '').trim();
    const expectedOutput = (tc.expectedOutput || '').trim();
    results.push({
      input: tc.input,
      expected: expectedOutput,
      actual: actualOutput,
      passed: actualOutput === expectedOutput,
      executionTime: execResult.executionTime || 0,
      memoryUsed: execResult.memory || 0,
      error: execResult.error || '',
    });
  }

  const allPassed = results.every(r => r.passed);

  // Update progress to in_progress if not started
  await DSAUserProgress.findOneAndUpdate(
    { userId, problemId: problem._id },
    {
      $setOnInsert: { topicId: problem.topicId, status: 'in_progress' },
      lastAttemptAt: new Date(),
      $inc: { attempts: 1 },
    },
    { upsert: true }
  );

  return successResponse(res, 200, 'Code executed', {
    testResults: results,
    allPassed,
    totalTests: results.length,
    passedTests: results.filter(r => r.passed).length,
  });
});

/**
 * POST /api/dsa/problems/:slug/submit
 * Submit code against ALL test cases (including hidden) via Judge0.
 */
const submitCode = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { code, language } = req.body;
  const userId = req.user._id;

  if (!code || !language) return errorResponse(res, 400, 'Code and language are required');

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  // Execute against ALL test cases
  const results = [];
  let totalRuntime = 0;
  let totalMemory = 0;
  let hasError = false;
  let errorMessage = '';

  for (const tc of problem.testCases) {
    const execResult = await judge0Service.executeCode(code, language, tc.input);

    if (execResult.error && execResult.status?.id !== 3) {
      hasError = true;
      errorMessage = execResult.error;
    }

    const actualOutput = (execResult.output || '').trim();
    const expectedOutput = (tc.expectedOutput || '').trim();
    const passed = actualOutput === expectedOutput;

    totalRuntime += parseFloat(execResult.executionTime || 0);
    totalMemory = Math.max(totalMemory, parseFloat(execResult.memory || 0));

    results.push({
      input: tc.isHidden ? '[Hidden]' : tc.input,
      expected: tc.isHidden ? '[Hidden]' : expectedOutput,
      actual: tc.isHidden ? (passed ? '[Correct]' : '[Incorrect]') : actualOutput,
      passed,
      executionTime: execResult.executionTime || 0,
      memoryUsed: execResult.memory || 0,
    });
  }

  const passedTests = results.filter(r => r.passed).length;
  const allPassed = passedTests === results.length;

  // Determine submission status
  let status = 'wrong_answer';
  if (allPassed) status = 'accepted';
  else if (hasError && errorMessage.includes('compilation')) status = 'compilation_error';
  else if (hasError && errorMessage.includes('runtime')) status = 'runtime_error';
  else if (hasError && errorMessage.includes('time')) status = 'time_limit_exceeded';

  // Save submission
  const submission = await DSASubmission.create({
    userId,
    problemId: problem._id,
    language,
    code,
    status,
    runtime: Math.round(totalRuntime * 1000), // convert to ms
    memory: totalMemory,
    testResults: results,
    totalTests: results.length,
    passedTests,
    errorMessage: hasError ? errorMessage : '',
  });

  // Update progress
  if (allPassed) {
    await DSAUserProgress.findOneAndUpdate(
      { userId, problemId: problem._id },
      {
        topicId: problem.topicId,
        status: 'solved',
        solvedAt: new Date(),
        lastAttemptAt: new Date(),
        $inc: { attempts: 1 },
      },
      { upsert: true, new: true }
    );

    // Refresh stats and check achievements
    await refreshUserStats(userId);
    const newAchievements = await checkAchievements(userId);

    return successResponse(res, 200, 'Solution accepted! 🎉', {
      submission: { ...submission.toObject(), code: undefined },
      testResults: results,
      allPassed: true,
      totalTests: results.length,
      passedTests,
      status: 'accepted',
      newAchievements,
    });
  } else {
    await DSAUserProgress.findOneAndUpdate(
      { userId, problemId: problem._id },
      {
        topicId: problem.topicId,
        $setOnInsert: { status: 'in_progress' },
        lastAttemptAt: new Date(),
        $inc: { attempts: 1 },
      },
      { upsert: true }
    );

    return successResponse(res, 200, 'Submission evaluated', {
      submission: { ...submission.toObject(), code: undefined },
      testResults: results,
      allPassed: false,
      totalTests: results.length,
      passedTests,
      status,
      newAchievements: [],
    });
  }
});

/**
 * GET /api/dsa/problems/:slug/submissions
 * Returns user's submission history for a problem.
 */
const getSubmissions = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  const submissions = await DSASubmission.find({ userId, problemId: problem._id })
    .sort({ submittedAt: -1 })
    .limit(50);

  return successResponse(res, 200, 'Submissions retrieved', { submissions });
});

/**
 * PUT /api/dsa/problems/:slug/progress
 * Update problem status, bookmark labels.
 */
const updateProgress = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;
  const { status, bookmarkLabels } = req.body;

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  const update = { topicId: problem.topicId };
  if (status) update.status = status;
  if (bookmarkLabels !== undefined) update.bookmarkLabels = bookmarkLabels;

  const progress = await DSAUserProgress.findOneAndUpdate(
    { userId, problemId: problem._id },
    update,
    { upsert: true, new: true }
  );

  return successResponse(res, 200, 'Progress updated', { progress });
});

/**
 * PUT /api/dsa/problems/:slug/notes
 * Autosave personal notes.
 */
const saveNotes = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;
  const { notes } = req.body;

  const problem = await DSAProblem.findOne({ slug });
  if (!problem) return errorResponse(res, 404, 'Problem not found');

  await DSAUserProgress.findOneAndUpdate(
    { userId, problemId: problem._id },
    { personalNotes: notes || '', topicId: problem.topicId },
    { upsert: true }
  );

  return successResponse(res, 200, 'Notes saved');
});

/**
 * GET /api/dsa/dashboard
 * Global progress dashboard stats.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await refreshUserStats(userId);
  const stats = await DSAUserStats.findOne({ userId });

  // Recently solved
  const recentlySolved = await DSAUserProgress.find({ userId, status: 'solved' })
    .sort({ solvedAt: -1 })
    .limit(10)
    .populate('problemId', 'title slug difficulty');

  // Total problems
  const totalProblems = await DSAProblem.countDocuments({ isPublished: true });

  // Recommended next problem (first unsolved in the earliest unlocked topic)
  const topics = await DSATopic.find({ isPublished: true }).sort({ order: 1 });
  const topicsWithStatus = await computeTopicLockStatus(topics, userId);
  let recommendedProblem = null;

  for (const t of topicsWithStatus) {
    if (t.isLocked) continue;
    const unsolved = await DSAProblem.findOne({
      topicId: t._id,
      isPublished: true,
      _id: { $nin: await DSAUserProgress.distinct('problemId', { userId, status: 'solved' }) },
    }).sort({ order: 1 });
    if (unsolved) {
      recommendedProblem = { title: unsolved.title, slug: unsolved.slug, difficulty: unsolved.difficulty, topic: t.title };
      break;
    }
  }

  // Revision due
  const revisionDue = await DSAUserProgress.countDocuments({
    userId,
    bookmarkLabels: 'needs_revision',
  });

  return successResponse(res, 200, 'Dashboard data retrieved', {
    stats: stats || { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, currentStreak: 0 },
    totalProblems,
    recentlySolved,
    recommendedProblem,
    revisionDue,
  });
});

/**
 * GET /api/dsa/revision
 * Revision queue filtered by labels.
 */
const getRevision = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { label, difficulty, topic } = req.query;

  const filter = { userId };
  if (label) {
    filter.bookmarkLabels = label;
  } else {
    filter.bookmarkLabels = { $in: ['needs_revision', 'bookmark', 'favourite', 'important', 'interview'] };
  }

  let progressQuery = DSAUserProgress.find(filter)
    .populate({
      path: 'problemId',
      select: 'title slug difficulty tags estimatedTime topicId',
      populate: { path: 'topicId', select: 'title slug' },
    });

  const results = await progressQuery.sort({ updatedAt: -1 });

  // Apply client-side filters
  let filtered = results.filter(r => r.problemId); // ensure populated
  if (difficulty) filtered = filtered.filter(r => r.problemId.difficulty === difficulty);
  if (topic) filtered = filtered.filter(r => r.problemId.topicId?.slug === topic);

  return successResponse(res, 200, 'Revision queue retrieved', { items: filtered });
});

/**
 * GET /api/dsa/bookmarks
 * All bookmarked problems.
 */
const getBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bookmarks = await DSAUserProgress.find({
    userId,
    bookmarkLabels: { $in: ['bookmark', 'favourite', 'important', 'interview'] },
  })
    .populate({
      path: 'problemId',
      select: 'title slug difficulty tags estimatedTime topicId',
      populate: { path: 'topicId', select: 'title slug' },
    })
    .sort({ updatedAt: -1 });

  return successResponse(res, 200, 'Bookmarks retrieved', { bookmarks: bookmarks.filter(b => b.problemId) });
});

/**
 * GET /api/dsa/search
 * Global search across problems, topics, tags, companies.
 */
const searchDSA = asyncHandler(async (req, res) => {
  const { q, difficulty, company, tag, pattern } = req.query;
  const userId = req.user._id;

  if (!q && !difficulty && !company && !tag && !pattern) {
    return errorResponse(res, 400, 'Search query or filter is required');
  }

  const filter = { isPublished: true };
  if (q) filter.$text = { $search: q };
  if (difficulty) filter.difficulty = difficulty;
  if (company) filter.companies = { $regex: company, $options: 'i' };
  if (tag) filter.tags = { $regex: tag, $options: 'i' };
  if (pattern) filter.patterns = { $regex: pattern, $options: 'i' };

  const problems = await DSAProblem.find(filter)
    .select('title slug difficulty tags companies patterns estimatedTime topicId')
    .populate('topicId', 'title slug')
    .limit(50)
    .sort(q ? { score: { $meta: 'textScore' } } : { order: 1 });

  // Attach user status
  const progressMap = {};
  const progressRecords = await DSAUserProgress.find({
    userId,
    problemId: { $in: problems.map(p => p._id) },
  });
  progressRecords.forEach(p => { progressMap[p.problemId.toString()] = p.status; });

  const results = problems.map(p => ({
    ...p.toObject(),
    userStatus: progressMap[p._id.toString()] || 'not_started',
  }));

  // Also search topics if q provided
  let topicResults = [];
  if (q) {
    topicResults = await DSATopic.find({ $text: { $search: q }, isPublished: true })
      .select('title slug description icon color')
      .limit(10);
  }

  return successResponse(res, 200, 'Search results', {
    problems: results,
    topics: topicResults,
    total: results.length,
  });
});

/**
 * GET /api/dsa/patterns
 * All patterns with problem counts.
 */
const getPatterns = asyncHandler(async (req, res) => {
  const patterns = await DSAProblem.aggregate([
    { $match: { isPublished: true } },
    { $unwind: '$patterns' },
    {
      $group: {
        _id: '$patterns',
        count: { $sum: 1 },
        difficulties: { $push: '$difficulty' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const result = patterns.map(p => ({
    slug: p._id,
    name: p._id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    count: p.count,
    easy: p.difficulties.filter(d => d === 'easy').length,
    medium: p.difficulties.filter(d => d === 'medium').length,
    hard: p.difficulties.filter(d => d === 'hard').length,
  }));

  return successResponse(res, 200, 'Patterns retrieved', { patterns: result });
});

/**
 * GET /api/dsa/patterns/:slug
 * Problems by pattern.
 */
const getProblemsByPattern = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const userId = req.user._id;

  const problems = await DSAProblem.find({ patterns: slug, isPublished: true })
    .select('title slug difficulty tags estimatedTime topicId')
    .populate('topicId', 'title slug')
    .sort({ difficulty: 1, order: 1 });

  const progressMap = {};
  const progressRecords = await DSAUserProgress.find({
    userId,
    problemId: { $in: problems.map(p => p._id) },
  });
  progressRecords.forEach(p => { progressMap[p.problemId.toString()] = p.status; });

  const results = problems.map(p => ({
    ...p.toObject(),
    userStatus: progressMap[p._id.toString()] || 'not_started',
  }));

  return successResponse(res, 200, 'Pattern problems retrieved', { pattern: slug, problems: results });
});

/**
 * GET /api/dsa/achievements
 * User achievements.
 */
const getAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const achievements = await DSAAchievement.find({}).sort({ order: 1 });

  const result = achievements.map(a => ({
    key: a.key,
    title: a.title,
    description: a.description,
    icon: a.icon,
    isUnlocked: a.unlockedBy.some(u => u.userId.toString() === userId.toString()),
    unlockedAt: a.unlockedBy.find(u => u.userId.toString() === userId.toString())?.unlockedAt || null,
  }));

  return successResponse(res, 200, 'Achievements retrieved', { achievements: result });
});

module.exports = {
  getTopics,
  getTopicBySlug,
  getProblemBySlug,
  getEditorial,
  unlockEditorial,
  runCode,
  submitCode,
  getSubmissions,
  updateProgress,
  saveNotes,
  getDashboard,
  getRevision,
  getBookmarks,
  searchDSA,
  getPatterns,
  getProblemsByPattern,
  getAchievements,
};
