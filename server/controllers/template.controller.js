const templateService = require('../services/template.service');

/**
 * POST /api/notification-templates
 * Create a new notification template (Admin only).
 */
const createTemplate = async (req, res) => {
  const template = await templateService.createTemplate(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Template created successfully',
    template,
  });
};

/**
 * GET /api/notification-templates
 * Get all notification templates with optional filters.
 */
const getAllTemplates = async (req, res) => {
  const result = await templateService.getAllTemplates(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * GET /api/notification-templates/:id
 * Get a single template by ID.
 */
const getTemplateById = async (req, res) => {
  const template = await templateService.getTemplateById(req.params.id);

  res.status(200).json({
    success: true,
    template,
  });
};

/**
 * PUT /api/notification-templates/:id
 * Update a notification template (Admin only).
 */
const updateTemplate = async (req, res) => {
  const template = await templateService.updateTemplate(
    req.params.id,
    req.body,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: 'Template updated successfully',
    template,
  });
};

/**
 * DELETE /api/notification-templates/:id
 * Delete a notification template (Admin only).
 */
const deleteTemplate = async (req, res) => {
  const result = await templateService.deleteTemplate(req.params.id);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * POST /api/notification-templates/:id/render
 * Render a notification from a template with provided variables.
 */
const renderTemplate = async (req, res) => {
  const result = await templateService.renderFromTemplate(req.params.id, req.body.variables);

  res.status(200).json({
    success: true,
    ...result,
  });
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  renderTemplate,
};
