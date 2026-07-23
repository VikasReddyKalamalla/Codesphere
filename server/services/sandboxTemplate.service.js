const SandboxTemplate = require('../models/SandboxTemplate');
const SandboxProject  = require('../models/SandboxProject');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET TEMPLATES FOR PROJECT ────────────────────────────────────────────────
const getProjectTemplates = async (projectId) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  return SandboxTemplate.find({ projectId })
    .populate('uploadedBy', 'fullName avatar')
    .sort({ createdAt: -1 });
};

// ─── CREATE TEMPLATE ──────────────────────────────────────────────────────────
const createTemplate = async (body, userId, userRole) => {
  const { projectId, title, fileUrl } = body;

  if (!projectId) throw createError('Project ID is required', 400);
  if (!title)     throw createError('Template title is required', 400);
  if (!fileUrl)   throw createError('File URL is required', 400);

  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  // Only instructor or admin can add templates
  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('Only the project instructor can add templates', 403);
  }

  return SandboxTemplate.create({ ...body, uploadedBy: userId });
};

// ─── DELETE TEMPLATE ──────────────────────────────────────────────────────────
const deleteTemplate = async (templateId, userId, userRole) => {
  const template = await SandboxTemplate.findById(templateId).populate('projectId');
  if (!template) throw createError('Template not found', 404);

  const project = template.projectId;
  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('Only the project instructor can delete templates', 403);
  }

  await template.deleteOne();
};

module.exports = { getProjectTemplates, createTemplate, deleteTemplate };
