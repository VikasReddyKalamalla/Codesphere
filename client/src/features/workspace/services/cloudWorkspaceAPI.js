import apiClient from '@services/axios.js';

export const cloudWorkspaceAPI = {
  /**
   * Create or spin up container for lesson or personal practice
   */
  async createWorkspace(data) {
    const response = await apiClient.post('/cloud-workspace/create', data);
    return response.data;
  },

  /**
   * Fetch all workspaces for student
   */
  async getStudentWorkspaces(studentId) {
    const response = await apiClient.get(`/cloud-workspace/student-workspaces${studentId ? '?studentId=' + studentId : ''}`);
    return response.data;
  },

  /**
   * Get workspace details
   */
  async getWorkspaceDetails(workspaceId) {
    const response = await apiClient.get(`/cloud-workspace/${workspaceId}`);
    return response.data;
  },

  /**
   * Switch mode (learning vs exam)
   */
  async switchMode(workspaceId, data) {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/mode`, data);
    return response.data;
  },

  /**
   * Get student learning analytics
   */
  async getAnalytics(workspaceId) {
    const response = await apiClient.get(`/cloud-workspace/${workspaceId}/analytics`);
    return response.data;
  },

  /**
   * Context-aware AI tutor prompt
   */
  async sendAiTutorMessage(workspaceId, data) {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/ai-tutor`, data);
    return response.data;
  },

  /**
   * Fetch live telemetry stats (CPU %, RAM, Processes)
   */
  async getTelemetry(workspaceId) {
    const response = await apiClient.get(`/cloud-workspace/${workspaceId}/telemetry`);
    return response.data;
  },

  /**
   * Start existing stopped workspace container
   */
  async startWorkspace(data) {
    const response = await apiClient.post('/cloud-workspace/start', data);
    return response.data;
  },

  /**
   * Stop workspace container
   */
  async stopWorkspace(data) {
    const response = await apiClient.post('/cloud-workspace/stop', data);
    return response.data;
  },

  /**
   * Trigger crash recovery / auto-heal
   */
  async autoHeal(workspaceId) {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/auto-heal`);
    return response.data;
  },

  /**
   * Scan dynamic listening preview ports with friendly labels
   */
  async getDynamicPorts(workspaceId) {
    const response = await apiClient.get(`/cloud-workspace/${workspaceId}/ports`);
    return response.data;
  },

  /**
   * Get environment variables
   */
  async getEnvVars(workspaceId) {
    const response = await apiClient.get(`/cloud-workspace/${workspaceId}/env`);
    return response.data;
  },

  /**
   * Save environment variables to container .env
   */
  async saveEnvVars(workspaceId, envVars) {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/env`, { envVars });
    return response.data;
  },

  /**
   * Get curated marketplace extensions
   */
  async getMarketplaceExtensions() {
    const response = await apiClient.get('/cloud-workspace/marketplace/extensions');
    return response.data;
  },

  /**
   * Save disk snapshot
   */
  async saveSnapshot(workspaceId, title = 'Checkpoint') {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/snapshot`, { title });
    return response.data;
  },

  /**
   * Restore disk snapshot
   */
  async restoreSnapshot(workspaceId, snapshotId) {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/restore-snapshot`, { snapshotId });
    return response.data;
  },

  /**
   * Send prompt to embedded AI coding assistant
   */
  async sendAiMessage(workspaceId, data) {
    const response = await apiClient.post(`/cloud-workspace/${workspaceId}/ai-chat`, data);
    return response.data;
  },

  /**
   * Delete workspace
   */
  async deleteWorkspace(workspaceId, removeFiles = false) {
    const response = await apiClient.delete(`/cloud-workspace/${workspaceId}?removeFiles=${removeFiles}`);
    return response.data;
  }
};
