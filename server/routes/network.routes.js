const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
  searchUsers,
  sendFriendRequest,
  respondToFriendRequest,
  getFriendsList
} = require('../controllers/network.controller');

const router = express.Router();

router.use(protect); // all network routes are protected

router.get('/search', searchUsers);
router.post('/request', sendFriendRequest);
router.put('/request/:id', respondToFriendRequest);
router.get('/friends', getFriendsList);

module.exports = router;
