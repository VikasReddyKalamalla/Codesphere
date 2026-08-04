import apiClient from '@services/axios.js';

// ─── Dashboard & Statistics ──────────────────────────────────────────────────
export const fetchAdminStatsAPI = async () => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.data || res.data;
};

export const fetchAdminStatisticsAPI = async () => {
  const res = await apiClient.get('/admin/statistics');
  return res.data.data || res.data;
};

// ─── User Management ─────────────────────────────────────────────────────────
export const fetchAllUsersAPI = async (params) => {
  const res = await apiClient.get('/admin/users', { params });
  return res.data.data || res.data;
};

export const fetchUserByIdAPI = async (id) => {
  const res = await apiClient.get(`/admin/users/${id}`);
  return res.data.data || res.data;
};

export const updateUserRoleAPI = async (id, role) => {
  const res = await apiClient.put(`/admin/users/${id}/role`, { role });
  return res.data.data || res.data;
};

export const suspendUserAPI = async (id, reason) => {
  const res = await apiClient.put(`/admin/users/${id}/suspend`, { reason });
  return res.data.data || res.data;
};

export const activateUserAPI = async (id) => {
  const res = await apiClient.put(`/admin/users/${id}/activate`);
  return res.data.data || res.data;
};

export const resetUserPasswordAPI = async (id, newPassword) => {
  const res = await apiClient.post(`/admin/users/${id}/reset-password`, { newPassword });
  return res.data.data || res.data;
};

// ─── Instructor Management ────────────────────────────────────────────────────
export const fetchAllInstructorsAPI = async (params) => {
  const res = await apiClient.get('/admin/instructors', { params });
  return res.data.data || res.data;
};

export const approveInstructorAPI = async (id) => {
  const res = await apiClient.put(`/admin/instructors/${id}/approve`);
  return res.data.data || res.data;
};

export const rejectInstructorAPI = async (id, reason) => {
  const res = await apiClient.put(`/admin/instructors/${id}/reject`, { reason });
  return res.data.data || res.data;
};

export const suspendInstructorAPI = async (id, reason) => {
  const res = await apiClient.put(`/admin/instructors/${id}/suspend`, { reason });
  return res.data.data || res.data;
};

// ─── Content & Modules ────────────────────────────────────────────────────────
export const fetchContentLearningPathsAPI = async (params) => {
  const res = await apiClient.get('/admin/content/learning-paths', { params });
  return res.data.data || res.data;
};

export const fetchContentResourcesAPI = async (params) => {
  const res = await apiClient.get('/admin/content/resources', { params });
  return res.data.data || res.data;
};

export const fetchContentCommunitiesAPI = async (params) => {
  const res = await apiClient.get('/admin/content/communities', { params });
  return res.data.data || res.data;
};

export const fetchContentEventsAPI = async (params) => {
  const res = await apiClient.get('/admin/content/events', { params });
  return res.data.data || res.data;
};

export const fetchContentSandboxAPI = async (params) => {
  const res = await apiClient.get('/admin/content/sandbox-projects', { params });
  return res.data.data || res.data;
};

export const fetchContentWorkspacesAPI = async (params) => {
  const res = await apiClient.get('/admin/content/workspaces', { params });
  return res.data.data || res.data;
};

export const fetchContentAssessmentsAPI = async (params) => {
  const res = await apiClient.get('/admin/content/assessments', { params });
  return res.data.data || res.data;
};

export const fetchContentSessionsAPI = async (params) => {
  const res = await apiClient.get('/admin/content/live-sessions', { params });
  return res.data.data || res.data;
};

// ─── Moderation & Reports ────────────────────────────────────────────────────
export const fetchModerationQueueAPI = async (params) => {
  const res = await apiClient.get('/admin/moderation', { params });
  return res.data.data || res.data;
};

export const approveModerationItemAPI = async (id) => {
  const res = await apiClient.put(`/admin/moderation/${id}/approve`);
  return res.data.data || res.data;
};

export const rejectModerationItemAPI = async (id, reason) => {
  const res = await apiClient.put(`/admin/moderation/${id}/reject`, { reason });
  return res.data.data || res.data;
};

export const fetchReportsAPI = async (params) => {
  const res = await apiClient.get('/admin/reports', { params });
  return res.data.data || res.data;
};

export const updateReportAPI = async (id, data) => {
  const res = await apiClient.put(`/admin/reports/${id}`, data);
  return res.data.data || res.data;
};

// ─── Settings, Features & System Health ──────────────────────────────────────
export const fetchPlatformSettingsAPI = async () => {
  const res = await apiClient.get('/admin/settings');
  return res.data.data || res.data;
};

export const updatePlatformSettingsAPI = async (settings) => {
  const res = await apiClient.put('/admin/settings', settings);
  return res.data.data || res.data;
};

export const fetchFeatureTogglesAPI = async () => {
  const res = await apiClient.get('/admin/features');
  return res.data.data || res.data;
};

export const updateFeatureToggleAPI = async (id, enabled) => {
  const res = await apiClient.put(`/admin/features/${id}`, { isEnabled: enabled });
  return res.data.data || res.data;
};

export const fetchSystemHealthAPI = async () => {
  const res = await apiClient.get('/admin/system-health');
  return res.data.data || res.data;
};

export const fetchAuditLogsAPI = async (params) => {
  const res = await apiClient.get('/admin/audit-logs', { params });
  return res.data.data || res.data;
};

export const fetchAnnouncementsAPI = async (params) => {
  const res = await apiClient.get('/admin/announcements', { params });
  return res.data.data || res.data;
};

export const createAnnouncementAPI = async (data) => {
  const res = await apiClient.post('/admin/announcements', data);
  return res.data.data || res.data;
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
