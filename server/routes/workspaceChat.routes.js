const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getChats,
  togglePinChat,
  searchChats
} = require('../controllers/workspaceChat.controller');

const { protect } = require('../middlewares/auth.middleware');

router.get   ('/',            protect, getChats);
router.get   ('/search',      protect, searchChats);
router.put   ('/:chatId/pin', protect, togglePinChat);

module.exports = router;
