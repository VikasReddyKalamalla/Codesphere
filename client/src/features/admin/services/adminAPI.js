import apiClient from '@services/axios.js';

export const fetchAdminStatsAPI = async () => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.data;
};

export const fetchInstructorApplicationsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/instructors/requests', { params });
  return res.data.data;
};

export const approveInstructorApplicationAPI = async (id, adminRemarks = '') => {
  const res = await apiClient.put(`/admin/instructors/${id}/approve`, { adminRemarks });
  return res.data.data;
};

export const rejectInstructorApplicationAPI = async (id, adminRemarks = '') => {
  const res = await apiClient.put(`/admin/instructors/${id}/reject`, { adminRemarks });
  return res.data.data;
};

export const fetchAllInstructorsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/instructors', { params });
  return res.data.data;
};

export const fetchContentResourcesAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/resources', { params });
  return res.data?.data || [];
};

export const fetchContentCommunitiesAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/communities', { params });
  return res.data?.data || [];
};

export const fetchContentEventsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/events', { params });
  return res.data?.data || [];
};

export const fetchContentSandboxAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/sandbox', { params });
  return res.data?.data || [];
};

export const fetchContentWorkspacesAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/workspaces', { params });
  return res.data?.data || [];
};

export const fetchContentAssessmentsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/assessments', { params });
  return res.data?.data || [];
};

export const approveInstructorAPI = approveInstructorApplicationAPI;
export const rejectInstructorAPI = rejectInstructorApplicationAPI;

export const suspendInstructorAPI = async (id, adminRemarks = '') => {
  const res = await apiClient.put(`/admin/instructors/${id}/suspend`, { adminRemarks });
  return res.data?.data || res.data;
};

export const fetchSystemHealthAPI = async () => {
  const res = await apiClient.get('/admin/health');
  return res.data?.data || res.data;
};

export const fetchModerationQueueAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/moderation', { params });
  return res.data?.data || [];
};

export const approveModerationItemAPI = async (id) => {
  const res = await apiClient.put(`/admin/moderation/${id}/approve`);
  return res.data?.data || res.data;
};

export const rejectModerationItemAPI = async (id) => {
  const res = await apiClient.put(`/admin/moderation/${id}/reject`);
  return res.data?.data || res.data;
};


export const fetchContentSessionsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/content/sessions', { params });
  return res.data?.data || [];
};

export const fetchAuditLogsAPI = async (params = {}) => {
  const res = await apiClient.get('/admin/audit-logs', { params });
  return res.data?.data || [];
};



