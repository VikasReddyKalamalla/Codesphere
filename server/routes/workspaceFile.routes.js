const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable workspace ID matching

const {
  getWorkspaceFiles,
  createFileOrFolder,
  updateFileOrFolder,
  deleteFileOrFolder,
  duplicateFile,
  uploadFile,
  downloadFile
} = require('../controllers/workspaceFile.controller');

const { protect } = require('../middlewares/auth.middleware');

router.get   ('/',                 protect, getWorkspaceFiles);
router.post  ('/',                 protect, createFileOrFolder);
router.put   ('/:fileId',          protect, updateFileOrFolder);
router.delete('/:fileId',          protect, deleteFileOrFolder);
router.post  ('/:fileId/duplicate', protect, duplicateFile);
router.post  ('/upload',           protect, uploadFile);
router.get   ('/:fileId/download', protect, downloadFile);

module.exports = router;
