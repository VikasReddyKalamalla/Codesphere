export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  DASHBOARD: {
    HOME: '/dashboard',
    STATS: '/dashboard/stats',
    RECENT: '/dashboard/recent'
  },
  LEARNING: {
    PATHS: '/learning/paths',
    LESSONS: '/learning/lessons',
    MODULES: '/learning/modules',
    PROGRESS: '/learning/progress'
  },
  RESOURCES: {
    LIST: '/resources',
    SAVE: '/resources/save',
    BOOKMARK: '/resources/bookmark',
    SEARCH: '/resources/search'
  },
  COMMUNITIES: {
    LIST: '/communities',
    POSTS: '/communities/posts',
    COMMENTS: '/communities/comments',
    CHAT: '/communities/chat'
  },
  SESSIONS: {
    LIST: '/sessions',
    JOIN: '/sessions/join',
    HISTORY: '/sessions/history'
  },
  EVENTS: {
    LIST: '/events',
    REGISTER: '/events/register',
    DETAILS: '/events/details'
  },
  CODEX: {
    PROJECTS: '/codex/projects',
    TASKS: '/codex/tasks',
    MEMBERS: '/codex/members'
  },
  SANDBOX: {
    PROJECTS: '/sandbox/projects',
    PROGRESS: '/sandbox/progress'
  },
  TESTS: {
    QUESTIONS: '/tests/questions',
    RESULTS: '/tests/results',
    LEADERBOARD: '/tests/leaderboard'
  },
  PROFILE: {
    DETAILS: '/profile',
    UPDATE: '/profile/update',
    CERTIFICATES: '/profile/certificates'
  },
  SUBSCRIPTION: {
    PLAN: '/subscription/plan',
    INVOICES: '/subscription/invoices'
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD: '/notifications/unread'
  },
  INSTRUCTOR: {
    COURSES: '/instructor/courses',
    STUDENTS: '/instructor/students',
    ANALYTICS: '/instructor/analytics'
  },
  ADMIN: {
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
    APPLICATIONS: '/admin/applications'
  },
  SETTINGS: {
    PREFERENCES: '/settings/preferences'
  }
};
export default API_ENDPOINTS;
