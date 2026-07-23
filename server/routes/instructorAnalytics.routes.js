const express = require('express');
const router  = express.Router();

const {
  getAnalytics,
  generateAnalytics,
  getStatistics,
} = require('../controllers/instructorAnalytics.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.get('/',             protect, restrictTo('instructor', 'admin'), getAnalytics);
router.post('/generate',    protect, restrictTo('instructor'), generateAnalytics);
router.get('/statistics',   protect, restrictTo('instructor', 'admin'), getStatistics);

module.exports = router;
