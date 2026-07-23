import apiClient from '../../api/axios.js';

export const fetchTestsDataAPI = async () => {
  const res = await apiClient.get('/tests');
  return res.data;
};
