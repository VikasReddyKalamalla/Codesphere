import apiClient from '../../api/axios.js';

export const fetchDashboardDataAPI = async () => {
  const res = await apiClient.get('/dashboard');
  return res.data;
};
