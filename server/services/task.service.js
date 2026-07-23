const Task            = require('../models/Task');
const Workspace       = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');
const Milestone       = require('../models/Milestone');
const activityService = require('./workspaceActivity.service');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ASSERT WORKSPACE MEMBERSHIP ─────────────────────────────────────────────
const assertMember = async (workspaceId, userId) => {
  const member = await WorkspaceMember.findOne({ workspaceId, userId });
  if (!member) throw createError('You are not a member of this workspace', 403);
  return member;
};

// ─── GET TASKS FOR WORKSPACE ──────────────────────────────────────────────────
const getWorkspaceTasks = async (workspaceId, userId, query) => {
  await assertMember(workspaceId, userId);

  const { page = 1, limit = 20, status, priority, assignedTo, milestoneId, search } = query;

  const filter = { workspaceId };
  if (status)      filter.status      = status;
  if (priority)    filter.priority    = priority;
  if (assignedTo)  filter.assignedTo  = assignedTo;
  if (milestoneId) filter.milestoneId = milestoneId;
  if (search)      filter.$text       = { $search: search };

  const total = await Task.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'fullName avatar')
    .populate('reporter',   'fullName avatar')
    .populate('milestoneId', 'title status')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, tasks };
};

// ─── GET TASK BY ID ───────────────────────────────────────────────────────────
const getTaskById = async (taskId, userId) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'fullName avatar email')
    .populate('reporter',   'fullName avatar email')
    .populate('milestoneId', 'title status dueDate');

  if (!task) throw createError('Task not found', 404);

  await assertMember(task.workspaceId, userId);

  return task;
};

// ─── CREATE TASK ──────────────────────────────────────────────────────────────
const createTask = async (body, userId) => {
  const { workspaceId, title } = body;

  if (!workspaceId) throw createError('Workspace ID is required', 400);
  if (!title)       throw createError('Task title is required', 400);

  await assertMember(workspaceId, userId);

  const task = await Task.create({ ...body, reporter: userId });

  // Increment workspace task count
  await Workspace.findByIdAndUpdate(workspaceId, { $inc: { taskCount: 1 } });

  // Increment milestone task count if linked
  if (task.milestoneId) {
    await Milestone.findByIdAndUpdate(task.milestoneId, { $inc: { taskCount: 1 } });
  }

  await activityService.log(workspaceId, userId, 'task_created', `Task "${task.title}" was created`, 'task', task._id);

  return task;
};

// ─── UPDATE TASK ──────────────────────────────────────────────────────────────
const updateTask = async (taskId, body, userId, userRole) => {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const member = await assertMember(task.workspaceId, userId);

  // Only reporter, assignee, or workspace admin/owner can update
  const isPrivileged = member.role === 'owner' || member.role === 'admin' || userRole === 'admin';
  const isInvolved   = task.reporter.toString() === userId.toString() ||
                       (task.assignedTo && task.assignedTo.toString() === userId.toString());

  if (!isPrivileged && !isInvolved) {
    throw createError('You are not authorized to update this task', 403);
  }

  // Track status change for completion logging
  const wasCompleted = task.status === 'completed';
  const nowCompleted = body.status === 'completed';

  if (nowCompleted && !wasCompleted) {
    body.completedAt = new Date();
    // Increment workspace completed task count
    await Workspace.findByIdAndUpdate(task.workspaceId, { $inc: { completedTaskCount: 1 } });
    if (task.milestoneId) {
      await Milestone.findByIdAndUpdate(task.milestoneId, { $inc: { completedTaskCount: 1 } });
    }
  }

  if (!nowCompleted && wasCompleted && body.status) {
    body.completedAt = null;
    await Workspace.findByIdAndUpdate(task.workspaceId, { $inc: { completedTaskCount: -1 } });
    if (task.milestoneId) {
      await Milestone.findByIdAndUpdate(task.milestoneId, { $inc: { completedTaskCount: -1 } });
    }
  }

  const updated = await Task.findByIdAndUpdate(taskId, body, { new: true, runValidators: true })
    .populate('assignedTo', 'fullName avatar')
    .populate('reporter',   'fullName avatar');

  const activityType = body.assignedTo ? 'task_assigned' : nowCompleted ? 'task_completed' : 'task_updated';
  await activityService.log(task.workspaceId, userId, activityType, `Task "${task.title}" was updated`, 'task', taskId);

  return updated;
};

// ─── DELETE TASK ──────────────────────────────────────────────────────────────
const deleteTask = async (taskId, userId, userRole) => {
  const task = await Task.findById(taskId);
  if (!task) throw createError('Task not found', 404);

  const member = await assertMember(task.workspaceId, userId);

  const isPrivileged = member.role === 'owner' || member.role === 'admin' || userRole === 'admin';
  const isReporter   = task.reporter.toString() === userId.toString();

  if (!isPrivileged && !isReporter) {
    throw createError('Only the task reporter or workspace admins can delete this task', 403);
  }

  // Decrement workspace stats
  await Workspace.findByIdAndUpdate(task.workspaceId, { $inc: { taskCount: -1 } });
  if (task.status === 'completed') {
    await Workspace.findByIdAndUpdate(task.workspaceId, { $inc: { completedTaskCount: -1 } });
  }

  // Decrement milestone stats
  if (task.milestoneId) {
    await Milestone.findByIdAndUpdate(task.milestoneId, { $inc: { taskCount: -1 } });
    if (task.status === 'completed') {
      await Milestone.findByIdAndUpdate(task.milestoneId, { $inc: { completedTaskCount: -1 } });
    }
  }

  await task.deleteOne();
};

// ─── GET MY TASKS (across workspaces) ────────────────────────────────────────
const getMyTasks = async (userId, query) => {
  const { page = 1, limit = 20, status } = query;

  const filter = { assignedTo: userId };
  if (status) filter.status = status;

  const total = await Task.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const tasks = await Task.find(filter)
    .populate('workspaceId', 'name slug logo')
    .populate('reporter',    'fullName avatar')
    .populate('milestoneId', 'title status')
    .sort({ dueDate: 1, createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, tasks };
};

module.exports = {
  getWorkspaceTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
};
