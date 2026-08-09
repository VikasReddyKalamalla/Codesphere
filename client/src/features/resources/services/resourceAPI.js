import apiClient from '@services/axios.js';

export const fetchResourcesAPI = async (params) => {
  const res = await apiClient.get('/resources', { params });
  return res.data;
};

export const fetchResourceByIdAPI = async (id) => {
  const res = await apiClient.get(`/resources/${id}`);
  return res.data;
};

export const fetchFeaturedResourcesAPI = async () => {
  const res = await apiClient.get('/resources/featured');
  return res.data;
};

export const fetchTrendingResourcesAPI = async () => {
  const res = await apiClient.get('/resources/trending');
  return res.data;
};

export const fetchRecommendedResourcesAPI = async () => {
  const res = await apiClient.get('/resources/recommended');
  return res.data;
};

export const createResourceAPI = async (payload) => {
  const isFormData = payload instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await apiClient.post('/resources', payload, config);
  return res.data;
};

export const updateResourceAPI = async (id, payload) => {
  const res = await apiClient.put(`/resources/${id}`, payload);
  return res.data;
};

export const deleteResourceAPI = async (id) => {
  const res = await apiClient.delete(`/resources/${id}`);
  return res.data;
};

export const toggleLikeAPI = async (id) => {
  const res = await apiClient.post(`/resources/${id}/like`);
  return res.data;
};

export const rateResourceAPI = async (id, value) => {
  const res = await apiClient.post(`/resources/${id}/rate`, { value });
  return res.data;
};

export const addCommentAPI = async (id, text) => {
  const res = await apiClient.post(`/resources/${id}/comments`, { text });
  return res.data;
};

export const trackDownloadAPI = async (id) => {
  const res = await apiClient.post(`/resources/${id}/download`);
  return res.data;
};

export const fetchAnalyticsAPI = async () => {
  const res = await apiClient.get('/resources/analytics');
  return res.data;
};
