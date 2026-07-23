import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSection: 'account',
  searchQuery: '',
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
  settings: {
    account: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      bio: '',
      headline: '',
      occupation: '',
      education: '',
      college: '',
      website: '',
      location: '',
      timezone: 'UTC+05:30 (Asia/Kolkata)',
      language: 'en',
      country: 'India',
      socialLinks: { github: '', linkedin: '', twitter: '' },
    },
    profile: {
      avatarUrl: '',
      coverImageUrl: '',
      portfolioUrl: '',
      resumeUrl: '',
      skills: [],
      interests: [],
      achievements: [],
      visibility: 'public',
    },
    security: {
      twoFactorEnabled: false,
      twoFactorMethod: 'authenticator',
      recoveryEmail: 'backup.dev@gmail.com',
      recoveryPhone: '+91 98765 ****0',
      loginAlerts: true,
      suspiciousDetection: true,
      securityScore: 88,
    },
    privacy: {
      profileVisibility: 'public',
      hideEmail: true,
      hidePhone: true,
      hideActivity: false,
      hideProgress: false,
      hideCertificates: false,
      hideAchievements: false,
      hideProjects: false,
      messagePermission: 'everyone',
      followPermission: 'everyone',
      blockedUsers: [],
      mutedUsers: [],
    },
    notifications: {
      emailNotifs: true,
      pushNotifs: true,
      smsNotifs: false,
      browserNotifs: true,
      communityNotifs: true,
      learningNotifs: true,
      assessmentNotifs: true,
      liveSessionNotifs: true,
      resourceNotifs: true,
      hackathonNotifs: true,
      aiNotifs: true,
      marketingEmails: false,
      weeklyDigest: true,
    },
    appearance: {
      theme: 'dark',
      accentColor: '#04AA6D',
      sidebarStyle: 'default',
      compactMode: false,
      fontSize: 'medium',
      cardStyle: 'glass',
      animationEnabled: true,
      reduceMotion: false,
      layoutDensity: 'comfortable',
    },
    accessibility: {
      screenReaderSupport: false,
      keyboardNavigation: true,
      highContrastMode: false,
      colorBlindMode: 'none',
      largeText: false,
      captionsEnabled: true,
      audioDescriptions: false,
    },
    languageRegion: {
      language: 'English (US)',
      country: 'India',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12-hour (AM/PM)',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      currency: 'INR (₹)',
    },
    learning: {
      preferredTechnologies: [],
      learningGoals: '',
      dailyStudyTargetMinutes: 60,
      weeklyGoalHours: 10,
      preferredDifficulty: 'intermediate',
      preferredStyle: 'hands_on',
      autoContinueCourses: true,
      autoSaveProgress: true,
      learningReminders: true,
    },
    coding: {
      preferredLanguage: 'javascript',
      editorTheme: 'vs-dark',
      tabSize: 2,
      fontFamily: "'Fira Code', monospace",
      fontSize: 14,
      autoSave: 'afterDelay',
      wordWrap: true,
      codeFormatting: true,
      autosuggestion: true,
      terminalTheme: 'dark',
      compilerDefaults: 'es2022',
    },
    ai: {
      enableAI: true,
      aiPersonality: 'expert_architect',
      responseStyle: 'code_first',
      creativityLevel: 0.7,
      codingAssistant: true,
      aiTutor: true,
      aiCodeReview: true,
      aiSuggestions: true,
      dailyLimitCredits: 250,
    },
    dashboard: {
      widgetsOrder: ['overview', 'learning', 'sandbox', 'activity'],
      hiddenWidgets: [],
      favoriteWidgets: ['sandbox', 'ai_tutor'],
      defaultLayout: 'standard',
    },
    calendar: {
      googleSync: false,
      outlookSync: false,
      appleSync: false,
      syncSessions: true,
      syncEvents: true,
      reminderLeadTimeMinutes: 15,
    },
    integrations: {
      githubConnected: false,
      vsCodeConnected: false,
      discordConnected: false,
      slackConnected: false,
      googleDriveConnected: false,
      notionConnected: false,
      figmaConnected: false,
    },
    experimental: {
      betaFeatures: true,
      aiBeta: true,
      labs: false,
      earlyAccess: true,
    },
  },
  devices: [],
  apiKeys: [],
  backups: [],
  activityLogs: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    updateSectionState: (state, action) => {
      const { section, data } = action.payload;
      if (state.settings[section]) {
        state.settings[section] = { ...state.settings[section], ...data };
      }
    },
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setDevices: (state, action) => {
      state.devices = action.payload;
    },
    setApiKeys: (state, action) => {
      state.apiKeys = action.payload;
    },
    setBackups: (state, action) => {
      state.backups = action.payload;
    },
    setActivityLogs: (state, action) => {
      state.activityLogs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSaving: (state, action) => {
      state.saving = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setActiveSection,
  setSearchQuery,
  updateSectionState,
  setSettings,
  setDevices,
  setApiKeys,
  setBackups,
  setActivityLogs,
  setLoading,
  setSaving,
  setSuccessMessage,
  clearMessages,
} = settingsSlice.actions;

export default settingsSlice.reducer;
