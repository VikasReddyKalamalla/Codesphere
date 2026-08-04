import apiClient from '@services/axios.js';

const DSA_BASE = '/dsa';

export const dsaAPI = {
  // ─── Topics ─────────────────────────────────────────────────────────────────
  getTopics:          async ()     => (await apiClient.get(`${DSA_BASE}/topics`)).data,
  getTopicBySlug:     async (slug) => (await apiClient.get(`${DSA_BASE}/topics/${slug}`)).data,

  // ─── Problems ───────────────────────────────────────────────────────────────
  getProblemBySlug:   async (slug) => (await apiClient.get(`${DSA_BASE}/problems/${slug}`)).data,
  getEditorial:       async (slug) => (await apiClient.get(`${DSA_BASE}/problems/${slug}/editorial`)).data,
  unlockEditorial:    async (slug) => (await apiClient.post(`${DSA_BASE}/problems/${slug}/unlock-editorial`)).data,
  runCode:            async (slug, data) => (await apiClient.post(`${DSA_BASE}/problems/${slug}/run`, data)).data,
  submitCode:         async (slug, data) => (await apiClient.post(`${DSA_BASE}/problems/${slug}/submit`, data)).data,
  getSubmissions:     async (slug) => (await apiClient.get(`${DSA_BASE}/problems/${slug}/submissions`)).data,
  updateProgress:     async (slug, data) => (await apiClient.put(`${DSA_BASE}/problems/${slug}/progress`, data)).data,
  saveNotes:          async (slug, notes) => (await apiClient.put(`${DSA_BASE}/problems/${slug}/notes`, { notes })).data,

  // ─── Dashboard & Progress ──────────────────────────────────────────────────
  getDashboard:       async ()     => (await apiClient.get(`${DSA_BASE}/dashboard`)).data,
  getRevision:        async (params) => (await apiClient.get(`${DSA_BASE}/revision`, { params })).data,
  getBookmarks:       async ()     => (await apiClient.get(`${DSA_BASE}/bookmarks`)).data,

  // ─── Search ─────────────────────────────────────────────────────────────────
  search:             async (params) => (await apiClient.get(`${DSA_BASE}/search`, { params })).data,

  // ─── Patterns ───────────────────────────────────────────────────────────────
  getPatterns:        async ()     => (await apiClient.get(`${DSA_BASE}/patterns`)).data,
  getPatternProblems: async (slug) => (await apiClient.get(`${DSA_BASE}/patterns/${slug}`)).data,

  // ─── Achievements ──────────────────────────────────────────────────────────
  getAchievements:    async ()     => (await apiClient.get(`${DSA_BASE}/achievements`)).data,
};

export default dsaAPI;
