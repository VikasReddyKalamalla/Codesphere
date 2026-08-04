const express = require('express');
const router  = express.Router();
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleLike,
  rateResource,
  getFeaturedResources,
  getTrendingResources,
  getRecommendedResources,
  addComment,
  trackDownload: trackResourceDownload,
  getAnalyticsSummary,
} = require('../controllers/resource.controller');
const {
  addBookmark,
  removeBookmark,
  isBookmarked,
} = require('../controllers/bookmark.controller');
const {
  trackDownload,
  getDownloadHistory,
} = require('../controllers/download.controller');

const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { restrictTo }     = require('../middlewares/role.middleware');
const { uploadResource } = require('../middlewares/upload.middleware');

// ─── Special & Public Routes ──────────────────────────────────────────────────
router.get('/',            optionalAuth, getAllResources);
router.get('/featured',    optionalAuth, getFeaturedResources);
router.get('/trending',    optionalAuth, getTrendingResources);
router.get('/recommended', optionalAuth, getRecommendedResources);
router.get('/analytics',   protect, getAnalyticsSummary);
router.get('/:id',         optionalAuth, getResourceById);
router.post('/:id/comments', protect, addComment);

// ─── Create / Update / Delete ─────────────────────────────────────────────────
router.post  ('/', protect, restrictTo('instructor', 'admin'), uploadResource.single('file'), createResource);
router.put   ('/:id', protect, restrictTo('instructor', 'admin'), updateResource);
router.delete('/:id', protect, restrictTo('instructor', 'admin', 'admin'), deleteResource);

// ─── Interactions ─────────────────────────────────────────────────────────────
router.post('/:id/like', protect, toggleLike);
router.post('/:id/rate', protect, rateResource);

// ─── Bookmarks ────────────────────────────────────────────────────────────────
router.post  ('/:id/bookmark',       protect, addBookmark);
router.delete('/:id/bookmark',       protect, removeBookmark);
router.get   ('/:id/bookmark/check', protect, isBookmarked);

// ─── Downloads ────────────────────────────────────────────────────────────────
router.post('/:id/download',         protect, trackDownload);
router.get ('/:id/download-history', protect, restrictTo('instructor', 'admin'), getDownloadHistory);

module.exports = router;
