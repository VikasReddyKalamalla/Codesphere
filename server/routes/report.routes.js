const express = require('express');
const router  = express.Router();
const { createReport, getAllReports, updateReportStatus } = require('../controllers/report.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.post('/',     protect, createReport);
router.get ('/',     protect, restrictTo('admin'), getAllReports);
router.put ('/:id',  protect, restrictTo('admin'), updateReportStatus);

module.exports = router;
