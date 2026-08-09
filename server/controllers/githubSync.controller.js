const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const githubSyncService = require('../services/githubSync.service');

// POST /api/workspaces/:id/github/import
const importGitHubRepo = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body;
  const data = await githubSyncService.importGitHubRepository(req.params.id, repoUrl, req.user._id);
  return successResponse(res, 200, 'GitHub repository imported successfully', data);
});

// POST /api/workspaces/:id/github/sync
const syncGitHubRepo = asyncHandler(async (req, res) => {
  const { repoUrl, commitMessage } = req.body;
  const data = await githubSyncService.syncGitHubRepository(req.params.id, repoUrl, commitMessage, req.user._id);
  return successResponse(res, 200, 'Workspace synced to GitHub successfully', data);
});

module.exports = {
  importGitHubRepo,
  syncGitHubRepo
};
