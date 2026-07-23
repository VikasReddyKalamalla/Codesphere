const TaskAttachment  = require('../models/TaskAttachment');
const Task            = require('../models/Task');
const WorkspaceMember = require('../models/WorkspaceMember');
const activityService = require('./workspaceActivity.service');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ATTACHMENTS FOR TASK ─────────────────────────────────────────────────
const getTaskAttachments = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const isMember = await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId });
  if (!isMember) throw createError('Access denied', 403);

  return TaskAttachment.find({ taskId })
    .populate('uploadedBy', 'fullName avatar')
    .sort({ uploadedAt: -1 });
};

// ─── UPLOAD ATTACHMENT ────────────────────────────────────────────────────────
const uploadAttachment = async (taskId, fileData, userId) => {
  const { fileName, fileUrl, fileType, fileSize } = fileData;

  if (!fileName || !fileUrl) throw createError('File name and URL are required', 400);

  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const isMember = await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId });
  if (!isMember) throw createError('Only workspace members can upload attachments', 403);

  const attachment = await TaskAttachment.create({
    taskId,
    uploadedBy: userId,
    fileName,
    fileUrl,
    fileType: fileType || '',
    fileSize: fileSize || 0,
  });

  // Increment task attachment count
  await Task.findByIdAndUpdate(taskId, { $inc: { attachmentCount: 1 } });

  await activityService.log(task.workspaceId, userId, 'attachment_uploaded', `A file was attached to task "${task.title}"`, 'attachment', attachment._id);

  return attachment.populate('uploadedBy', 'fullName avatar');
};

// ─── DELETE ATTACHMENT ────────────────────────────────────────────────────────
const deleteAttachment = async (attachmentId, userId, userRole) => {
  const attachment = await TaskAttachment.findById(attachmentId);
  if (!attachment) throw createError('Attachment not found', 404);

  const task = await Task.findById(attachment.taskId);
  const member = task ? await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId }) : null;

  const isUploader       = attachment.uploadedBy.toString() === userId.toString();
  const isAdmin          = userRole === 'admin';
  const isWorkspaceAdmin = member && (member.role === 'owner' || member.role === 'admin');

  if (!isUploader && !isAdmin && !isWorkspaceAdmin) {
    throw createError('You are not authorized to delete this attachment', 403);
  }

  await attachment.deleteOne();

  // Decrement task attachment count
  if (task) await Task.findByIdAndUpdate(attachment.taskId, { $inc: { attachmentCount: -1 } });

  return { message: 'Attachment deleted successfully' };
};

module.exports = { getTaskAttachments, uploadAttachment, deleteAttachment };
