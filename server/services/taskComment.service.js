const TaskComment     = require('../models/TaskComment');
const Task            = require('../models/Task');
const WorkspaceMember = require('../models/WorkspaceMember');
const activityService = require('./workspaceActivity.service');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET COMMENTS FOR TASK ────────────────────────────────────────────────────
const getTaskComments = async (taskId, userId, query) => {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const isMember = await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId });
  if (!isMember) throw createError('Access denied', 403);

  const { page = 1, limit = 20 } = query;

  // Get only top-level comments (replies loaded separately)
  const filter = { taskId, parentComment: null };
  const total  = await TaskComment.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const comments = await TaskComment.find(filter)
    .populate('author', 'fullName avatar')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, comments };
};

// ─── ADD COMMENT ──────────────────────────────────────────────────────────────
const addComment = async (taskId, body, userId) => {
  const { content, parentComment } = body;

  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const isMember = await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId });
  if (!isMember) throw createError('Only workspace members can comment on tasks', 403);

  // Validate parent comment if replying
  if (parentComment) {
    const parent = await TaskComment.findById(parentComment);
    if (!parent || parent.taskId.toString() !== taskId) {
      throw createError('Parent comment not found on this task', 404);
    }
  }

  const comment = await TaskComment.create({ taskId, author: userId, content, parentComment: parentComment || null });

  // Increment task comment count
  await Task.findByIdAndUpdate(taskId, { $inc: { commentCount: 1 } });

  await activityService.log(task.workspaceId, userId, 'comment_added', `A comment was added to task "${task.title}"`, 'comment', comment._id);

  return comment.populate('author', 'fullName avatar');
};

// ─── EDIT COMMENT ─────────────────────────────────────────────────────────────
const editComment = async (commentId, body, userId) => {
  const comment = await TaskComment.findById(commentId);
  if (!comment) throw createError('Comment not found', 404);

  if (comment.author.toString() !== userId.toString()) {
    throw createError('You can only edit your own comments', 403);
  }

  comment.content  = body.content;
  comment.isEdited = true;
  await comment.save();

  return comment.populate('author', 'fullName avatar');
};

// ─── DELETE COMMENT ───────────────────────────────────────────────────────────
const deleteComment = async (commentId, userId, userRole) => {
  const comment = await TaskComment.findById(commentId);
  if (!comment) throw createError('Comment not found', 404);

  const isAuthor = comment.author.toString() === userId.toString();
  const isAdmin  = userRole === 'admin';

  // Also allow workspace admin/owner to delete
  const task = await Task.findById(comment.taskId);
  const member = task ? await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId }) : null;
  const isWorkspaceAdmin = member && (member.role === 'owner' || member.role === 'admin');

  if (!isAuthor && !isAdmin && !isWorkspaceAdmin) {
    throw createError('You are not authorized to delete this comment', 403);
  }

  await comment.deleteOne();

  // Decrement task comment count
  if (task) await Task.findByIdAndUpdate(comment.taskId, { $inc: { commentCount: -1 } });
};

// ─── GET REPLIES ──────────────────────────────────────────────────────────────
const getReplies = async (commentId, userId) => {
  const parent = await TaskComment.findById(commentId).populate('author', 'fullName avatar');
  if (!parent) throw createError('Comment not found', 404);

  const task = await Task.findById(parent.taskId);
  if (!task) throw createError('Task not found', 404);

  const isMember = await WorkspaceMember.findOne({ workspaceId: task.workspaceId, userId });
  if (!isMember) throw createError('Access denied', 403);

  return TaskComment.find({ parentComment: commentId })
    .populate('author', 'fullName avatar')
    .sort({ createdAt: 1 });
};

module.exports = { getTaskComments, addComment, editComment, deleteComment, getReplies };
