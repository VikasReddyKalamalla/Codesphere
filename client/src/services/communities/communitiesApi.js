import apiClient from '../../api/axios.js';

export const fetchCommunitiesDataAPI = async () => {
  const res = await apiClient.get('/communities');
  return res.data;
};
