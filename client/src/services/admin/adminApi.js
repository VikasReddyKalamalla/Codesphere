import apiClient from '../../api/axios.js';

export const fetchAdminDataAPI = async () => {
  const res = await apiClient.get('/admin');
  return res.data;
};
