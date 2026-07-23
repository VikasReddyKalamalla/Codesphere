const NotificationTemplate = require('../models/NotificationTemplate');
const createError = (message, statusCode) => { const err = new Error(message); err.statusCode = statusCode; return err; };

/**
 * Create a new notification template.
 */
const createTemplate = async (data, userId) => {
  const existing = await NotificationTemplate.findOne({ name: data.name });
  if (existing) {
    throw createError('A template with this name already exists', 409);
  }

  const template = await NotificationTemplate.create({
    ...data,
    createdBy: userId,
  });

  return template;
};

/**
 * Get all templates with optional filtering and pagination.
 */
const getAllTemplates = async (query = {}) => {
  const { page = 1, limit = 20, category, isActive, search } = query;

  const filter = {};
  if (category) filter.category = category;
  if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [templates, total] = await Promise.all([
    NotificationTemplate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email')
      .lean(),
    NotificationTemplate.countDocuments(filter),
  ]);

  return {
    templates,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a single template by ID.
 */
const getTemplateById = async (templateId) => {
  const template = await NotificationTemplate.findById(templateId).populate(
    'createdBy updatedBy',
    'name email'
  );

  if (!template) {
    throw createError('Template not found', 404);
  }

  return template;
};

/**
 * Update a template.
 */
const updateTemplate = async (templateId, data, userId) => {
  if (data.name) {
    const existing = await NotificationTemplate.findOne({
      name: data.name,
      _id: { $ne: templateId },
    });
    if (existing) {
      throw createError('A template with this name already exists', 409);
    }
  }

  const template = await NotificationTemplate.findByIdAndUpdate(
    templateId,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  );

  if (!template) {
    throw createError('Template not found', 404);
  }

  return template;
};

/**
 * Delete a template.
 */
const deleteTemplate = async (templateId) => {
  const template = await NotificationTemplate.findByIdAndDelete(templateId);

  if (!template) {
    throw createError('Template not found', 404);
  }

  return { message: 'Template deleted successfully' };
};

/**
 * Render a notification from a template using provided variables.
 */
const renderFromTemplate = async (templateId, variables = {}) => {
  const template = await NotificationTemplate.findById(templateId);

  if (!template) {
    throw createError('Template not found', 404);
  }

  if (!template.isActive) {
    throw createError('Template is not active', 400);
  }

  return {
    title: template.renderTitle(variables),
    message: template.renderMessage(variables),
    category: template.category,
    type: template.type,
    priority: template.priority,
    icon: template.icon,
    templateId: template._id,
  };
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  renderFromTemplate,
};
