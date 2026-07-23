const Module       = require('../models/Module');
const LearningPath = require('../models/LearningPath');
const Lesson       = require('../models/Lesson');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET MODULES BY LEARNING PATH ─────────────────────────────────────────────
/**
 * Return all modules for a given learning path, ordered by `order` field.
 */
const getModulesByPath = async (learningPathId) => {
  const path = await LearningPath.findById(learningPathId);
  if (!path) throw createError('Learning path not found', 404);

  return Module
    .find({ learningPathId })
    .sort({ order: 1 })
    .populate({ path: 'lessons', options: { sort: { order: 1 } } });
};

// ─── GET MODULE BY ID ─────────────────────────────────────────────────────────
const getModuleById = async (id) => {
  const mod = await Module
    .findById(id)
    .populate({ path: 'lessons', options: { sort: { order: 1 } } });

  if (!mod) throw createError('Module not found', 404);
  return mod;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createModule = async (body) => {
  const { learningPathId, title, order } = body;
  if (!learningPathId) throw createError('learningPathId is required', 400);
  if (!title)          throw createError('Title is required', 400);
  if (!order)          throw createError('Order is required', 400);

  // Verify parent learning path exists
  const path = await LearningPath.findById(learningPathId);
  if (!path) throw createError('Learning path not found', 404);

  const mod = await Module.create(body);

  // Push module reference into LearningPath
  await LearningPath.findByIdAndUpdate(learningPathId, {
    $push: { modules: mod._id },
  });

  return mod;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateModule = async (id, body) => {
  const mod = await Module.findById(id);
  if (!mod) throw createError('Module not found', 404);

  // Prevent re-assigning parent path
  delete body.learningPathId;

  return Module.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deleteModule = async (id) => {
  const mod = await Module.findById(id);
  if (!mod) throw createError('Module not found', 404);

  // Remove module reference from LearningPath
  await LearningPath.findByIdAndUpdate(mod.learningPathId, {
    $pull: { modules: mod._id },
  });

  // Remove all lessons inside this module
  await Lesson.deleteMany({ moduleId: id });

  await mod.deleteOne();
};

module.exports = { getModulesByPath, getModuleById, createModule, updateModule, deleteModule };
