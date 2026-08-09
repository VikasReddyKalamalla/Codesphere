import apiClient from '@services/axios.js';

export const fetchWorkspacesAPI = async () => {
  const res = await apiClient.get('/workspaces/my');
  return res.data;
};

export const createWorkspaceAPI = async (payload) => {
  const res = await apiClient.post('/workspaces', payload);
  return res.data;
};

export const fetchWorkspaceDetailsAPI = async (workspaceId) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}`);
  return res.data;
};

export const fetchWorkspaceTasksAPI = async (workspaceId) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}/tasks`);
  return res.data;
};

export const fetchWorkspaceMembersAPI = async (workspaceId) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}/members`);
  return res.data;
};

export const inviteWorkspaceMemberAPI = async (workspaceId, payload) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/invite`, payload);
  return res.data;
};

export const fetchCodexProjectsAPI = async () => {
  const res = await apiClient.get('/codex/projects');
  return res.data;
};

export const createWorkspaceTaskAPI = async (payload) => {
  const res = await apiClient.post('/tasks', payload);
  return res.data;
};

export const updateWorkspaceTaskAPI = async (taskId, payload) => {
  const res = await apiClient.put(`/tasks/${taskId}`, payload);
  return res.data;
};

// ─── Files API ────────────────────────────────────────────────────────────────
export const fetchWorkspaceFilesAPI = async (workspaceId) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}/files`);
  return res.data;
};

export const createWorkspaceFileAPI = async (workspaceId, payload) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/files`, payload);
  return res.data;
};

export const updateWorkspaceFileAPI = async (workspaceId, fileId, payload) => {
  const res = await apiClient.put(`/workspaces/${workspaceId}/files/${fileId}`, payload);
  return res.data;
};

export const deleteWorkspaceFileAPI = async (workspaceId, fileId) => {
  const res = await apiClient.delete(`/workspaces/${workspaceId}/files/${fileId}`);
  return res.data;
};

export const duplicateWorkspaceFileAPI = async (workspaceId, fileId) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/files/${fileId}/duplicate`);
  return res.data;
};

export const uploadWorkspaceFileAPI = async (workspaceId, formData) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/files/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// ─── Chats API ────────────────────────────────────────────────────────────────
export const fetchWorkspaceChatsAPI = async (workspaceId) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}/chats`);
  return res.data;
};

export const searchWorkspaceChatsAPI = async (workspaceId, query) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}/chats/search?query=${query}`);
  return res.data;
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const fetchWorkspaceAnalyticsAPI = async (workspaceId) => {
  const res = await apiClient.get(`/workspaces/${workspaceId}/analytics`);
  return res.data;
};

// ─── Settings API ─────────────────────────────────────────────────────────────
export const updateWorkspaceSettingsAPI = async (workspaceId, payload) => {
  const res = await apiClient.put(`/workspaces/${workspaceId}`, payload);
  return res.data;
};

export const deleteWorkspaceAPI = async (workspaceId) => {
  const res = await apiClient.delete(`/workspaces/${workspaceId}`);
  return res.data;
};

export const archiveWorkspaceAPI = async (workspaceId) => {
  const res = await apiClient.patch(`/workspaces/${workspaceId}/archive`);
  return res.data;
};

export const restoreWorkspaceAPI = async (workspaceId) => {
  const res = await apiClient.patch(`/workspaces/${workspaceId}/restore`);
  return res.data;
};

export const duplicateWorkspaceAPI = async (workspaceId) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/duplicate`);
  return res.data;
};

// ─── Task Comments & Attachments API ─────────────────────────────────────────
export const fetchTaskCommentsAPI = async (taskId) => {
  const res = await apiClient.get(`/tasks/${taskId}/comments`);
  return res.data;
};

export const addTaskCommentAPI = async (taskId, payload) => {
  const res = await apiClient.post(`/tasks/${taskId}/comments`, payload);
  return res.data;
};

export const fetchTaskAttachmentsAPI = async (taskId) => {
  const res = await apiClient.get(`/tasks/${taskId}/attachments`);
  return res.data;
};

export const uploadTaskAttachmentAPI = async (taskId, formData) => {
  const res = await apiClient.post(`/tasks/${taskId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteWorkspaceTaskAPI = async (taskId) => {
  const res = await apiClient.delete(`/tasks/${taskId}`);
  return res.data;
};

// ─── GitHub Sync API ──────────────────────────────────────────────────────────
export const importGitHubRepoAPI = async (workspaceId, payload) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/github/import`, payload);
  return res.data;
};

export const syncGitHubRepoAPI = async (workspaceId, payload) => {
  const res = await apiClient.post(`/workspaces/${workspaceId}/github/sync`, payload);
  return res.data;
};


