export const selectCommunities = (state) => state.communities;
export const selectCommunityItems = (state) => state.communities?.items;
export const selectActiveCommunity = (state) => state.communities?.activeCommunity;
export const selectCommunityPosts = (state) => state.communities?.posts || [];
export const selectPostComments = (postId) => (state) => state.communities?.comments[postId] || [];
export const selectChatMessages = (state) => state.communities?.chatMessages || [];
