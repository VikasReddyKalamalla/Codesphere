export const selectSessions = (state) => state.sessions;
export const selectSessionItems = (state) => state.sessions?.items || [];
export const selectRegisteredSessions = (state) => state.sessions?.registeredSessions || [];
export const selectCertificates = (state) => state.sessions?.certificates || [];
export const selectCurrentSession = (state) => state.sessions?.currentSession;
export const selectSessionInteractivity = (state) => state.sessions?.currentSessionInteractivity || {};
export const selectSessionQuestions = (state) => state.sessions?.currentSessionInteractivity?.questions || [];
export const selectSessionPolls = (state) => state.sessions?.currentSessionInteractivity?.polls || [];
export const selectSessionQuizzes = (state) => state.sessions?.currentSessionInteractivity?.quizzes || [];
export const selectSessionResources = (state) => state.sessions?.currentSessionInteractivity?.resources || [];
export const selectSessionRecordings = (state) => state.sessions?.currentSessionInteractivity?.recordings || [];
export const selectSessionAttendance = (state) => state.sessions?.currentSessionInteractivity?.attendance;
export const selectSessionsLoading = (state) => state.sessions?.status === 'loading';

