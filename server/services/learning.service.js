const LearningPath = require('../models/LearningPath');
const Module       = require('../models/Module');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL ──────────────────────────────────────────────────────────────────
/**
 * Fetch all learning paths with optional filtering and pagination.
 * Supports: category, difficulty, isPremium, search (text), page, limit
 */
const getAllPaths = async ({ page = 1, limit = 10, category, difficulty, isPremium, search }) => {
  const filter = {};
  if (category)   filter.category   = category;
  if (difficulty) filter.difficulty = difficulty;
  if (isPremium !== undefined) filter.isPremium = isPremium === 'true';
  if (search)     filter.$text = { $search: search };

  let total = await LearningPath.countDocuments(filter).catch(() => 0);
  if (total === 0) {
    const { autoSeedIfEmpty } = require('../utils/autoSeed');
    await autoSeedIfEmpty().catch(() => {});
    total = await LearningPath.countDocuments(filter).catch(() => 0);
  }

  const { skip, ...meta } = getPagination(page, limit, total);

  const paths = await LearningPath
    .find(filter)
    .skip(skip)
    .limit(meta.limit)
    .populate('createdBy', 'fullName avatar')
    .sort({ createdAt: -1 });

  return { ...meta, paths };
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
/**
 * Fetch a single learning path with all its modules (ordered).
 */
const getPathById = async (id) => {
  const path = await LearningPath
    .findById(id)
    .populate({
      path: 'modules',
      populate: { path: 'lessons', options: { sort: { order: 1 } } },
      options: { sort: { order: 1 } }
    })
    .populate('createdBy', 'fullName avatar');

  if (!path) throw createError('Learning path not found', 404);
  return path;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createPath = async (body, userId) => {
  const { title, category } = body;
  if (!title)    throw createError('Title is required', 400);
  if (!category) throw createError('Category is required', 400);

  return LearningPath.create({ ...body, createdBy: userId });
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updatePath = async (id, body, userId) => {
  const path = await LearningPath.findById(id);
  if (!path) throw createError('Learning path not found', 404);

  // Only creator or admin can update
  if (path.createdBy.toString() !== userId.toString()) {
    throw createError('You are not authorized to update this learning path', 403);
  }

  // Prevent changing createdBy
  delete body.createdBy;

  return LearningPath.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deletePath = async (id, userId, userRole) => {
  const path = await LearningPath.findById(id);
  if (!path) throw createError('Learning path not found', 404);

  // Admin can delete anything; creator can delete their own
  if (userRole !== 'admin' && path.createdBy.toString() !== userId.toString()) {
    throw createError('You are not authorized to delete this learning path', 403);
  }

  // Also remove all associated modules
  await Module.deleteMany({ learningPathId: id });
  await path.deleteOne();
};

module.exports = { getAllPaths, getPathById, createPath, updatePath, deletePath };
