import apiClient from '@services/axios.js';

export const fetchAdminStatsAPI = async () => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.data;
};

export const fetchInstructorApplicationsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/instructors/requests', { params });
  return res.data.data;
};

export const approveInstructorApplicationAPI = async (id, adminRemarks = '') => {
  const res = await apiClient.put(`/admin/instructors/${id}/approve`, { adminRemarks });
  return res.data.data;
};

export const rejectInstructorApplicationAPI = async (id, adminRemarks = '') => {
  const res = await apiClient.put(`/admin/instructors/${id}/reject`, { adminRemarks });
  return res.data.data;
};

export const fetchAllInstructorsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/instructors', { params });
  return res.data.data;
};
