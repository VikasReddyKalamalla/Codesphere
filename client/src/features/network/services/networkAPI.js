import apiClient from '@services/axios';

export const searchUsersAPI = async (query) => {
  return (await apiClient.get(`/network/search?q=${query}`)).data;
};

export const sendFriendRequestAPI = async (targetUserId) => {
  return (await apiClient.post('/network/request', { targetUserId })).data;
};

export const respondToFriendRequestAPI = async (requestId, action) => {
  return (await apiClient.put(`/network/request/${requestId}`, { action })).data;
};

export const getFriendsListAPI = async () => {
  return (await apiClient.get('/network/friends')).data;
};
