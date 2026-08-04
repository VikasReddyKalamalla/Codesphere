const Workspace         = require('../models/Workspace');
const WorkspaceMember   = require('../models/WorkspaceMember');
const activityService   = require('./workspaceActivity.service');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL WORKSPACES ───────────────────────────────────────────────────────
const getAllWorkspaces = async (query) => {
  const {
    page = 1,
    limit = 12,
    search,
    visibility,
    status,
    owner,
    technologyStack,
    sortBy = 'createdAt',
    order  = 'desc',
  } = query;

  const filter = { visibility: 'public' };

  if (search)           filter.$text = { $search: search };
  if (status)           filter.status = status;
  if (owner)            filter.owner  = owner;
  if (technologyStack)  filter.technologyStack = { $in: Array.isArray(technologyStack) ? technologyStack : [technologyStack] };

  let total = await Workspace.countDocuments(filter).catch(() => 0);
  if (total === 0) {
    const { autoSeedIfEmpty } = require('../utils/autoSeed');
    await autoSeedIfEmpty().catch(() => {});
    total = await Workspace.countDocuments(filter).catch(() => 0);
  }

  const { skip, ...meta } = getPagination(page, limit, total);

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortOptions = {};
  if (sortBy === 'members')  sortOptions.memberCount  = -1;
  else if (sortBy === 'active') sortOptions.taskCount = -1;
  else sortOptions[sortBy === 'newest' ? 'createdAt' : sortBy] = sortOrder;

  const workspaces = await Workspace.find(filter)
    .populate('owner', 'fullName avatar')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, workspaces };
};

// ─── GET WORKSPACE BY ID ──────────────────────────────────────────────────────
const getWorkspaceById = async (id, userId) => {
  const workspace = await Workspace.findById(id)
    .populate('owner', 'fullName avatar bio');

  if (!workspace) throw createError('Workspace not found', 404);

  // Private workspaces are only visible to members
  if (workspace.visibility === 'private') {
    const isMember = await WorkspaceMember.findOne({ workspaceId: id, userId });
    if (!isMember) throw createError('You do not have access to this workspace', 403);
  }

  return workspace;
};

// ─── CREATE WORKSPACE ─────────────────────────────────────────────────────────
const createWorkspace = async (body, userId) => {
  const { name } = body;
  if (!name) throw createError('Workspace name is required', 400);

  const existing = await Workspace.findOne({ name: name.trim(), owner: userId });
  if (existing) {
    return existing;
  }

  const workspace = await Workspace.create({ ...body, owner: userId, memberCount: 1 });

  // Auto-add owner as a member with 'owner' role
  try {
    await WorkspaceMember.create({ workspaceId: workspace._id, userId, role: 'owner' });
  } catch (mErr) {
    console.warn('[WorkspaceService] WorkspaceMember create warning:', mErr.message);
  }

  try {
    await activityService.log(workspace._id, userId, 'workspace_created', `Workspace "${workspace.name}" was created`);
  } catch (aErr) {
    console.warn('[WorkspaceService] Activity log warning:', aErr.message);
  }

  return workspace;
};

// ─── UPDATE WORKSPACE ─────────────────────────────────────────────────────────
const updateWorkspace = async (id, body, userId, userRole) => {
  const workspace = await Workspace.findById(id);
  if (!workspace) throw createError('Workspace not found', 404);

  await requireAdminAccess(id, userId, userRole, workspace);

  delete body.owner;

  const updated = await Workspace.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate('owner', 'fullName avatar');

  await activityService.log(id, userId, 'workspace_updated', `Workspace settings were updated`, 'settings', id);

  return updated;
};

// ─── DELETE WORKSPACE ─────────────────────────────────────────────────────────
const deleteWorkspace = async (id, userId, userRole) => {
  const workspace = await Workspace.findById(id);
  if (!workspace) throw createError('Workspace not found', 404);

  if (workspace.owner.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('Only the workspace owner can delete this workspace', 403);
  }

  // Cascade delete members
  await WorkspaceMember.deleteMany({ workspaceId: id });

  await workspace.deleteOne();
};

// ─── ARCHIVE WORKSPACE ────────────────────────────────────────────────────────
const archiveWorkspace = async (id, userId, userRole) => {
  const workspace = await Workspace.findById(id);
  if (!workspace) throw createError('Workspace not found', 404);

  await requireAdminAccess(id, userId, userRole, workspace);

  if (workspace.status === 'archived') throw createError('Workspace is already archived', 400);

  workspace.status = 'archived';
  await workspace.save();

  await activityService.log(id, userId, 'workspace_updated', 'Workspace was archived', 'settings', id);

  return workspace;
};

// ─── GET MY WORKSPACES ────────────────────────────────────────────────────────
const getMyWorkspaces = async (userId, query = {}) => {
  const { page = 1, limit = 12, status } = query;

  let workspaceIds = [];
  if (userId) {
    const memberships = await WorkspaceMember.find({ userId }).select('workspaceId').lean();
    workspaceIds = memberships.map((m) => m.workspaceId);
  }

  const filter = userId
    ? { $or: [{ owner: userId }, { _id: { $in: workspaceIds } }, { visibility: 'public' }] }
    : { visibility: 'public' };

  if (status) filter.status = status;

  let total = await Workspace.countDocuments(filter).catch(() => 0);
  if (total === 0) {
    const { autoSeedIfEmpty } = require('../utils/autoSeed');
    await autoSeedIfEmpty().catch(() => {});
    total = await Workspace.countDocuments(filter).catch(() => 0);
  }

  const { skip, ...meta } = getPagination(page, limit, total);

  const workspaces = await Workspace.find(filter)
    .populate('owner', 'fullName avatar')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, workspaces };
};

// ─── GET WORKSPACE STATS ─────────────────────────────────────────────────────
const getWorkspaceStats = async (id, userId, userRole) => {
  const workspace = await Workspace.findById(id);
  if (!workspace) throw createError('Workspace not found', 404);

  if (workspace.visibility === 'private') {
    const isMember = await WorkspaceMember.findOne({ workspaceId: id, userId });
    if (!isMember && userRole !== 'admin') throw createError('Access denied', 403);
  }

  const progress = workspace.taskCount > 0
    ? ((workspace.completedTaskCount / workspace.taskCount) * 100).toFixed(1)
    : 0;

  return {
    workspaceId:       workspace._id,
    name:              workspace.name,
    status:            workspace.status,
    memberCount:       workspace.memberCount,
    taskCount:         workspace.taskCount,
    completedTaskCount:workspace.completedTaskCount,
    milestoneCount:    workspace.milestoneCount,
    progress:          parseFloat(progress),
  };
};

// ─── DUPLICATE WORKSPACE ─────────────────────────────────────────────────────
const duplicateWorkspace = async (workspaceId, userId) => {
  const original = await Workspace.findById(workspaceId);
  if (!original) throw createError('Workspace not found', 404);

  const copy = await Workspace.create({
    name: `${original.name} (Copy)`,
    description: original.description,
    owner: userId,
    visibility: original.visibility,
    status: original.status,
    logo: original.logo,
    bannerImage: original.bannerImage,
    technologyStack: original.technologyStack,
    framework: original.framework,
    database: original.database,
    deployment: original.deployment,
    githubRepo: original.githubRepo,
    liveUrl: original.liveUrl,
    tags: original.tags,
    memberCount: 1,
    taskCount: 0,
    completedTaskCount: 0
  });

  // Add owner as member
  await WorkspaceMember.create({ workspaceId: copy._id, userId, role: 'owner' });

  // Duplicate virtual files
  const WorkspaceFile = require('../models/WorkspaceFile');
  const files = await WorkspaceFile.find({ workspaceId });
  const idMap = new Map();
  
  for (const f of files) {
    const newFile = await WorkspaceFile.create({
      workspaceId: copy._id,
      name: f.name,
      path: f.path,
      type: f.type,
      content: f.content,
      parentId: null
    });
    idMap.set(f._id.toString(), newFile._id);
  }

  // Resolve parentIds
  for (const f of files) {
    if (f.parentId) {
      const newParentId = idMap.get(f.parentId.toString());
      const copiedFileId = idMap.get(f._id.toString());
      if (newParentId && copiedFileId) {
        await WorkspaceFile.findByIdAndUpdate(copiedFileId, { parentId: newParentId });
      }
    }
  }

  // Duplicate physical disk folder
  const fs = require('fs');
  const path = require('path');
  const originalDisk = path.join(__dirname, '../uploads/workspaces', workspaceId.toString());
  const copyDisk = path.join(__dirname, '../uploads/workspaces', copy._id.toString());
  
  if (fs.existsSync(originalDisk)) {
    const copyDir = (src, dest) => {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (fs.lstatSync(srcPath).isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    copyDir(originalDisk, copyDisk);
  }

  // Duplicate tasks
  const Task = require('../models/Task');
  const tasks = await Task.find({ workspaceId });
  for (const t of tasks) {
    await Task.create({
      workspaceId: copy._id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      labels: t.labels,
      dueDate: t.dueDate,
      estimatedHours: t.estimatedHours,
      completedHours: t.completedHours,
      reporter: userId
    });
  }

  // Update counts
  const taskCount = await Task.countDocuments({ workspaceId: copy._id });
  await Workspace.findByIdAndUpdate(copy._id, { taskCount });

  await activityService.log(copy._id, userId, 'workspace_created', `Workspace duplicated from "${original.name}"`);

  return copy;
};

// ─── RESTORE WORKSPACE ───────────────────────────────────────────────────────
const restoreWorkspace = async (id, userId, userRole) => {
  const workspace = await Workspace.findById(id);
  if (!workspace) throw createError('Workspace not found', 404);

  await requireAdminAccess(id, userId, userRole, workspace);

  if (workspace.status !== 'archived') throw createError('Workspace is not archived', 400);

  workspace.status = 'active';
  await workspace.save();

  await activityService.log(id, userId, 'workspace_updated', 'Workspace was restored from archive', 'settings', id);

  return workspace;
};

// ─── INTERNAL: require owner or admin access ──────────────────────────────────
const requireAdminAccess = async (workspaceId, userId, userRole, workspace) => {
  if (userRole === 'admin') return;
  const member = await WorkspaceMember.findOne({ workspaceId, userId });
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    throw createError('You do not have permission to perform this action', 403);
  }
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  archiveWorkspace,
  restoreWorkspace,
  duplicateWorkspace,
  getMyWorkspaces,
  getWorkspaceStats,
};
