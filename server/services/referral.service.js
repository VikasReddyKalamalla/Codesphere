const Referral = require('../models/Referral');
const User = require('../models/User');

const getMyReferrals = async (userId) => {
  let referral = await Referral.findOne({ referrerUserId: userId, referredUserId: null });
  if (!referral) {
    const code = 'CS-' + userId.toString().slice(-6).toUpperCase();
    referral = await Referral.create({
      referrerUserId: userId,
      referralCode: code,
      status: 'pending',
    });
  }

  const referralsList = await Referral.find({ referrerUserId: userId, referredUserId: { $ne: null } })
    .populate('referredUserId', 'fullName email avatar createdAt')
    .sort({ createdAt: -1 });

  const totalEarned = referralsList.reduce((acc, curr) => (curr.status === 'rewarded' ? acc + curr.rewardAmount : acc), 0);
  const pendingCount = referralsList.filter(r => r.status === 'pending' || r.status === 'completed').length;

  const leaderboard = [
    { rank: 1, name: 'Siddharth V.', count: 48, earned: 12000, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
    { rank: 2, name: 'Ananya Roy', count: 35, earned: 8750, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { rank: 3, name: 'Vikram Mehta', count: 29, earned: 7250, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { rank: 4, name: 'Priya Sharma', count: 22, earned: 5500, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  ];

  return {
    referralCode: referral.referralCode,
    referralLink: `https://codesphere.dev/register?ref=${referral.referralCode}`,
    totalReferrals: referralsList.length,
    pendingReferrals: pendingCount,
    totalEarned,
    history: referralsList,
    leaderboard,
  };
};

module.exports = {
  getMyReferrals,
};
