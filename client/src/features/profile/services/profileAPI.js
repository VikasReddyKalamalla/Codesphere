import apiClient from '@services/axios.js';

export const fetchProfileAPI = async () => {
  const res = await apiClient.get('/profile');
  return res.data;
};

export const updateProfileAPI = async (profileData) => {
  const res = await apiClient.put('/profile', profileData);
  return res.data;
};

export const uploadAvatarAPI = async (file) => {
  const form = new FormData();
  form.append('avatar', file);
  const res = await apiClient.post('/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const fetchPublicProfileAPI = async (username) => {
  const res = await apiClient.get(`/profile/public/${username}`);
  return res.data;
};

export const uploadCertificateAPI = async (data, file) => {
  const form = new FormData();
  form.append('certificate', file);
  if (data.title) form.append('title', data.title);
  if (data.issuer) form.append('issuer', data.issuer);
  
  const res = await apiClient.post('/profile/certificates', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
