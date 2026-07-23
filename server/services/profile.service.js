const User = require('../models/User');

const getProfile = async (userId) => User.findById(userId).select('-password').populate('learningPaths', 'title');

const updateProfile = async (userId, data) => {
  // Prevent updating sensitive fields
  const { password, role, email, ...safe } = data;
  return User.findByIdAndUpdate(userId, safe, { new: true }).select('-password');
};

const uploadAvatar = async (userId, file) => {
  if (!file) throw Object.assign(new Error('No file uploaded'), { statusCode: 400 });
  const avatarUrl = `/${file.path.replace(/\\/g, '/')}`;
  return User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select('-password');
};

module.exports = { getProfile, updateProfile, uploadAvatar };
