/**
 * RouteConstants — single source of truth for all application URLs.
 * Import from here instead of hardcoding path strings.
 */

// ─── Public / Landing ─────────────────────────────────────────────────────────
export const ROUTES = {
  HOME:        '/',
  ABOUT:       '/about',
  PRICING:     '/pricing',
  CONTACT:     '/contact',
  FEATURES:    '/features',
  BLOG:        '/blog',
  CAREERS:     '/careers',

  // ─── Auth ───────────────────────────────────────────────────────────────────
  LOGIN:           '/login',
  REGISTER:        '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD:  '/reset-password/:token',
  VERIFY_EMAIL:    '/verify-email/:token',

  // ─── Student Dashboard ───────────────────────────────────────────────────────
  DASHBOARD:       '/dashboard',
  LEADERBOARD:     '/leaderboard',

  // ─── Learning ───────────────────────────────────────────────────────────────
  LEARNING:           '/learning',
  LEARNING_PATH:      '/learning/:pathId',
  LEARNING_MODULE:    '/learning/:pathId/module/:moduleId',
  LEARNING_LESSON:    '/learning/:pathId/module/:moduleId/lesson/:lessonId',
  LEARNING_ARTICLE:   '/learning/:pathId/article/:lessonId',

  // ─── DSA Learning Path ──────────────────────────────────────────────────────
  DSA_ROADMAP:       '/dsa',
  DSA_TOPIC:         '/dsa/topic/:topicSlug',
  DSA_PROBLEM:       '/dsa/problem/:problemSlug',
  DSA_PROGRESS:      '/dsa/progress',
  DSA_REVISION:      '/dsa/revision',
  DSA_BOOKMARKS:     '/dsa/bookmarks',
  DSA_SEARCH:        '/dsa/search',
  DSA_PATTERNS:      '/dsa/patterns',
  DSA_ACHIEVEMENTS:  '/dsa/achievements',

  // ─── Resources ──────────────────────────────────────────────────────────────
  RESOURCES:       '/resources',
  RESOURCE_DETAIL: '/resources/:resourceId',

  // ─── Community ──────────────────────────────────────────────────────────────
  COMMUNITY:        '/community',
  COMMUNITY_DETAIL: '/community/:communityId',
  COMMUNITY_CREATE: '/community/create',
  COMMUNITY_SETTINGS: '/community/:communityId/settings',
  POST_DETAIL:      '/community/:communityId/posts/:postId',

  // ─── Live Sessions ──────────────────────────────────────────────────────────
  SESSIONS:        '/sessions',
  SESSION_DETAIL:  '/sessions/:sessionId',
  SESSION_LIVE:    '/sessions/:sessionId/live',

  // ─── Events ─────────────────────────────────────────────────────────────────
  EVENTS:          '/events',
  EVENT_DETAIL:    '/events/:eventId',

  // ─── Codex (Workspace) ──────────────────────────────────────────────────────
  CODEX:           '/codex',
  CODEX_CREATE:    '/codex/create',
  WORKSPACE:       '/codex/:workspaceId',
  TASK:            '/codex/:workspaceId/tasks/:taskId',

  // ─── Sandbox ────────────────────────────────────────────────────────────────
  SANDBOX:         '/sandbox',
  SANDBOX_PROJECT: '/sandbox/:projectId',
  IDE:             '/ide',

  // ─── Tests / Assessments ────────────────────────────────────────────────────
  TESTS:           '/tests',
  TEST_DETAIL:     '/tests/:testId',
  TEST_ATTEMPT:    '/tests/:testId/attempt',
  TEST_RESULTS:    '/tests/:testId/results/:attemptId',

  // ─── Profile ────────────────────────────────────────────────────────────────
  PROFILE:         '/profile',
  PROFILE_PUBLIC:  '/u/:username',

  // ─── Notifications ──────────────────────────────────────────────────────────
  NOTIFICATIONS:   '/notifications',

  // ─── Subscription ───────────────────────────────────────────────────────────
  SUBSCRIPTION:    '/subscription',
  BILLING:         '/subscription/billing',

  // ─── Settings ───────────────────────────────────────────────────────────────
  SETTINGS:            '/settings',
  SETTINGS_PROFILE:    '/settings/profile',
  SETTINGS_ACCOUNT:    '/settings/account',
  SETTINGS_SECURITY:   '/settings/security',
  SETTINGS_PREFERENCES:'/settings/preferences',
  SETTINGS_NOTIFICATIONS:'/settings/notifications',

  // ─── Instructor ─────────────────────────────────────────────────────────────
  INSTRUCTOR:             '/instructor',
  INSTRUCTOR_DASHBOARD:   '/instructor/dashboard',
  INSTRUCTOR_COURSES:     '/instructor/courses',
  INSTRUCTOR_LEARNING_PATHS: '/instructor/learning-paths',
  INSTRUCTOR_SANDBOX:     '/instructor/sandbox',
  INSTRUCTOR_STUDENTS:    '/instructor/students',
  INSTRUCTOR_SESSIONS:    '/instructor/sessions',
  INSTRUCTOR_ASSIGNMENTS: '/instructor/assignments',
  INSTRUCTOR_ASSESSMENTS: '/instructor/assessments',
  INSTRUCTOR_CERTIFICATES:'/instructor/certificates',
  INSTRUCTOR_COMMUNITIES: '/instructor/communities',
  INSTRUCTOR_ANALYTICS:   '/instructor/analytics',
  INSTRUCTOR_RESOURCES:   '/instructor/resources',
  INSTRUCTOR_SETTINGS:    '/instructor/settings',
  INSTRUCTOR_APPLY:       '/instructor/apply',

  // ─── Admin ──────────────────────────────────────────────────────────────────
  ADMIN:              '/admin',
  ADMIN_DASHBOARD:    '/admin/dashboard',
  ADMIN_USERS:        '/admin/users',
  ADMIN_USER_DETAIL:  '/admin/users/:userId',
  ADMIN_INSTRUCTORS:  '/admin/instructors',
  ADMIN_CONTENT:      '/admin/content',
  ADMIN_LEARNING:     '/admin/learning',
  ADMIN_RESOURCES:    '/admin/resources',
  ADMIN_COMMUNITIES:  '/admin/communities',
  ADMIN_SESSIONS:     '/admin/sessions',
  ADMIN_EVENTS:       '/admin/events',
  ADMIN_SANDBOX:      '/admin/sandbox',
  ADMIN_CODEX:        '/admin/codex',
  ADMIN_TESTS:        '/admin/tests',
  ADMIN_SUBSCRIPTIONS:'/admin/subscriptions',
  ADMIN_PAYMENTS:     '/admin/payments',
  ADMIN_REPORTS:      '/admin/reports',
  ADMIN_MODERATION:   '/admin/moderation',
  ADMIN_SETTINGS:     '/admin/settings',
  ADMIN_ANALYTICS:    '/admin/analytics',
  ADMIN_AUDIT_LOGS:   '/admin/audit-logs',
  ADMIN_ANNOUNCEMENTS:'/admin/announcements',
  ADMIN_FEATURES:     '/admin/features',
  ADMIN_HEALTH:       '/admin/system-health',

  // ─── Legal ──────────────────────────────────────────────────────────────────
  PRIVACY:       '/privacy',
  TERMS:         '/terms',
  COOKIE_POLICY: '/cookies',

  // ─── Error pages ────────────────────────────────────────────────────────────
  NOT_FOUND:     '/404',
  SERVER_ERROR:  '/500',
  MAINTENANCE:   '/maintenance',
  COMING_SOON:   '/coming-soon',
};

export default ROUTES;
