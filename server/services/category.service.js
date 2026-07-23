const ResourceCategory = require('../models/ResourceCategory');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL ──────────────────────────────────────────────────────────────────
const getAllCategories = async () => {
  return ResourceCategory.find({ isActive: true }).sort({ name: 1 });
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
const getCategoryById = async (id) => {
  const cat = await ResourceCategory.findById(id);
  if (!cat) throw createError('Category not found', 404);
  return cat;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
const createCategory = async (body) => {
  const { name } = body;
  if (!name) throw createError('Category name is required', 400);

  const existing = await ResourceCategory.findOne({ name: name.trim() });
  if (existing) throw createError('Category already exists', 409);

  return ResourceCategory.create(body);
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
const updateCategory = async (id, body) => {
  const cat = await ResourceCategory.findById(id);
  if (!cat) throw createError('Category not found', 404);
  return ResourceCategory.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
const deleteCategory = async (id) => {
  const cat = await ResourceCategory.findById(id);
  if (!cat) throw createError('Category not found', 404);
  await cat.deleteOne();
};

// ─── SEED DEFAULT CATEGORIES ──────────────────────────────────────────────────
const seedCategories = async () => {
  const defaults = [
    { name: 'Frontend',             icon: '🖥️',  color: '#3b82f6' },
    { name: 'Backend',              icon: '⚙️',  color: '#10b981' },
    { name: 'Full Stack',           icon: '🔗',  color: '#8b5cf6' },
    { name: 'AI & Machine Learning',icon: '🤖',  color: '#f59e0b' },
    { name: 'DevOps',               icon: '🚀',  color: '#ef4444' },
    { name: 'Cyber Security',       icon: '🔒',  color: '#6366f1' },
    { name: 'Data Science',         icon: '📊',  color: '#14b8a6' },
    { name: 'Mobile Development',   icon: '📱',  color: '#f97316' },
    { name: 'Programming Languages',icon: '💻',  color: '#a855f7' },
    { name: 'System Design',        icon: '🏗️',  color: '#0ea5e9' },
  ];

  for (const cat of defaults) {
    await ResourceCategory.findOneAndUpdate(
      { name: cat.name },
      cat,
      { upsert: true, new: true }
    );
  }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, seedCategories };
