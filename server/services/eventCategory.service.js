const EventCategory = require('../models/EventCategory');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL CATEGORIES ───────────────────────────────────────────────────────
const getAllCategories = async () => {
  return EventCategory.find({ isActive: true }).sort({ name: 1 });
};

// ─── GET CATEGORY BY ID ───────────────────────────────────────────────────────
const getCategoryById = async (id) => {
  const category = await EventCategory.findById(id);
  if (!category) throw createError('Event category not found', 404);
  return category;
};

// ─── CREATE CATEGORY ──────────────────────────────────────────────────────────
const createCategory = async (body) => {
  const { name } = body;
  if (!name) throw createError('Category name is required', 400);

  const existing = await EventCategory.findOne({ name: name.trim() });
  if (existing) throw createError('Event category already exists', 409);

  return EventCategory.create(body);
};

// ─── UPDATE CATEGORY ──────────────────────────────────────────────────────────
const updateCategory = async (id, body) => {
  const category = await EventCategory.findById(id);
  if (!category) throw createError('Event category not found', 404);

  return EventCategory.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// ─── DELETE CATEGORY ──────────────────────────────────────────────────────────
const deleteCategory = async (id) => {
  const category = await EventCategory.findById(id);
  if (!category) throw createError('Event category not found', 404);

  // Soft delete by marking as inactive
  category.isActive = false;
  await category.save();
};

// ─── SEED DEFAULT CATEGORIES ──────────────────────────────────────────────────
const seedEventCategories = async () => {
  const defaults = [
    { name: 'Hackathons',           icon: '💻', color: '#3b82f6' },
    { name: 'Workshops',            icon: '🛠️', color: '#10b981' },
    { name: 'Coding Contests',      icon: '🏆', color: '#f59e0b' },
    { name: 'Webinars',             icon: '🎥', color: '#8b5cf6' },
    { name: 'Meetups',              icon: '🤝', color: '#ef4444' },
    { name: 'Conferences',          icon: '🎤', color: '#06b6d4' },
    { name: 'Networking',           icon: '🌐', color: '#ec4899' },
    { name: 'Bootcamps',            icon: '🚀', color: '#14b8a6' },
    { name: 'Tech Talks',           icon: '🎙️', color: '#f97316' },
    { name: 'Career Development',   icon: '📈', color: '#6366f1' },
  ];

  for (const cat of defaults) {
    await EventCategory.findOneAndUpdate(
      { name: cat.name },
      cat,
      { upsert: true, new: true }
    );
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  seedEventCategories,
};
