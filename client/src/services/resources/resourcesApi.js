import apiClient from '../../api/axios.js';

export const fetchResourcesDataAPI = async () => {
  const res = await apiClient.get('/resources');
  return res.data;
};
