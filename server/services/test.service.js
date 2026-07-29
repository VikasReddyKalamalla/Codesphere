const Test             = require('../models/Test');
const QuestionCategory = require('../models/QuestionCategory');
const { getPagination }  = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL TESTS ────────────────────────────────────────────────────────────
const getAllTests = async (query) => {
  const {
    page = 1,
    limit = 12,
    search,
    difficulty,
    category,
    technology,
    instructor,
    isPremium,
    sortBy = 'createdAt',
    order  = 'desc',
  } = query;

  const filter = {};
  if (query.all !== 'true') {
    filter.isPublished = true;
    filter.status = 'published';
  }

  if (search)     filter.$text       = { $search: search };
  if (difficulty) filter.difficulty  = difficulty;
  if (category)   filter.category    = category;
  if (technology) filter.technology  = { $regex: technology, $options: 'i' };
  if (instructor) filter.instructor  = instructor;
  if (isPremium !== undefined) filter.isPremium = isPremium === 'true';

  const total = await Test.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortOptions = {};
  if (sortBy === 'popular') sortOptions.attemptCount  = -1;
  else if (sortBy === 'newest') sortOptions.createdAt = -1;
  else sortOptions[sortBy] = sortOrder;

  const tests = await Test.find(filter)
    .populate('instructor', 'fullName avatar')
    .populate('category', 'name icon color')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, tests };
};

// ─── GET TEST BY ID ───────────────────────────────────────────────────────────
const getTestById = async (id) => {
  const test = await Test.findById(id)
    .populate('instructor', 'fullName avatar bio')
    .populate('category', 'name icon color');

  if (!test) throw createError('Test not found', 404);

  test.viewCount += 1;
  await test.save();

  return test;
};

// ─── GET TEST BY SLUG ─────────────────────────────────────────────────────────
const getTestBySlug = async (slug) => {
  const test = await Test.findOne({ slug })
    .populate('instructor', 'fullName avatar bio')
    .populate('category', 'name icon color');

  if (!test) throw createError('Test not found', 404);

  test.viewCount += 1;
  await test.save();

  return test;
};

// ─── CREATE TEST ──────────────────────────────────────────────────────────────
const createTest = async (body, userId) => {
  const { title, duration } = body;
  if (!title)    throw createError('Test title is required', 400);
  if (!duration) throw createError('Test duration is required', 400);

  if (body.category) {
    const cat = await QuestionCategory.findById(body.category);
    if (!cat) throw createError('Category not found', 404);
  }

  return Test.create({ ...body, instructor: userId });
};

// ─── UPDATE TEST ──────────────────────────────────────────────────────────────
const updateTest = async (id, body, userId, userRole) => {
  const test = await Test.findById(id);
  if (!test) throw createError('Test not found', 404);

  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to update this test', 403);
  }

  delete body.instructor;

  return Test.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate('instructor', 'fullName avatar')
    .populate('category', 'name icon color');
};

// ─── DELETE TEST ──────────────────────────────────────────────────────────────
const deleteTest = async (id, userId, userRole) => {
  const test = await Test.findById(id);
  if (!test) throw createError('Test not found', 404);

  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to delete this test', 403);
  }

  await test.deleteOne();
};

// ─── PUBLISH TEST ─────────────────────────────────────────────────────────────
const publishTest = async (id, userId, userRole) => {
  const test = await Test.findById(id);
  if (!test) throw createError('Test not found', 404);

  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to publish this test', 403);
  }

  if (test.totalQuestions === 0) {
    throw createError('Cannot publish a test with no questions', 400);
  }

  if (test.isPublished) throw createError('Test is already published', 400);

  test.isPublished = true;
  test.status = 'published';
  await test.save();

  return test;
};

// ─── ARCHIVE TEST ─────────────────────────────────────────────────────────────
const archiveTest = async (id, userId, userRole) => {
  const test = await Test.findById(id);
  if (!test) throw createError('Test not found', 404);

  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to archive this test', 403);
  }

  test.status = 'archived';
  test.isPublished = false;
  await test.save();

  return test;
};

// ─── GET MY TESTS (instructor) ────────────────────────────────────────────────
const getMyTests = async (userId, query) => {
  const { page = 1, limit = 12, status } = query;

  const filter = { instructor: userId };
  if (status) filter.status = status;

  const total = await Test.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const tests = await Test.find(filter)
    .populate('category', 'name icon color')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, tests };
};

// ─── GET TEST ANALYTICS ───────────────────────────────────────────────────────
const getTestAnalytics = async (id, userId, userRole) => {
  const test = await Test.findById(id);
  if (!test) throw createError('Test not found', 404);

  if (test.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view analytics for this test', 403);
  }

  return {
    testId:        test._id,
    title:         test.title,
    status:        test.status,
    totalQuestions:test.totalQuestions,
    totalMarks:    test.totalMarks,
    passingMarks:  test.passingMarks,
    attemptCount:  test.attemptCount,
    averageScore:  test.averageScore,
    bookmarkCount: test.bookmarkCount,
    viewCount:     test.viewCount,
  };
};

// ─── GET LEADERBOARD ─────────────────────────────────────────────────────────
const getLeaderboard = async () => {
  return [
    { rank: 1, name: 'Siddharth V.', xp: 4850, country: 'IN', score: 98, time: '14m 20s', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
    { rank: 2, name: 'Aarav Patel', xp: 4620, country: 'US', score: 95, time: '16m 05s', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { rank: 3, name: 'Maya Lin', xp: 4410, country: 'SG', score: 92, time: '17m 40s', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' },
    { rank: 4, name: 'Kavya Sharma', xp: 4190, country: 'IN', score: 90, time: '19m 12s', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { rank: 5, name: 'David Kim', xp: 3950, country: 'KR', score: 88, time: '21m 00s', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' }
  ];
};

// ─── GET CONTESTS ─────────────────────────────────────────────────────────────
const getContests = async () => {
  return [
    { id: 'c1', title: 'CodeSphere Weekly Grand Contest 42', status: 'live', participants: 1420, prize: '$1,500 AWS Credits', startTime: 'Live Now', duration: '90 Mins' },
    { id: 'c2', title: 'National System Design & Algo Cup 2026', status: 'upcoming', participants: 850, prize: 'Direct Interview Slot', startTime: 'Starts Tomorrow at 6:00 PM', duration: '120 Mins' }
  ];
};

// ─── SUBMIT TEST ATTEMPT ──────────────────────────────────────────────────────
const submitTestAttempt = async (testId, userId, payload) => {
  const test = await Test.findById(testId);
  const totalQuestions = payload?.answers ? Object.keys(payload.answers).length : 5;
  const score = Math.floor(Math.random() * 20) + 80;

  if (test) {
    test.attemptCount += 1;
    await test.save();
  }

  return {
    attemptId: 'att_' + Date.now(),
    score,
    totalMarks: test?.totalMarks || 100,
    passingMarks: test?.passingMarks || 60,
    passed: score >= (test?.passingMarks || 60),
    accuracy: Math.round((score / 100) * 100),
    percentile: 94.5,
    rank: 12,
    completionTime: payload?.completionTime || '18 Mins 42 Secs',
    evaluatedAt: new Date(),
  };
};

module.exports = {
  getAllTests,
  getTestById,
  getTestBySlug,
  createTest,
  updateTest,
  deleteTest,
  publishTest,
  archiveTest,
  getMyTests,
  getTestAnalytics,
  getLeaderboard,
  getContests,
  submitTestAttempt,
};
