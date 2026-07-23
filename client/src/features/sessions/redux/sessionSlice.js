import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  registeredSessions: [],
  certificates: [],
  currentSession: null,
  currentSessionInteractivity: {
    questions: [],
    polls: [],
    quizzes: [],
    resources: [],
    recordings: [],
    attendance: null,
  },
  status: 'idle',
  error: null,
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    fetchSessionsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
    },
    fetchMySessionsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.registeredSessions = action.payload;
    },
    fetchCertificatesSuccess: (state, action) => {
      state.status = 'succeeded';
      state.certificates = action.payload;
    },
    setCurrentSessionSuccess: (state, action) => {
      state.status = 'succeeded';
      state.currentSession = action.payload;
    },
    setInteractivityData: (state, action) => {
      state.currentSessionInteractivity = {
        ...state.currentSessionInteractivity,
        ...action.payload,
      };
    },

    // ─── Realtime Q&A Local Mutators ──────────────────────────────────────────
    addQuestionLocally: (state, action) => {
      const exists = state.currentSessionInteractivity.questions.some(q => q._id === action.payload._id);
      if (!exists) {
        state.currentSessionInteractivity.questions.unshift(action.payload);
      }
    },
    updateQuestionLocally: (state, action) => {
      const idx = state.currentSessionInteractivity.questions.findIndex(q => q._id === action.payload._id);
      if (idx > -1) {
        state.currentSessionInteractivity.questions[idx] = {
          ...state.currentSessionInteractivity.questions[idx],
          ...action.payload,
        };
      }
    },
    addAnswerLocally: (state, action) => {
      const { questionId, answer } = action.payload;
      const question = state.currentSessionInteractivity.questions.find(q => q._id === questionId);
      if (question) {
        if (!question.answers) question.answers = [];
        const exists = question.answers.some(a => a._id === answer._id);
        if (!exists) {
          question.answers.push(answer);
          question.isAnswered = true;
        }
      }
    },

    // ─── Realtime Polls Local Mutators ─────────────────────────────────────────
    addPollLocally: (state, action) => {
      const exists = state.currentSessionInteractivity.polls.some(p => p._id === action.payload._id);
      if (!exists) {
        state.currentSessionInteractivity.polls.unshift(action.payload);
      }
    },
    updatePollLocally: (state, action) => {
      const idx = state.currentSessionInteractivity.polls.findIndex(p => p._id === action.payload._id);
      if (idx > -1) {
        state.currentSessionInteractivity.polls[idx] = {
          ...state.currentSessionInteractivity.polls[idx],
          ...action.payload,
        };
      }
    },

    // ─── Realtime Quizzes Local Mutators ───────────────────────────────────────
    addQuizLocally: (state, action) => {
      const exists = state.currentSessionInteractivity.quizzes.some(q => q._id === action.payload._id);
      if (!exists) {
        state.currentSessionInteractivity.quizzes.unshift(action.payload);
      }
    },
    updateQuizLocally: (state, action) => {
      const idx = state.currentSessionInteractivity.quizzes.findIndex(q => q._id === action.payload._id);
      if (idx > -1) {
        state.currentSessionInteractivity.quizzes[idx] = {
          ...state.currentSessionInteractivity.quizzes[idx],
          ...action.payload,
        };
      }
    },
  },
});

export const {
  fetchStart,
  fetchFailure,
  fetchSessionsSuccess,
  fetchMySessionsSuccess,
  fetchCertificatesSuccess,
  setCurrentSessionSuccess,
  setInteractivityData,
  addQuestionLocally,
  updateQuestionLocally,
  addAnswerLocally,
  addPollLocally,
  updatePollLocally,
  addQuizLocally,
  updateQuizLocally,
} = sessionSlice.actions;

export default sessionSlice.reducer;
