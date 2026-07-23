import apiClient from '@services/axios.js';
export const fetchAdminStatsAPI = async () => {
  const res = await apiClient.get('/admin/summary');
  return res.data;
};
