const User = require('../models/User');
const Certificate = require('../models/Certificate');
const { getUserContributions } = require('./activity.service');

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('learningPaths', 'title');
  if (!user) return null;

  const contributionsData = await getUserContributions(user._id);

  return {
    ...user.toObject(),
    dayStreak: user.dayStreak || 0,
    totalContributions: user.totalContributions || 0,
    contributions: contributionsData.weeks,
    rawContributionsMap: contributionsData.rawCountMap,
  };
};

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

const getPublicProfile = async (username) => {
  const user = await User.findOne({ username })
    .select('-password -email -phone -twoFactorSecret -passwordResetToken -passwordResetExpires -emailVerificationToken')
    .populate('learningPaths', 'title');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const certificates = await Certificate.find({ userId: user._id }).populate('course', 'title');
  const contributionsData = await getUserContributions(user._id);

  return {
    ...user.toObject(),
    dayStreak: user.dayStreak || 0,
    totalContributions: user.totalContributions || 0,
    contributions: contributionsData.weeks,
    rawContributionsMap: contributionsData.rawCountMap,
    certificates,
  };
};

const uploadCertificate = async (userId, data, file) => {
  if (!file) throw Object.assign(new Error('No certificate file uploaded'), { statusCode: 400 });

  const certificateUrl = `/${file.path.replace(/\\/g, '/')}`;

  const cert = await Certificate.create({
    userId,
    title: data.title || 'Custom Certificate',
    issuer: data.issuer || 'Unknown',
    certificateUrl,
  });

  return cert;
};

module.exports = { getProfile, updateProfile, uploadAvatar, getPublicProfile, uploadCertificate };
