const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

// @desc    Search for users globally (by username or email or fullName)
// @route   GET /api/network/search?q=query
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.status(200).json({ success: true, data: [] });
  }

  const regex = new RegExp(q, 'i');
  
  const users = await User.find({
    $or: [
      { username: regex },
      { email: regex },
      { fullName: regex }
    ],
    _id: { $ne: req.user._id } // exclude self
  })
  .select('username fullName email avatar role friends')
  .limit(20);

  res.status(200).json({ success: true, data: users });
});

// @desc    Send a friend request
// @route   POST /api/network/request
// @access  Private
const sendFriendRequest = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  if (!targetUserId) return res.status(400).json({ success: false, message: 'Target user ID is required' });
  if (targetUserId === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot send request to yourself' });

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

  // Check if already friends
  if (req.user.friends && req.user.friends.includes(targetUserId)) {
    return res.status(400).json({ success: false, message: 'Already friends with this user' });
  }

  // Check existing pending request
  const existingReq = await FriendRequest.findOne({
    $or: [
      { sender: req.user._id, receiver: targetUserId },
      { sender: targetUserId, receiver: req.user._id }
    ],
    status: 'pending'
  });

  if (existingReq) {
    if (existingReq.sender.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Friend request already sent' });
    } else {
      return res.status(400).json({ success: false, message: 'This user already sent you a friend request. Please check your pending requests.' });
    }
  }

  const friendReq = await FriendRequest.create({
    sender: req.user._id,
    receiver: targetUserId,
    status: 'pending'
  });

  // Socket event will be handled separately if we want to emit from here,
  // or we can emit via the socket instance attached to app.
  if (req.app.get('io')) {
    const io = req.app.get('io');
    io.to(`user:${targetUserId}`).emit('friend_request_received', {
      requestId: friendReq._id,
      sender: {
        _id: req.user._id,
        username: req.user.username,
        fullName: req.user.fullName,
        avatar: req.user.avatar
      }
    });
  }

  res.status(201).json({ success: true, data: friendReq, message: 'Friend request sent' });
});

// @desc    Respond to friend request (accept/reject)
// @route   PUT /api/network/request/:id
// @access  Private
const respondToFriendRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' or 'reject'

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action. Must be accept or reject' });
  }

  const friendReq = await FriendRequest.findById(id);
  if (!friendReq) return res.status(404).json({ success: false, message: 'Friend request not found' });

  // Ensure current user is the receiver
  if (friendReq.receiver.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (friendReq.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Request already processed' });
  }

  friendReq.status = action === 'accept' ? 'accepted' : 'rejected';
  await friendReq.save();

  if (action === 'accept') {
    // Add to both users' friends array
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { friends: friendReq.sender } });
    await User.findByIdAndUpdate(friendReq.sender, { $addToSet: { friends: req.user._id } });

    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.to(`user:${friendReq.sender}`).emit('friend_request_accepted', {
        friend: {
          _id: req.user._id,
          username: req.user.username,
          fullName: req.user.fullName,
          avatar: req.user.avatar
        }
      });
    }
  }

  res.status(200).json({ success: true, message: `Request ${action}ed` });
});

// @desc    Get friends and pending requests
// @route   GET /api/network/friends
// @access  Private
const getFriendsList = asyncHandler(async (req, res) => {
  // Populate friends
  const user = await User.findById(req.user._id)
    .populate('friends', 'username fullName email avatar role isInstructor');

  // Get pending requests (both sent and received)
  const pendingSent = await FriendRequest.find({ sender: req.user._id, status: 'pending' })
    .populate('receiver', 'username fullName email avatar');
  
  const pendingReceived = await FriendRequest.find({ receiver: req.user._id, status: 'pending' })
    .populate('sender', 'username fullName email avatar');

  res.status(200).json({
    success: true,
    data: {
      friends: user.friends || [],
      pendingSent,
      pendingReceived
    }
  });
});

module.exports = {
  searchUsers,
  sendFriendRequest,
  respondToFriendRequest,
  getFriendsList
};
