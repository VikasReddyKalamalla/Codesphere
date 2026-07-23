const Milestone       = require('../models/Milestone');
const Workspace       = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');
const activityService = require('./workspaceActivity.service');

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

// ─── GET MILESTONES ───────────────────────────────────────────────────────────
const getWorkspaceMilestones = async (workspaceId, userId) => {
  await assertMember(workspaceId, userId);

  const milestones = await Milestone.find({ workspaceId }).sort({ dueDate: 1 });

  // Attach progress percentage to each milestone
  return milestones.map((m) => ({
    ...m.toObject(),
    progress: m.taskCount > 0 ? ((m.completedTaskCount / m.taskCount) * 100).toFixed(1) : 0,
  }));
};

// ─── GET MILESTONE BY ID ─────────────────────────────────────────────────────
const getMilestoneById = async (milestoneId, userId) => {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) throw createError('Milestone not found', 404);

  await assertMember(milestone.workspaceId, userId);

  const progress = milestone.taskCount > 0
    ? ((milestone.completedTaskCount / milestone.taskCount) * 100).toFixed(1)
    : 0;

  return { ...milestone.toObject(), progress };
};

// ─── CREATE MILESTONE ─────────────────────────────────────────────────────────
const createMilestone = async (body, userId) => {
  const { workspaceId, title } = body;

  if (!workspaceId) throw createError('Workspace ID is required', 400);
  if (!title)       throw createError('Milestone title is required', 400);

  const member = await assertMember(workspaceId, userId);

  // Only owner or admin can create milestones
  if (member.role === 'member') {
    throw createError('Only workspace owners or admins can create milestones', 403);
  }

  const milestone = await Milestone.create(body);

  // Increment workspace milestone count
  await Workspace.findByIdAndUpdate(workspaceId, { $inc: { milestoneCount: 1 } });

  await activityService.log(workspaceId, userId, 'milestone_created', `Milestone "${milestone.title}" was created`, 'milestone', milestone._id);

  return milestone;
};

// ─── UPDATE MILESTONE ─────────────────────────────────────────────────────────
const updateMilestone = async (milestoneId, body, userId, userRole) => {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) throw createError('Milestone not found', 404);

  const member = await assertMember(milestone.workspaceId, userId);

  if (member.role === 'member' && userRole !== 'admin') {
    throw createError('Only workspace owners or admins can update milestones', 403);
  }

  const updated = await Milestone.findByIdAndUpdate(milestoneId, body, { new: true, runValidators: true });

  return { ...updated.toObject(), progress: updated.taskCount > 0 ? ((updated.completedTaskCount / updated.taskCount) * 100).toFixed(1) : 0 };
};

// ─── COMPLETE MILESTONE ───────────────────────────────────────────────────────
const completeMilestone = async (milestoneId, userId, userRole) => {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) throw createError('Milestone not found', 404);

  const member = await assertMember(milestone.workspaceId, userId);

  if (member.role === 'member' && userRole !== 'admin') {
    throw createError('Only workspace owners or admins can complete milestones', 403);
  }

  if (milestone.status === 'completed') throw createError('Milestone is already completed', 400);

  milestone.status      = 'completed';
  milestone.completedAt = new Date();
  await milestone.save();

  await activityService.log(milestone.workspaceId, userId, 'milestone_completed', `Milestone "${milestone.title}" was completed`, 'milestone', milestoneId);

  return milestone;
};

// ─── DELETE MILESTONE ─────────────────────────────────────────────────────────
const deleteMilestone = async (milestoneId, userId, userRole) => {
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) throw createError('Milestone not found', 404);

  const member = await assertMember(milestone.workspaceId, userId);

  if (member.role === 'member' && userRole !== 'admin') {
    throw createError('Only workspace owners or admins can delete milestones', 403);
  }

  await Workspace.findByIdAndUpdate(milestone.workspaceId, { $inc: { milestoneCount: -1 } });

  await milestone.deleteOne();
};

module.exports = {
  getWorkspaceMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  completeMilestone,
  deleteMilestone,
};
