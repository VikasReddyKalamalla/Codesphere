import apiClient from '../../api/axios.js';

export const fetchLearningDataAPI = async () => {
  const res = await apiClient.get('/learning');
  return res.data;
};
