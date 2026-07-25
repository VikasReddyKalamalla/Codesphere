const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const webIDEService = require('../services/webIDE.service');
const logger = require('../utils/logger');

/**
 * Create workspace
 */
const createWorkspace = asyncHandler(async (req, res) => {
  const { projectName } = req.body;
  const userId = req.user._id;

  if (!projectName) {
    return errorResponse(res, 400, 'Project name required');
  }

  const workspace = await webIDEService.createWorkspace(userId, projectName);
  return successResponse(res, 201, 'Workspace created', workspace);
});

/**
 * Get workspace structure
 */
const getWorkspaceStructure = asyncHandler(async (req, res) => {
  const { projectName } = req.params;
  const userId = req.user._id;

  const structure = await webIDEService.getWorkspaceStructure(userId, projectName);
  return successResponse(res, 200, 'Workspace structure retrieved', structure);
});

/**
 * Read file
 */
const readFile = asyncHandler(async (req, res) => {
  const { filePath } = req.query;
  const userId = req.user._id;

  if (!filePath) {
    return errorResponse(res, 400, 'File path required');
  }

  const file = await webIDEService.readFile(userId, filePath);
  return successResponse(res, 200, 'File read', file);
});

/**
 * Write file
 */
const writeFile = asyncHandler(async (req, res) => {
  const { filePath, content } = req.body;
  const userId = req.user._id;

  if (!filePath || content === undefined) {
    return errorResponse(res, 400, 'File path and content required');
  }

  const result = await webIDEService.writeFile(userId, filePath, content);
  logger.info(`File saved: ${filePath}`);
  return successResponse(res, 200, 'File saved', result);
});

/**
 * Delete file or directory
 */
const deleteFileOrDir = asyncHandler(async (req, res) => {
  const { filePath } = req.body;
  const userId = req.user._id;

  if (!filePath) {
    return errorResponse(res, 400, 'File path required');
  }

  const result = await webIDEService.deleteFileOrDir(userId, filePath);
  logger.info(`Deleted: ${filePath}`);
  return successResponse(res, 200, 'Deleted', result);
});

/**
 * Create file
 */
const createFile = asyncHandler(async (req, res) => {
  const { filePath, content = '' } = req.body;
  const userId = req.user._id;

  if (!filePath) {
    return errorResponse(res, 400, 'File path required');
  }

  const result = await webIDEService.createFile(userId, filePath, content);
  return successResponse(res, 201, 'File created', result);
});

/**
 * Create directory
 */
const createDirectory = asyncHandler(async (req, res) => {
  const { dirPath } = req.body;
  const userId = req.user._id;

  if (!dirPath) {
    return errorResponse(res, 400, 'Directory path required');
  }

  const result = await webIDEService.createDirectory(userId, dirPath);
  return successResponse(res, 201, 'Directory created', result);
});

/**
 * Search files
 */
const searchFiles = asyncHandler(async (req, res) => {
  const { projectName } = req.params;
  const { query, searchContent = false } = req.query;
  const userId = req.user._id;

  if (!query) {
    return errorResponse(res, 400, 'Search query required');
  }

  const results = await webIDEService.searchFiles(userId, projectName, query, searchContent === 'true');
  return successResponse(res, 200, 'Search results', results);
});

/**
 * Export workspace
 */
const exportWorkspace = asyncHandler(async (req, res) => {
  const { projectName } = req.params;
  const userId = req.user._id;

  const result = await webIDEService.exportWorkspace(userId, projectName);
  return successResponse(res, 200, 'Export initiated', result);
});

module.exports = {
  createWorkspace,
  getWorkspaceStructure,
  readFile,
  writeFile,
  deleteFileOrDir,
  createFile,
  createDirectory,
  searchFiles,
  exportWorkspace,
};
