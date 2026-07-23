import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchPlansAPI = async () => {
  const response = await API.get('/subscriptions/plans');
  return response.data;
};

export const fetchCurrentSubscriptionAPI = async () => {
  const response = await API.get('/subscriptions/current');
  return response.data;
};

export const createSubscriptionAPI = async (payload) => {
  const response = await API.post('/subscriptions', payload);
  return response.data;
};

export const pauseSubscriptionAPI = async () => {
  const response = await API.put('/subscriptions/pause');
  return response.data;
};

export const resumeSubscriptionAPI = async () => {
  const response = await API.put('/subscriptions/resume');
  return response.data;
};

export const cancelSubscriptionAPI = async (reason) => {
  const response = await API.delete('/subscriptions/cancel', { data: { reason } });
  return response.data;
};

export const fetchMyInvoicesAPI = async () => {
  const response = await API.get('/subscriptions/invoices');
  return response.data;
};

export const validateCouponAPI = async (payload) => {
  const response = await API.post('/coupons/validate', payload);
  return response.data;
};

export const fetchActiveCouponsAPI = async () => {
  const response = await API.get('/coupons/active');
  return response.data;
};

export const fetchMyReferralsAPI = async () => {
  const response = await API.get('/referrals/my-referrals');
  return response.data;
};

export const fetchUsageMetricsAPI = async () => {
  const response = await API.get('/usage/metrics');
  return response.data;
};

export const fetchMyOrganizationAPI = async () => {
  const response = await API.get('/organizations/my-org');
  return response.data;
};

export const inviteTeamMemberAPI = async (payload) => {
  const response = await API.post('/organizations/invite', payload);
  return response.data;
};

export const verifyUniversityAPI = async (payload) => {
  const response = await API.post('/organizations/university/verify', payload);
  return response.data;
};
