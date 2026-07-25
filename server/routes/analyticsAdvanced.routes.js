const express = require('express');
const router = express.Router();

const {
  getDashboardMetrics,
  getCohortAnalysis,
  getRevenueTrends,
  getTopCourses,
  getUserEngagement,
  generateReport,
} = require('../controllers/analyticsAdvanced.controller');

const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// All routes require admin or instructor role
router.use(protect);
router.use(restrictTo('admin', 'instructor'));

// Analytics endpoints
router.get('/dashboard', getDashboardMetrics);
router.get('/cohorts', getCohortAnalysis);
router.get('/revenue', getRevenueTrends);
router.get('/top-courses', getTopCourses);
router.get('/engagement', getUserEngagement);
router.post('/report', generateReport);

module.exports = router;
