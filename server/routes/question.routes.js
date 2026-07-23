const express = require('express');
const router  = express.Router();

const { getQuestionById, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/question.controller');
const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// ─── Question CRUD (direct question access) ───────────────────────────────────
router.get   ('/:id', protect, getQuestionById);
router.post  ('/',    protect, restrictTo('instructor', 'admin'), createQuestion);
router.put   ('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
