import apiClient from '@services/axios.js';

export const fetchTestsAPI = async (params) => {
  const res = await apiClient.get('/tests', { params });
  return res.data;
};

export const fetchTestDetailsAPI = async (id) => {
  const res = await apiClient.get(`/tests/${id}`);
  return res.data;
};

export const fetchLeaderboardAPI = async () => {
  const res = await apiClient.get('/tests/global-leaderboard');
  return res.data;
};

export const fetchContestsAPI = async () => {
  const res = await apiClient.get('/tests/contests');
  return res.data;
};

export const submitTestAttemptAPI = async (id, attemptData) => {
  const res = await apiClient.post(`/tests/${id}/submit`, attemptData);
  return res.data;
};

export const createTestAPI = async (payload) => {
  const res = await apiClient.post('/tests', payload);
  return res.data;
};

export const deleteTestAPI = async (id) => {
  const res = await apiClient.delete(`/tests/${id}`);
  return res.data;
};
