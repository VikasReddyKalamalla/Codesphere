import apiClient from '@services/axios.js';

export const fetchMyProjectsAPI = async () => {
  const res = await apiClient.get('/sandbox/my');
  return res.data;
};

export const createProjectAPI = async (payload) => {
  const res = await apiClient.post('/sandbox', payload);
  return res.data;
};

export const updateProjectAPI = async (id, payload) => {
  const res = await apiClient.put(`/sandbox/${id}`, payload);
  return res.data;
};

export const deleteProjectAPI = async (id) => {
  const res = await apiClient.delete(`/sandbox/${id}`);
  return res.data;
};

export const publishProjectAPI = async (id) => {
  const res = await apiClient.patch(`/sandbox/${id}/publish`);
  return res.data;
};

export const archiveProjectAPI = async (id) => {
  const res = await apiClient.patch(`/sandbox/${id}/archive`);
  return res.data;
};

export const fetchProjectStepsAPI = async (projectId) => {
  const res = await apiClient.get(`/sandbox/${projectId}/steps`);
  return res.data;
};

export const createStepAPI = async (payload) => {
  const res = await apiClient.post('/steps', payload);
  return res.data;
};

export const updateStepAPI = async (id, payload) => {
  const res = await apiClient.put(`/steps/${id}`, payload);
  return res.data;
};

export const deleteStepAPI = async (id) => {
  const res = await apiClient.delete(`/steps/${id}`);
  return res.data;
};
