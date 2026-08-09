const express = require('express');
const router  = express.Router();

const {
  getAllWorkspaces,
  getMyWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  archiveWorkspace,
  restoreWorkspace,
  duplicateWorkspace,
  getWorkspaceStats,
} = require('../controllers/workspace.controller');

const {
  inviteMember,
  acceptInvitation,
  rejectInvitation,
  removeMember,
  leaveWorkspace,
  transferOwnership,
  getMembers,
  getPendingInvites,
  getMyInvites,
} = require('../controllers/workspaceMember.controller');

const { getWorkspaceTasks }       = require('../controllers/task.controller');
const { getWorkspaceMilestones }  = require('../controllers/milestone.controller');
const { getActivities }           = require('../controllers/workspaceActivity.controller');

const { protect, optionalAuth } = require('../middlewares/auth.middleware');

// ─── Workspace CRUD ───────────────────────────────────────────────────────────
router.get   ('/',          optionalAuth, getAllWorkspaces);
router.get   ('/my',        optionalAuth, getMyWorkspaces);
router.get   ('/my/invites',protect, getMyInvites);
router.get   ('/:id',       optionalAuth, getWorkspaceById);
router.post  ('/',          protect, createWorkspace);
router.put   ('/:id',       protect, updateWorkspace);
router.delete('/:id',       protect, deleteWorkspace);

// ─── Lifecycle ────────────────────────────────────────────────────────────────
router.patch('/:id/archive',  protect, archiveWorkspace);
router.patch('/:id/restore',  protect, restoreWorkspace);
router.post ('/:id/duplicate',protect, duplicateWorkspace);

const { importGitHubRepo, syncGitHubRepo } = require('../controllers/githubSync.controller');

// ─── GitHub Sync ──────────────────────────────────────────────────────────────
router.post('/:id/github/import', protect, importGitHubRepo);
router.post('/:id/github/sync',   protect, syncGitHubRepo);

// ─── Stats ────────────────────────────────────────────────────────────────────
router.get('/:id/stats', protect, getWorkspaceStats);

// ─── Members ──────────────────────────────────────────────────────────────────
router.post  ('/:id/invite',             protect, inviteMember);
router.put   ('/:id/accept',             protect, acceptInvitation);
router.put   ('/:id/reject',             protect, rejectInvitation);
router.delete('/:id/members/:memberId',  protect, removeMember);
router.delete('/:id/leave',              protect, leaveWorkspace);
router.put   ('/:id/transfer',           protect, transferOwnership);
router.get   ('/:id/members',            protect, getMembers);
router.get   ('/:id/invites',            protect, getPendingInvites);

// ─── Tasks (workspace-scoped) ─────────────────────────────────────────────────
router.get('/:id/tasks', protect, getWorkspaceTasks);

// ─── Milestones (workspace-scoped) ───────────────────────────────────────────
router.get('/:id/milestones', protect, getWorkspaceMilestones);

// ─── Activity Log ─────────────────────────────────────────────────────────────
router.get('/:id/activities', protect, getActivities);

// ─── Sub Routing ──────────────────────────────────────────────────────────────
router.use('/:id/files',     require('./workspaceFile.routes'));
router.use('/:id/chats',     require('./workspaceChat.routes'));
router.use('/:id/analytics', require('./workspaceAnalytics.routes'));

module.exports = router;
