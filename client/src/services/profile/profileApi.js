import apiClient from '../../api/axios.js';

export const fetchProfileDataAPI = async () => {
  const res = await apiClient.get('/profile');
  return res.data;
};
