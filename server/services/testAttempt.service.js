const TestAttempt  = require('../models/TestAttempt');
const Test         = require('../models/Test');
const Question     = require('../models/Question');
const Leaderboard  = require('../models/Leaderboard');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── START TEST ───────────────────────────────────────────────────────────────
const startTest = async (testId, userId) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);
  if (!test.isPublished) throw createError('This test is not available', 400);

  // Check existing in-progress attempt
  const inProgress = await TestAttempt.findOne({ testId, userId, status: 'in_progress' });
  if (inProgress) return inProgress; // resume existing

  // Count previous attempts
  const prevAttempts = await TestAttempt.countDocuments({ testId, userId, status: { $in: ['submitted', 'expired'] } });

  if (test.maxAttempts > 0 && prevAttempts >= test.maxAttempts) {
    throw createError(`You have reached the maximum number of attempts (${test.maxAttempts})`, 400);
  }

  // Fetch questions for this test to generate randomized candidate question order
  const testQuestions = await Question.find({ testId }).select('_id').lean();
  
  // Fisher-Yates shuffle for randomized question order per candidate attempt
  const shuffledOrder = testQuestions.map(q => q._id);
  for (let i = shuffledOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOrder[i], shuffledOrder[j]] = [shuffledOrder[j], shuffledOrder[i]];
  }

  const attempt = await TestAttempt.create({
    testId,
    userId,
    attemptNumber: prevAttempts + 1,
    timeLimit:     test.duration * 60,
    status:        'in_progress',
    startTime:     new Date(),
    questionOrder: shuffledOrder,
  });

  await Test.findByIdAndUpdate(testId, { $inc: { attemptCount: 1 } });

  return attempt;
};

// ─── RECORD PROCTORING WARNING ────────────────────────────────────────────────
const recordProctoringWarning = async (testId, userId) => {
  const attempt = await TestAttempt.findOne({ testId, userId, status: 'in_progress' });
  if (!attempt) return null;

  attempt.proctoringWarnings += 1;
  attempt.tabSwitchCount += 1;
  
  // Auto-terminate if tab switching warnings exceed 3
  if (attempt.proctoringWarnings >= 3) {
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
  }

  await attempt.save();
  return { warnings: attempt.proctoringWarnings, isTerminated: attempt.proctoringWarnings >= 3 };
};

// ─── PAUSE TEST ───────────────────────────────────────────────────────────────
const pauseTest = async (testId, userId) => {
  const attempt = await TestAttempt.findOne({ testId, userId, status: 'in_progress' });
  if (!attempt) throw createError('No active attempt found for this test', 404);

  attempt.status   = 'paused';
  attempt.pausedAt = new Date();
  await attempt.save();

  return attempt;
};

// ─── RESUME TEST ──────────────────────────────────────────────────────────────
const resumeTest = async (testId, userId) => {
  const attempt = await TestAttempt.findOne({ testId, userId, status: 'paused' });
  if (!attempt) throw createError('No paused attempt found for this test', 404);

  attempt.status   = 'in_progress';
  attempt.pausedAt = null;
  await attempt.save();

  return attempt;
};

// ─── SAVE ANSWER ──────────────────────────────────────────────────────────────
const saveAnswer = async (testId, userId, body) => {
  const { questionId, selectedAnswer, timeTaken = 0 } = body;

  if (!questionId) throw createError('Question ID is required', 400);

  const attempt = await TestAttempt.findOne({ testId, userId, status: 'in_progress' });
  if (!attempt) throw createError('No active attempt found. Start the test first.', 404);

  // Upsert answer
  const existingIdx = attempt.answers.findIndex(
    (a) => a.questionId.toString() === questionId
  );

  if (existingIdx >= 0) {
    attempt.answers[existingIdx].selectedAnswer = selectedAnswer;
    attempt.answers[existingIdx].timeTaken      = timeTaken;
  } else {
    attempt.answers.push({ questionId, selectedAnswer, timeTaken });
  }

  await attempt.save();

  return { message: 'Answer saved', answeredCount: attempt.answers.length };
};

// ─── SUBMIT TEST ──────────────────────────────────────────────────────────────
const submitTest = async (testId, userId) => {
  const test    = await Test.findById(testId);
  const attempt = await TestAttempt.findOne({ testId, userId, status: { $in: ['in_progress', 'paused'] } });

  if (!attempt) throw createError('No active attempt found for this test', 404);

  const questions = await Question.find({ testId }).lean();
  const questionMap = Object.fromEntries(questions.map((q) => [q._id.toString(), q]));

  let totalScore = 0, correct = 0, wrong = 0;

  // Grade every answer
  for (const ans of attempt.answers) {
    const q = questionMap[ans.questionId.toString()];
    if (!q) continue;

    const isCorrect = q.correctAnswer && ans.selectedAnswer &&
                      q.correctAnswer.trim().toLowerCase() === ans.selectedAnswer.trim().toLowerCase();

    ans.isCorrect    = isCorrect;
    ans.marksAwarded = isCorrect ? q.marks : (test.negativeMarking ? -(q.negativeMarks || test.negativeMarkValue) : 0);

    totalScore += ans.marksAwarded;
    if (isCorrect) correct++;
    else if (ans.selectedAnswer) wrong++;
  }

  const skipped    = questions.length - attempt.answers.length;
  const percentage = test.totalMarks > 0 ? ((totalScore / test.totalMarks) * 100).toFixed(2) : 0;
  const passed     = totalScore >= test.passingMarks;
  const timeTaken  = Math.round((Date.now() - attempt.startTime.getTime()) / 1000);

  attempt.status           = 'submitted';
  attempt.submittedAt      = new Date();
  attempt.endTime          = new Date();
  attempt.timeTaken        = timeTaken;
  attempt.totalScore       = Math.max(0, totalScore);
  attempt.percentage       = parseFloat(percentage);
  attempt.correctAnswers   = correct;
  attempt.wrongAnswers     = wrong;
  attempt.skippedQuestions = skipped;
  attempt.passed           = passed;

  await attempt.save();

  // Update or create leaderboard entry (keep only best score)
  const existing = await Leaderboard.findOne({ testId, userId });
  if (!existing || attempt.totalScore > existing.score) {
    await Leaderboard.findOneAndUpdate(
      { testId, userId },
      { testId, userId, attemptId: attempt._id, score: attempt.totalScore, percentage: attempt.percentage, timeTaken, submittedAt: new Date() },
      { upsert: true, new: true }
    );
    await _recalculateRanks(testId);
  }

  // Update test average score
  await _updateTestAverageScore(testId);

  return attempt;
};

// ─── GET MY ATTEMPTS ──────────────────────────────────────────────────────────
const getMyAttempts = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const total = await TestAttempt.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const attempts = await TestAttempt.find({ userId })
    .populate('testId', 'title thumbnail difficulty technology duration')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, attempts };
};

// ─── GET ATTEMPT RESULT ───────────────────────────────────────────────────────
const getAttemptResult = async (attemptId, userId, userRole) => {
  const attempt = await TestAttempt.findById(attemptId)
    .populate('testId', 'title totalMarks passingMarks duration instructor')
    .populate('answers.questionId', 'questionTitle options correctAnswer explanation');

  if (!attempt) throw createError('Attempt not found', 404);

  const isOwner = attempt.userId.toString() === userId.toString();
  const isInstructor = attempt.testId && attempt.testId.instructor &&
                       attempt.testId.instructor.toString() === userId.toString();

  if (!isOwner && !isInstructor && userRole !== 'admin') {
    throw createError('You are not authorized to view this result', 403);
  }

  return attempt;
};

// ─── GET RESULTS FOR A TEST (instructor view) ─────────────────────────────────
const getTestResults = async (testId, userId, userRole, query) => {
  const test = await Test.findById(testId);
  if (!test) throw createError('Test not found', 404);

  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view results for this test', 403);
  }

  const { page = 1, limit = 20 } = query;
  const total = await TestAttempt.countDocuments({ testId, status: 'submitted' });
  const { skip, ...meta } = getPagination(page, limit, total);

  const results = await TestAttempt.find({ testId, status: 'submitted' })
    .populate('userId', 'fullName avatar email')
    .sort({ totalScore: -1, timeTaken: 1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, results };
};

// ─── INTERNAL: recalculate leaderboard ranks ──────────────────────────────────
const _recalculateRanks = async (testId) => {
  const entries = await Leaderboard.find({ testId })
    .sort({ score: -1, timeTaken: 1 })
    .lean();

  const updates = entries.map((e, i) =>
    Leaderboard.findByIdAndUpdate(e._id, { rank: i + 1 })
  );
  await Promise.all(updates);
};

// ─── INTERNAL: update test average score ─────────────────────────────────────
const _updateTestAverageScore = async (testId) => {
  const attempts = await TestAttempt.find({ testId, status: 'submitted' }).select('totalScore').lean();
  if (!attempts.length) return;
  const avg = attempts.reduce((sum, a) => sum + a.totalScore, 0) / attempts.length;
  await Test.findByIdAndUpdate(testId, { averageScore: parseFloat(avg.toFixed(2)) });
};

module.exports = { startTest, pauseTest, resumeTest, saveAnswer, submitTest, getMyAttempts, getAttemptResult, getTestResults };
