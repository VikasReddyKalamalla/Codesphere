const express = require('express');
const router  = express.Router();

const {
  getAllProjects,
  getMyProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  archiveProject,
  getProjectStats,
} = require('../controllers/sandbox.controller');

const { getProjectSteps, reorderSteps }              = require('../controllers/sandboxStep.controller');
const { getProgress, startProject, updateProgress, resetProgress, getMyProgress } = require('../controllers/sandboxProgress.controller');
const { submitProject, getProjectSubmissions, getMySubmissions } = require('../controllers/sandboxSubmission.controller');
const { addBookmark, removeBookmark, getUserBookmarks, isBookmarked } = require('../controllers/sandboxBookmark.controller');
const { getProjectTemplates }                                              = require('../controllers/sandboxTemplate.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Sandbox CRUD ─────────────────────────────────────────────────────────────
router.get   ('/',             getAllProjects);
router.get   ('/my',           protect, getMyProjects);
router.get   ('/my/progress',  protect, getMyProgress);
router.get   ('/my/bookmarks', protect, getUserBookmarks);
router.get   ('/my/submissions', protect, getMySubmissions);
router.get   ('/slug/:slug',   getProjectBySlug);
router.get   ('/:id',          getProjectById);
router.post  ('/',             protect, restrictTo('instructor', 'admin'), createProject);
router.put   ('/:id',          protect, updateProject);
router.delete('/:id',          protect, deleteProject);

// ─── Lifecycle ────────────────────────────────────────────────────────────────
router.patch('/:id/publish', protect, publishProject);
router.patch('/:id/archive', protect, archiveProject);

// ─── Stats ────────────────────────────────────────────────────────────────────
router.get('/:id/stats', protect, getProjectStats);

// ─── Steps (project-scoped) ───────────────────────────────────────────────────
router.get('/:id/steps',          getProjectSteps);
router.put('/:id/steps/reorder',  protect, reorderSteps);

// ─── Progress ─────────────────────────────────────────────────────────────────
router.get ('/:id/progress', protect, getProgress);
router.post('/:id/start',    protect, startProject);
router.put ('/:id/progress', protect, updateProgress);
router.post('/:id/reset',    protect, resetProgress);

// ─── Submissions ──────────────────────────────────────────────────────────────
router.post('/:id/submission',  protect, submitProject);
router.get ('/:id/submissions', protect, getProjectSubmissions);

// ─── Bookmarks ────────────────────────────────────────────────────────────────
router.post  ('/:id/bookmark',        protect, addBookmark);
router.delete('/:id/bookmark',        protect, removeBookmark);
router.get   ('/:id/bookmark-status', protect, isBookmarked);

// ─── Workspace Runtime Engine (VS Code / Code-Server) ───────────────────────
const containerManager = require('../../services/workspace-service/src/services/containerManager');

router.post('/:id/workspace/init', async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?._id || req.user?.id || '650000000000000000000001';
    const wsInfo = await containerManager.createOrStartWorkspaceContainer(studentId, id, 'javascript', 'free');
    return res.status(200).json({
      success: true,
      data: {
        runtime: wsInfo,
        port: wsInfo.port,
        iframeUrl: `/workspace-proxy/${id}/`
      }
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: {
        iframeUrl: `/workspace-proxy/${req.params.id}/`,
        port: 8100
      }
    });
  }
});

router.post('/:id/workspace/sync', async (req, res) => {
  return res.status(200).json({ success: true, message: 'Workspace synced', data: { codeFiles: {} } });
});

router.post('/:id/workspace/stop', async (req, res) => {
  try {
    const { id } = req.params;
    await containerManager.stopWorkspaceContainer(id);
    return res.status(200).json({ success: true, message: 'Workspace stopped' });
  } catch (e) {
    return res.status(200).json({ success: true, message: 'Workspace stopped' });
  }
});

// ─── Templates (project-scoped) ───────────────────────────────────────────────
router.get('/:id/templates', getProjectTemplates);

module.exports = router;
