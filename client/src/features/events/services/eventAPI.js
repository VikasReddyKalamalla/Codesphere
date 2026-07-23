import apiClient from '@services/axios.js';

export const fetchEventsAPI = async (params = {}) => {
  const res = await apiClient.get('/events', { params });
  return res.data;
};

export const fetchGlobeMarkersAPI = async () => {
  const res = await apiClient.get('/events/globe/markers');
  return res.data;
};

export const fetchEventByIdAPI = async (id) => {
  const res = await apiClient.get(`/events/${id}`);
  return res.data;
};

export const fetchEventBySlugAPI = async (slug) => {
  const res = await apiClient.get(`/events/slug/${slug}`);
  return res.data;
};

export const createEventAPI = async (eventData) => {
  const res = await apiClient.post('/events', eventData);
  return res.data;
};

export const updateEventAPI = async (id, eventData) => {
  const res = await apiClient.put(`/events/${id}`, eventData);
  return res.data;
};

export const deleteEventAPI = async (id) => {
  const res = await apiClient.delete(`/events/${id}`);
  return res.data;
};

export const registerEventAPI = async (id) => {
  const res = await apiClient.post(`/events/${id}/register`);
  return res.data;
};

export const cancelRegistrationAPI = async (id) => {
  const res = await apiClient.delete(`/events/${id}/register`);
  return res.data;
};

export const bookmarkEventAPI = async (id) => {
  const res = await apiClient.post(`/events/${id}/bookmark`);
  return res.data;
};

export const removeBookmarkAPI = async (id) => {
  const res = await apiClient.delete(`/events/${id}/bookmark`);
  return res.data;
};

export const fetchUserBookmarksAPI = async () => {
  const res = await apiClient.get('/events/my/bookmarks');
  return res.data;
};

export const fetchUserRegistrationsAPI = async () => {
  const res = await apiClient.get('/events/my/registrations');
  return res.data;
};

export const fetchAnalyticsSummaryAPI = async () => {
  const res = await apiClient.get('/events/analytics/summary');
  return res.data;
};

export const fetchAiRecommendationsAPI = async (tags = []) => {
  const res = await apiClient.get('/events/ai/recommendations', {
    params: { tags: tags.join(',') }
  });
  return res.data;
};

export const toggleLikeEventAPI = async (id) => {
  const res = await apiClient.post(`/events/${id}/like`);
  return res.data;
};
