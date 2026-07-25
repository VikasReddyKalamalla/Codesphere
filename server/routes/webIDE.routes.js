const express = require('express');
const router = express.Router();

const {
  createWorkspace,
  getWorkspaceStructure,
  readFile,
  writeFile,
  deleteFileOrDir,
  createFile,
  createDirectory,
  searchFiles,
  exportWorkspace,
} = require('../controllers/webIDE.controller');

const { protect } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(protect);

// Workspace management
router.post('/workspace', createWorkspace);
router.get('/workspace/:projectName/structure', getWorkspaceStructure);
router.get('/workspace/:projectName/export', exportWorkspace);

// File operations
router.get('/file', readFile);
router.post('/file', writeFile);
router.delete('/file', deleteFileOrDir);
router.post('/file/create', createFile);

// Directory operations
router.post('/directory', createDirectory);

// Search
router.get('/search/:projectName', searchFiles);

module.exports = router;
