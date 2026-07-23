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
