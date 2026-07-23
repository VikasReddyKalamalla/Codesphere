import apiClient from '@services/axios.js';

export const fetchSessionsAPI = async (query = {}) => {
  const res = await apiClient.get('/sessions', { params: query });
  return res.data.data;
};

export const fetchMySessionsAPI = async () => {
  const res = await apiClient.get('/sessions/my-sessions');
  return res.data.data;
};

export const getSessionByIdAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}`);
  return res.data.data;
};

export const createSessionAPI = async (data) => {
  const res = await apiClient.post('/sessions', data);
  return res.data.data;
};

export const updateSessionAPI = async (id, data) => {
  const res = await apiClient.put(`/sessions/${id}`, data);
  return res.data.data;
};

export const deleteSessionAPI = async (id) => {
  const res = await apiClient.delete(`/sessions/${id}`);
  return res.data;
};

export const duplicateSessionAPI = async (id) => {
  const res = await apiClient.post(`/sessions/${id}/duplicate`);
  return res.data.data;
};

export const archiveSessionAPI = async (id) => {
  const res = await apiClient.patch(`/sessions/${id}/archive`);
  return res.data.data;
};

export const publishSessionAPI = async (id) => {
  const res = await apiClient.patch(`/sessions/${id}/publish`);
  return res.data.data;
};

export const cancelSessionAPI = async (id) => {
  const res = await apiClient.patch(`/sessions/${id}/cancel`);
  return res.data.data;
};

export const goLiveAPI = async (id) => {
  const res = await apiClient.patch(`/sessions/${id}/go-live`);
  return res.data.data;
};

export const endSessionAPI = async (id) => {
  const res = await apiClient.patch(`/sessions/${id}/end`);
  return res.data.data;
};

export const getSessionAnalyticsAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/analytics`);
  return res.data.data;
};

// ─── Registration ─────────────────────────────────────────────────────────────
export const registerForSessionAPI = async (id) => {
  const res = await apiClient.post(`/sessions/${id}/register`);
  return res.data.data;
};

export const cancelRegistrationAPI = async (id) => {
  const res = await apiClient.delete(`/sessions/${id}/register`);
  return res.data;
};

export const getRegistrationsAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/registrations`);
  return res.data.data;
};

// ─── Attendance ───────────────────────────────────────────────────────────────
export const checkInAPI = async (id) => {
  const res = await apiClient.post(`/sessions/${id}/check-in`);
  return res.data.data;
};

export const checkOutAPI = async (id) => {
  const res = await apiClient.post(`/sessions/${id}/check-out`);
  return res.data.data;
};

export const getAttendanceAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/attendance`);
  return res.data.data;
};

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const submitFeedbackAPI = async (id, data) => {
  const res = await apiClient.post(`/sessions/${id}/feedback`, data);
  return res.data.data;
};

// ─── Reminders ────────────────────────────────────────────────────────────────
export const createReminderAPI = async (id, data) => {
  const res = await apiClient.post(`/sessions/${id}/reminder`, data);
  return res.data.data;
};

// ─── Recordings ───────────────────────────────────────────────────────────────
export const uploadRecordingAPI = async (id, data) => {
  const res = await apiClient.post(`/sessions/${id}/recording`, data);
  return res.data.data;
};

export const getRecordingsAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/recordings`);
  return res.data.data;
};

// ─── Questions (Q&A) ──────────────────────────────────────────────────────────
export const getQuestionsAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/questions`);
  return res.data.data;
};

export const askQuestionAPI = async (id, questionText) => {
  const res = await apiClient.post(`/sessions/${id}/questions`, { questionText });
  return res.data.data;
};

export const postAnswerAPI = async (id, qId, answerText) => {
  const res = await apiClient.post(`/sessions/${id}/questions/${qId}/answers`, { answerText });
  return res.data.data;
};

export const voteQuestionAPI = async (id, qId) => {
  const res = await apiClient.patch(`/sessions/${id}/questions/${qId}/vote`);
  return res.data.data;
};

export const pinQuestionAPI = async (id, qId) => {
  const res = await apiClient.patch(`/sessions/${id}/questions/${qId}/pin`);
  return res.data.data;
};

export const markAnsweredAPI = async (id, qId) => {
  const res = await apiClient.patch(`/sessions/${id}/questions/${qId}/answered`);
  return res.data.data;
};

// ─── Polls ────────────────────────────────────────────────────────────────────
export const getPollsAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/polls`);
  return res.data.data;
};

export const createPollAPI = async (id, data) => {
  const res = await apiClient.post(`/sessions/${id}/polls`, data);
  return res.data.data;
};

export const votePollAPI = async (id, pId, optionIndex) => {
  const res = await apiClient.post(`/sessions/${id}/polls/${pId}/vote`, { optionIndex });
  return res.data.data;
};

export const closePollAPI = async (id, pId) => {
  const res = await apiClient.patch(`/sessions/${id}/polls/${pId}/close`);
  return res.data.data;
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────
export const getQuizzesAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/quizzes`);
  return res.data.data;
};

export const createQuizAPI = async (id, data) => {
  const res = await apiClient.post(`/sessions/${id}/quizzes`, data);
  return res.data.data;
};

export const startQuizAPI = async (id, qzId) => {
  const res = await apiClient.patch(`/sessions/${id}/quizzes/${qzId}/start`);
  return res.data.data;
};

export const submitQuizAttemptAPI = async (id, qzId, answers) => {
  const res = await apiClient.post(`/sessions/${id}/quizzes/${qzId}/submit`, { answers });
  return res.data.data;
};

// ─── Resources ────────────────────────────────────────────────────────────────
export const getResourcesAPI = async (id) => {
  const res = await apiClient.get(`/sessions/${id}/resources`);
  return res.data.data;
};

export const uploadResourceAPI = async (id, data) => {
  const res = await apiClient.post(`/sessions/${id}/resources`, data);
  return res.data.data;
};

export const deleteResourceAPI = async (id, rId) => {
  const res = await apiClient.delete(`/sessions/${id}/resources/${rId}`);
  return res.data;
};

// ─── Certificates ─────────────────────────────────────────────────────────────
export const getMyCertificatesAPI = async () => {
  const res = await apiClient.get('/sessions/my-certificates');
  return res.data.data;
};

export const generateCertificateAPI = async (id) => {
  const res = await apiClient.post(`/sessions/${id}/certificates`);
  return res.data.data;
};
