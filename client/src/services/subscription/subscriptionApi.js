import apiClient from '../../api/axios.js';

export const fetchSubscriptionDataAPI = async () => {
  const res = await apiClient.get('/subscription');
  return res.data;
};
