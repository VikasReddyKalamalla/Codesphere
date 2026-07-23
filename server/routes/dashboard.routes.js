const express = require('express');
const router  = express.Router();
const {
  getFullDashboard,
  getStats,
  getContinueLearning,
  getUpcomingSessions,
  getRegisteredEvents,
  getSavedResources,
  getNotifications,
  getAchievements,
} = require('../controllers/dashboard.controller');

const { protect } = require('../middlewares/auth.middleware');

// All dashboard routes are protected — user must be logged in
router.use(protect);

router.get('/',                  getFullDashboard);
router.get('/stats',             getStats);
router.get('/continue-learning', getContinueLearning);
router.get('/upcoming-sessions', getUpcomingSessions);
router.get('/events',            getRegisteredEvents);
router.get('/resources',         getSavedResources);
router.get('/notifications',     getNotifications);
router.get('/achievements',      getAchievements);

module.exports = router;
