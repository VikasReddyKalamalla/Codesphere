import apiClient from '@services/axios.js';

// ─── Communities API ──────────────────────────────────────────────────────────
export const fetchCommunitiesAPI = async (params = {}) => {
  const res = await apiClient.get('/community', { params });
  return res.data;
};

export const fetchCommunityDetailsAPI = async (id) => {
  const res = await apiClient.get(`/community/${id}`);
  return res.data;
};

export const createCommunityAPI = async (payload) => {
  const res = await apiClient.post('/community', payload);
  return res.data;
};

export const updateCommunityAPI = async (id, payload) => {
  const res = await apiClient.put(`/community/${id}`, payload);
  return res.data;
};

export const deleteCommunityAPI = async (id) => {
  const res = await apiClient.delete(`/community/${id}`);
  return res.data;
};

export const joinCommunityAPI = async (id) => {
  const res = await apiClient.post(`/community/${id}/join`);
  return res.data;
};

export const leaveCommunityAPI = async (id) => {
  const res = await apiClient.delete(`/community/${id}/leave`);
  return res.data;
};

export const fetchCommunityMembersAPI = async (id, params = {}) => {
  const res = await apiClient.get(`/community/${id}/members`, { params });
  return res.data;
};

export const promoteModeratorAPI = async (communityId, userId) => {
  const res = await apiClient.post(`/community/${communityId}/moderators/${userId}`);
  return res.data;
};

export const removeModeratorAPI = async (communityId, userId) => {
  const res = await apiClient.delete(`/community/${communityId}/moderators/${userId}`);
  return res.data;
};

// ─── Channels API ─────────────────────────────────────────────────────────────
export const fetchCommunityChannelsAPI = async (communityId) => {
  const res = await apiClient.get(`/community/${communityId}/channels`);
  return res.data;
};

export const createChannelAPI = async (communityId, payload) => {
  const res = await apiClient.post(`/community/${communityId}/channels`, payload);
  return res.data;
};

export const updateChannelAPI = async (channelId, payload) => {
  const res = await apiClient.put(`/community/channels/${channelId}`, payload);
  return res.data;
};

export const deleteChannelAPI = async (channelId) => {
  const res = await apiClient.delete(`/community/channels/${channelId}`);
  return res.data;
};

export const fetchChannelMessagesAPI = async (channelId, params = {}) => {
  const res = await apiClient.get(`/community/channels/${channelId}/messages`, { params });
  return res.data;
};

// ─── Direct WhatsApp Messaging API ────────────────────────────────────────────
export const fetchDirectChatsAPI = async () => {
  const res = await apiClient.get('/community/direct/chats');
  return res.data;
};

export const openDirectChatAPI = async (targetUserId) => {
  const res = await apiClient.post('/community/direct/chats', { targetUserId });
  return res.data;
};

export const createGroupChatAPI = async (payload) => {
  const res = await apiClient.post('/community/direct/groups', payload);
  return res.data;
};

export const fetchDirectChatMessagesAPI = async (chatId, params = {}) => {
  const res = await apiClient.get(`/community/direct/chats/${chatId}/messages`, { params });
  return res.data;
};

// ─── Search & Starred & Invites ───────────────────────────────────────────────
export const searchCommunityMessagesAPI = async (communityId, query) => {
  const res = await apiClient.get(`/community/${communityId}/search`, { params: { q: query } });
  return res.data;
};

export const fetchStarredMessagesAPI = async () => {
  const res = await apiClient.get('/community/messages/starred');
  return res.data;
};

export const generateInviteCodeAPI = async (communityId) => {
  const res = await apiClient.post(`/community/${communityId}/invite-code`);
  return res.data;
};

export const joinByInviteCodeAPI = async (code) => {
  const res = await apiClient.post(`/community/join-by-code/${code}`);
  return res.data;
};

// ─── Posts API ────────────────────────────────────────────────────────────────
export const fetchPostsAPI = async (communityId, params = {}) => {
  const res = await apiClient.get(`/posts/${communityId}`, { params });
  return res.data;
};

export const fetchPostByIdAPI = async (id) => {
  const res = await apiClient.get(`/posts/single/${id}`);
  return res.data;
};

export const createPostAPI = async (payload) => {
  const res = await apiClient.post('/posts', payload);
  return res.data;
};

export const updatePostAPI = async (id, payload) => {
  const res = await apiClient.put(`/posts/${id}`, payload);
  return res.data;
};

export const deletePostAPI = async (id) => {
  const res = await apiClient.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLikePostAPI = async (postId) => {
  const res = await apiClient.post(`/posts/${postId}/like`);
  return res.data;
};

export const toggleBookmarkPostAPI = async (postId) => {
  const res = await apiClient.post(`/posts/${postId}/bookmark`);
  return res.data;
};

export const togglePinPostAPI = async (postId) => {
  const res = await apiClient.post(`/posts/${postId}/pin`);
  return res.data;
};

// ─── Comments API ─────────────────────────────────────────────────────────────
export const fetchCommentsAPI = async (postId, params = {}) => {
  const res = await apiClient.get(`/post-comments/${postId}`, { params });
  return res.data;
};

export const addCommentAPI = async (payload) => {
  const res = await apiClient.post('/post-comments', payload);
  return res.data;
};

export const updateCommentAPI = async (id, payload) => {
  const res = await apiClient.put(`/post-comments/${id}`, payload);
  return res.data;
};

export const deleteCommentAPI = async (id) => {
  const res = await apiClient.delete(`/post-comments/${id}`);
  return res.data;
};

export const toggleLikeCommentAPI = async (commentId) => {
  const res = await apiClient.post(`/post-comments/${commentId}/like`);
  return res.data;
};
