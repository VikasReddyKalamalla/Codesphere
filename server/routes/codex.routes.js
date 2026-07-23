const express = require('express');
const router  = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/codex.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.get('/',       getAllProjects);
router.get('/:id',    getProjectById);
router.post('/',      protect, restrictTo('admin', 'instructor'), createProject);
router.put('/:id',    protect, restrictTo('admin', 'instructor'), updateProject);
router.delete('/:id', protect, restrictTo('admin'), deleteProject);

module.exports = router;
