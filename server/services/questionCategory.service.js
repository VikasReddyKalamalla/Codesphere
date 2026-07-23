const QuestionCategory = require('../models/QuestionCategory');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getAllCategories = async () => {
  return QuestionCategory.find({ isActive: true }).sort({ name: 1 });
};

const getCategoryById = async (id) => {
  const category = await QuestionCategory.findById(id);
  if (!category) throw createError('Category not found', 404);
  return category;
};

const createCategory = async (body) => {
  const { name } = body;
  if (!name) throw createError('Category name is required', 400);

  const existing = await QuestionCategory.findOne({ name: name.trim() });
  if (existing) throw createError('Category already exists', 409);

  return QuestionCategory.create(body);
};

const updateCategory = async (id, body) => {
  const category = await QuestionCategory.findById(id);
  if (!category) throw createError('Category not found', 404);

  return QuestionCategory.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

const deleteCategory = async (id) => {
  const category = await QuestionCategory.findById(id);
  if (!category) throw createError('Category not found', 404);

  category.isActive = false;
  await category.save();
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
