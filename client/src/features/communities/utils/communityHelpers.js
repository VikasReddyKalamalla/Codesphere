/**
 * Safely extracts string ID from a user object or string ID
 */
export const getUserId = (user) => {
  if (!user) {
    try {
      const u = localStorage.getItem('codesphere_user');
      if (u) {
        const parsed = JSON.parse(u);
        return (parsed._id || parsed.id || parsed.user?._id || parsed.user?.id || '').toString() || null;
      }
    } catch (e) {}
    return null;
  }
  if (typeof user === 'string') return user;
  if (typeof user === 'object') {
    return (user._id || user.id || user.user?._id || user.user?.id || '').toString() || null;
  }
  return null;
};

/**
 * Checks if a given user is a member of a community object
 */
export const isCommunityMember = (community, user) => {
  if (!community) return false;
  if (community._isJoinedLocally === true) return true;
  if (community._isJoinedLocally === false) return false;

  const userId = getUserId(user);
  let fallbackUserId = null;
  try {
    const u = localStorage.getItem('codesphere_user');
    if (u) {
      const parsed = JSON.parse(u);
      fallbackUserId = (parsed._id || parsed.id || parsed.user?._id || '').toString();
    }
  } catch (e) {}

  if (!community.members || (!userId && !fallbackUserId)) return false;

  return community.members.some((member) => {
    const memberId = getUserId(member);
    if (!memberId) return false;
    return (userId && memberId === userId) || (fallbackUserId && memberId === fallbackUserId);
  });
};
