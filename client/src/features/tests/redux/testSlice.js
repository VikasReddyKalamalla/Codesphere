import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  contests: [],
  leaderboard: [],
  selectedTest: null,
  activeAttempt: null,
  lastAttemptResult: null,
  activeTab: 'explore', // explore, contests, practice, attempts, bookmarks, leaderboard
  activeCategory: 'all',
  activeDifficulty: 'all',
  searchQuery: '',
  userBookmarks: [],
  status: 'idle',
  error: null,
};

const testSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    setTests: (state, action) => {
      state.items = action.payload;
    },
    setContests: (state, action) => {
      state.contests = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    setSelectedTest: (state, action) => {
      state.selectedTest = action.payload;
    },
    startAttemptSession: (state, action) => {
      state.activeAttempt = {
        testId: action.payload._id || action.payload.id,
        testTitle: action.payload.title,
        startTime: Date.now(),
        duration: action.payload.duration || 45,
        currentQuestionIndex: 0,
        answers: {},
        codeAnswers: {},
        bookmarks: [],
        proctoringWarnings: 0,
      };
    },
    updateAnswer: (state, action) => {
      if (state.activeAttempt) {
        const { questionId, answer } = action.payload;
        state.activeAttempt.answers[questionId] = answer;
      }
    },
    updateCodeAnswer: (state, action) => {
      if (state.activeAttempt) {
        const { questionId, code } = action.payload;
        state.activeAttempt.codeAnswers[questionId] = code;
      }
    },
    setLastAttemptResult: (state, action) => {
      state.lastAttemptResult = action.payload;
      state.activeAttempt = null;
    },
    incrementProctoringWarning: (state) => {
      if (state.activeAttempt) {
        state.activeAttempt.proctoringWarnings += 1;
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActiveDifficulty: (state, action) => {
      state.activeDifficulty = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleTestBookmark: (state, action) => {
      const id = action.payload;
      if (state.userBookmarks.includes(id)) {
        state.userBookmarks = state.userBookmarks.filter(bId => bId !== id);
      } else {
        state.userBookmarks.push(id);
      }
    },
    addTestItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    resetTestFilters: (state) => {
      state.activeCategory = 'all';
      state.activeDifficulty = 'all';
      state.searchQuery = '';
    },
  },
});

export const {
  setTests,
  setContests,
  setLeaderboard,
  setSelectedTest,
  startAttemptSession,
  updateAnswer,
  updateCodeAnswer,
  setLastAttemptResult,
  incrementProctoringWarning,
  setActiveTab,
  setActiveCategory,
  setActiveDifficulty,
  setSearchQuery,
  toggleTestBookmark,
  addTestItem,
  resetTestFilters,
} = testSlice.actions;

export default testSlice.reducer;
