const SandboxDownload = require('../models/SandboxDownload');
const SandboxTemplate = require('../models/SandboxTemplate');
const SandboxProject  = require('../models/SandboxProject');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── RECORD DOWNLOAD ──────────────────────────────────────────────────────────
const recordDownload = async (templateId, userId, ipAddress = '') => {
  const template = await SandboxTemplate.findById(templateId);
  if (!template) throw createError('Template not found', 404);

  const project = await SandboxProject.findById(template.projectId);
  if (!project) throw createError('Project not found', 404);

  // Record download
  const download = await SandboxDownload.create({ templateId, userId, ipAddress });

  // Increment template and project download counts
  await SandboxTemplate.findByIdAndUpdate(templateId, { $inc: { downloadCount: 1 } });
  await SandboxProject.findByIdAndUpdate(template.projectId, { $inc: { downloadCount: 1 } });

  return {
    download,
    downloadUrl: template.fileUrl,
    templateTitle: template.title,
  };
};

// ─── GET USER DOWNLOAD HISTORY ────────────────────────────────────────────────
const getUserDownloads = async (userId, { page = 1, limit = 20 }) => {
  const total = await SandboxDownload.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const downloads = await SandboxDownload.find({ userId })
    .populate({
      path:   'templateId',
      select: 'title templateType fileUrl projectId',
      populate: {
        path:   'projectId',
        select: 'title thumbnail instructor',
        populate: { path: 'instructor', select: 'fullName avatar' },
      },
    })
    .sort({ downloadedAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, downloads };
};

module.exports = { recordDownload, getUserDownloads };
