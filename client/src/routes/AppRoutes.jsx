import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import LoadingRoute from './LoadingRoute.jsx';
import RouteGuard from './RouteGuard.jsx';

// ─── Layouts ──────────────────────────────────────────────────────────────────
import {
  PublicLayout,
  DashboardLayout,
  InstructorLayout,
  AdminLayout,
  AuthLayout,
  EmptyLayout,
  ErrorLayout,
} from '@layouts';

// ─── Guards ───────────────────────────────────────────────────────────────────
import GuestGuard from './GuestGuard.jsx';
import PermissionGuard from './PermissionGuard.jsx';

// ─── Auth pages ───────────────────────────────────────────────────────────────
const LoginPage          = lazy(() => import('@features/auth/pages/LoginPage.jsx'));
const RegisterPage       = lazy(() => import('@features/auth/pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage  = lazy(() => import('@features/auth/pages/ResetPasswordPage.jsx'));
const VerifyEmailPage    = lazy(() => import('@features/auth/pages/VerifyEmailPage.jsx'));

// ─── Landing / public pages ───────────────────────────────────────────────────
const LandingPage   = lazy(() => import('@features/landing/pages/LandingPage.jsx'));
const AboutPage     = lazy(() => import('@features/landing/pages/AboutPage.jsx'));
const PricingPage   = lazy(() => import('@features/landing/pages/PricingPage.jsx'));
const FeaturesPage  = lazy(() => import('@features/landing/pages/FeaturesPage.jsx'));
const ContactPage   = lazy(() => import('@features/landing/pages/ContactPage.jsx'));
const PrivacyPage   = lazy(() => import('@features/legal/pages/PrivacyPage.jsx'));
const TermsPage     = lazy(() => import('@features/legal/pages/TermsPage.jsx'));
const CookiesPage   = lazy(() => import('@features/legal/pages/CookiesPage.jsx'));

// ─── Student dashboard pages (Lazily loaded for maximum performance & fast load) ─
const DashboardPage         = lazy(() => import('@features/dashboard/pages/DashboardPage.jsx'));
const LeaderboardPage       = lazy(() => import('@features/leaderboard/pages/LeaderboardPage.jsx'));
const LearningPage          = lazy(() => import('@features/learning/pages/LearningPage.jsx'));
const LearningPathPage      = lazy(() => import('@features/learning/pages/LearningPathPage.jsx'));
const LessonPage            = lazy(() => import('@features/learning/pages/LessonPage.jsx'));
const ArticlePage           = lazy(() => import('@features/learning/pages/ArticlePage.jsx'));
const ResourcesPage         = lazy(() => import('@features/resources/pages/ResourcesPage.jsx'));
const ResourceDetailPage     = lazy(() => import('@features/resources/pages/ResourceDetailPage.jsx'));
const CommunityPage         = lazy(() => import('@features/communities/pages/CommunityPage.jsx'));
const CommunityDetailPage   = lazy(() => import('@features/communities/pages/CommunityDetailPage.jsx'));
const CreateCommunityPage   = lazy(() => import('@features/communities/pages/CreateCommunity.jsx'));
const CommunitySettingsPage = lazy(() => import('@features/communities/pages/CommunitySettings.jsx'));
const SessionsPage          = lazy(() => import('@features/sessions/pages/SessionsPage.jsx'));
const SessionDetailPage    = lazy(() => import('@features/sessions/pages/SessionDetailPage.jsx'));
const LiveSessionPage       = lazy(() => import('@features/sessions/pages/LiveSession.jsx'));
const EventsPage            = lazy(() => import('@features/events/pages/EventsPage.jsx'));
const EventDetailPage      = lazy(() => import('@features/events/pages/EventDetailPage.jsx'));
const CodexPage             = lazy(() => import('@features/codex/pages/CodexPage.jsx'));
const CreateWorkspacePage   = lazy(() => import('@features/codex/pages/CreateWorkspace.jsx'));
const WorkspacePage         = lazy(() => import('@features/codex/pages/WorkspacePage.jsx'));
const SandboxPage           = lazy(() => import('@features/sandbox/pages/SandboxPage.jsx'));
const SandboxProjectPage   = lazy(() => import('@features/sandbox/pages/SandboxProjectPage.jsx'));
const CloudWorkspaceView    = lazy(() => import('@features/workspace/pages/CloudWorkspaceView.jsx'));
const WebIDEPage            = lazy(() => import('@features/ide/WebIDE.jsx'));
const TestsPage             = lazy(() => import('@features/tests/pages/TestsPage.jsx'));
const TestDetailPage       = lazy(() => import('@features/tests/pages/TestDetailPage.jsx'));
const TestAttemptPage      = lazy(() => import('@features/tests/pages/TestAttemptPage.jsx'));
const TestResultsPage      = lazy(() => import('@features/tests/pages/TestResultsPage.jsx'));
const ProfilePage           = lazy(() => import('@features/profile/pages/ProfilePage.jsx'));
const PublicProfilePage     = lazy(() => import('@features/profile/pages/PublicProfilePage.jsx'));
const NotificationsPage     = lazy(() => import('@features/notifications/pages/NotificationsPage.jsx'));
const SubscriptionPage      = lazy(() => import('@features/subscription/pages/SubscriptionPage.jsx'));
const BillingPage           = lazy(() => import('@features/subscription/pages/BillingPage.jsx'));
const SettingsPage          = lazy(() => import('@features/settings/pages/SettingsPage.jsx'));

// ─── DSA Learning Path pages (Lazily loaded) ──────────────────────────────────
const DSARoadmapPage      = lazy(() => import('@features/dsa/pages/DSARoadmapPage.jsx'));
const DSATopicPage        = lazy(() => import('@features/dsa/pages/DSATopicPage.jsx'));
const DSAProblemPage      = lazy(() => import('@features/dsa/pages/DSAProblemPage.jsx'));
const DSAProgressPage     = lazy(() => import('@features/dsa/pages/DSAProgressPage.jsx'));
const DSARevisionPage     = lazy(() => import('@features/dsa/pages/DSARevisionPage.jsx'));
const DSABookmarksPage    = lazy(() => import('@features/dsa/pages/DSABookmarksPage.jsx'));
const DSASearchPage       = lazy(() => import('@features/dsa/pages/DSASearchPage.jsx'));
const DSAPatternPage      = lazy(() => import('@features/dsa/pages/DSAPatternPage.jsx'));
const DSAAchievementsPage = lazy(() => import('@features/dsa/pages/DSAAchievementsPage.jsx'));

const InstructorApplyPage= lazy(() => import('@features/instructor/pages/InstructorApply.jsx'));

// ─── Instructor pages ─────────────────────────────────────────────────────────
const InstructorDashboard     = lazy(() => import('@features/instructor/pages/InstructorDashboard.jsx'));
const InstructorCourses       = lazy(() => import('@features/instructor/pages/InstructorCourses.jsx'));
const InstructorLearningPaths = lazy(() => import('@features/instructor/pages/InstructorLearningPaths.jsx'));
const InstructorSandbox       = lazy(() => import('@features/instructor/pages/InstructorSandbox.jsx'));
const InstructorStudents      = lazy(() => import('@features/instructor/pages/InstructorStudents.jsx'));
const InstructorSessions      = lazy(() => import('@features/instructor/pages/InstructorSessions.jsx'));
const InstructorAssignments   = lazy(() => import('@features/instructor/pages/InstructorAssignments.jsx'));
const InstructorAssessments   = lazy(() => import('@features/instructor/pages/InstructorAssessments.jsx'));
const InstructorCertificates  = lazy(() => import('@features/instructor/pages/InstructorCertificates.jsx'));
const InstructorCommunities   = lazy(() => import('@features/instructor/pages/InstructorCommunities.jsx'));
const InstructorAnalytics     = lazy(() => import('@features/instructor/pages/InstructorAnalytics.jsx'));
const InstructorResources     = lazy(() => import('@features/instructor/pages/InstructorResources.jsx'));
const InstructorSettings      = lazy(() => import('@features/instructor/pages/InstructorSettings.jsx'));
const InstructorModulePlaceholder = lazy(() => import('@features/instructor/pages/InstructorModulePlaceholder.jsx'));

// ─── Admin pages ──────────────────────────────────────────────────────────────
const AdminDashboard     = lazy(() => import('@features/admin/pages/AdminDashboard.jsx'));
const AdminUsers         = lazy(() => import('@features/admin/pages/AdminUsers.jsx'));
const AdminUserDetail    = lazy(() => import('@features/admin/pages/AdminUserDetail.jsx'));
const AdminInstructors   = lazy(() => import('@features/admin/pages/AdminInstructors.jsx'));
const AdminContent       = lazy(() => import('@features/admin/pages/AdminContent.jsx'));
const AdminLearning      = lazy(() => import('@features/admin/pages/AdminLearning.jsx'));
const AdminSandbox       = lazy(() => import('@features/admin/pages/AdminSandbox.jsx'));
const AdminCodex         = lazy(() => import('@features/admin/pages/AdminCodex.jsx'));
const AdminSubscriptions = lazy(() => import('@features/admin/pages/AdminSubscriptions.jsx'));
const AdminPayments      = lazy(() => import('@features/admin/pages/AdminPayments.jsx'));
const AdminReports       = lazy(() => import('@features/admin/pages/AdminReports.jsx'));
const AdminModeration    = lazy(() => import('@features/admin/pages/AdminModeration.jsx'));
const AdminSettings      = lazy(() => import('@features/admin/pages/AdminSettings.jsx'));
const AdminAnalytics     = lazy(() => import('@features/admin/pages/AdminAnalytics.jsx'));
const AdminAuditLogs     = lazy(() => import('@features/admin/pages/AdminAuditLogs.jsx'));
const AdminAnnouncements = lazy(() => import('@features/admin/pages/AdminAnnouncements.jsx'));
const AdminFeatures      = lazy(() => import('@features/admin/pages/AdminFeatures.jsx'));
const AdminHealth        = lazy(() => import('@features/admin/pages/AdminHealth.jsx'));
const AdminSessions      = lazy(() => import('@features/admin/pages/AdminSessions.jsx'));
const AdminTests         = lazy(() => import('@features/admin/pages/AdminTests.jsx'));
const AdminResources     = lazy(() => import('@features/admin/pages/AdminResources.jsx'));
const AdminCommunities   = lazy(() => import('@features/admin/pages/AdminCommunities.jsx'));
const AdminEvents        = lazy(() => import('@features/admin/pages/AdminEvents.jsx'));
const AdminModulePlaceholder = lazy(() => import('@features/admin/pages/AdminModulePlaceholder.jsx'));

// ─── Error pages ──────────────────────────────────────────────────────────────
const NotFoundPage   = lazy(() => import('@features/landing/pages/NotFoundPage.jsx'));
const ServerErrorPage= lazy(() => import('@features/landing/pages/ServerErrorPage.jsx'));
const MaintenancePage= lazy(() => import('@features/landing/pages/MaintenancePage.jsx'));
const ComingSoonPage = lazy(() => import('@features/landing/pages/ComingSoonPage.jsx'));

// ─── Helpers ──────────────────────────────────────────────────────────────────
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '@features/auth/redux/authSelectors.js';

const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated) ?? false;
  const user = useSelector(selectCurrentUser) ?? null;
  return { isAuthenticated, user };
};

const W = ({ children }) => <LoadingRoute>{children}</LoadingRoute>;

/**
 * AppRoutes — the complete React Router v6 route tree.
 *
 * Structure:
 *   PublicLayout    → landing + legal
 *   AuthLayout      → guest-only auth pages
 *   DashboardLayout → authenticated student area
 *   InstructorLayout→ instructor-only area
 *   AdminLayout     → admin-only area
 *   ErrorLayout     → 404 / 500 / maintenance
 *   EmptyLayout     → blank-canvas pages
 */
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>

      {/* ── Public / Landing ─────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME}           element={<W><LandingPage /></W>} />
        <Route path={ROUTES.ABOUT}          element={<W><AboutPage /></W>} />
        <Route path={ROUTES.PRICING}        element={<W><PricingPage /></W>} />
        <Route path={ROUTES.FEATURES}       element={<W><FeaturesPage /></W>} />
        <Route path={ROUTES.CONTACT}        element={<W><ContactPage /></W>} />
        <Route path={ROUTES.PRIVACY}        element={<W><PrivacyPage /></W>} />
        <Route path={ROUTES.TERMS}          element={<W><TermsPage /></W>} />
        <Route path={ROUTES.COOKIE_POLICY}  element={<W><CookiesPage /></W>} />
      </Route>

      {/* ── Auth (guest only) ─────────────────────────────────────────────── */}
      <Route
        element={
          <GuestGuard isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </GuestGuard>
        }
      >
        <Route path={ROUTES.LOGIN}           element={<W><LoginPage /></W>} />
        <Route path={ROUTES.REGISTER}        element={<W><RegisterPage /></W>} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<W><ForgotPasswordPage /></W>} />
        <Route path={ROUTES.RESET_PASSWORD}  element={<W><ResetPasswordPage /></W>} />
        <Route path={ROUTES.VERIFY_EMAIL}    element={<W><VerifyEmailPage /></W>} />
      </Route>

      {/* ── Student Dashboard (authenticated) ───────────────────────────── */}
      <Route
        element={
          <RouteGuard isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </RouteGuard>
        }
      >
        <Route path={ROUTES.DASHBOARD}         element={<W><DashboardPage /></W>} />
        <Route path={ROUTES.LEADERBOARD}       element={<W><LeaderboardPage /></W>} />

        {/* Learning */}
        <Route path={ROUTES.LEARNING}          element={<W><LearningPage /></W>} />
        <Route path={ROUTES.LEARNING_PATH}     element={<W><LearningPathPage /></W>} />
        <Route path={ROUTES.LEARNING_LESSON}   element={<W><LessonPage /></W>} />

        {/* DSA Learning Path */}
        <Route path={ROUTES.DSA_ROADMAP}      element={<W><DSARoadmapPage /></W>} />
        <Route path={ROUTES.DSA_TOPIC}        element={<W><DSATopicPage /></W>} />
        <Route path={ROUTES.DSA_PROGRESS}     element={<W><DSAProgressPage /></W>} />
        <Route path={ROUTES.DSA_REVISION}     element={<W><DSARevisionPage /></W>} />
        <Route path={ROUTES.DSA_BOOKMARKS}    element={<W><DSABookmarksPage /></W>} />
        <Route path={ROUTES.DSA_SEARCH}       element={<W><DSASearchPage /></W>} />
        <Route path={ROUTES.DSA_PATTERNS}     element={<W><DSAPatternPage /></W>} />
        <Route path={ROUTES.DSA_ACHIEVEMENTS} element={<W><DSAAchievementsPage /></W>} />

        {/* Resources */}
        <Route path={ROUTES.RESOURCES}         element={<W><ResourcesPage /></W>} />
        <Route path={ROUTES.RESOURCE_DETAIL}   element={<W><ResourceDetailPage /></W>} />

        {/* Community */}
        <Route path={ROUTES.COMMUNITY}          element={<W><CommunityPage /></W>} />
        <Route path={ROUTES.COMMUNITY_CREATE}   element={<W><CreateCommunityPage /></W>} />
        <Route path={ROUTES.COMMUNITY_DETAIL}   element={<W><CommunityDetailPage /></W>} />
        <Route path={ROUTES.COMMUNITY_SETTINGS} element={<W><CommunitySettingsPage /></W>} />

        {/* Sessions */}
        <Route path={ROUTES.SESSIONS}          element={<W><SessionsPage /></W>} />
        <Route path={ROUTES.SESSION_DETAIL}    element={<W><SessionDetailPage /></W>} />
        <Route path={ROUTES.SESSION_LIVE}      element={<W><LiveSessionPage /></W>} />

        {/* Events */}
        <Route path={ROUTES.EVENTS}            element={<W><EventsPage /></W>} />
        <Route path={ROUTES.EVENT_DETAIL}      element={<W><EventDetailPage /></W>} />

        {/* Codex */}
        <Route path={ROUTES.CODEX}             element={<W><CodexPage /></W>} />
        <Route path={ROUTES.CODEX_CREATE}      element={<W><CreateWorkspacePage /></W>} />
        <Route path={ROUTES.WORKSPACE}         element={<W><WorkspacePage /></W>} />

        {/* Sandbox & Web IDE */}
        <Route path={ROUTES.SANDBOX}           element={<W><SandboxPage /></W>} />
        <Route path={ROUTES.SANDBOX_PROJECT}   element={<W><SandboxProjectPage /></W>} />
        <Route path="/vscode/:projectId"       element={<W><SandboxProjectPage /></W>} />
        <Route path={ROUTES.IDE}               element={<W><WebIDEPage /></W>} />

        {/* Tests */}
        <Route path={ROUTES.TESTS}             element={<W><TestsPage /></W>} />
        <Route path={ROUTES.TEST_DETAIL}       element={<W><TestDetailPage /></W>} />
        <Route path={ROUTES.TEST_ATTEMPT}      element={<W><TestAttemptPage /></W>} />
        <Route path={ROUTES.TEST_RESULTS}      element={<W><TestResultsPage /></W>} />

        {/* Profile & Notifications */}
        <Route path={ROUTES.PROFILE}           element={<W><ProfilePage /></W>} />
        <Route path={ROUTES.NOTIFICATIONS}     element={<W><NotificationsPage /></W>} />

        {/* Subscription */}
        <Route path={ROUTES.SUBSCRIPTION}      element={<W><SubscriptionPage /></W>} />
        <Route path={ROUTES.BILLING}           element={<W><BillingPage /></W>} />

        {/* Settings */}
        <Route path={ROUTES.SETTINGS}          element={<W><SettingsPage /></W>} />
        <Route path={ROUTES.PROFILE_PUBLIC}    element={<W><PublicProfilePage /></W>} />

        {/* Instructor application (any auth user) */}
        <Route path={ROUTES.INSTRUCTOR_APPLY}  element={<W><InstructorApplyPage /></W>} />
      </Route>

      {/* ── Instructor Panel ──────────────────────────────────────────────── */}
      <Route
        element={
          <RouteGuard isAuthenticated={isAuthenticated}>
            <PermissionGuard user={user} allowedRoles={['instructor', 'admin']}>
              <InstructorLayout />
            </PermissionGuard>
          </RouteGuard>
        }
      >
        <Route path={ROUTES.INSTRUCTOR_DASHBOARD}      element={<W><InstructorDashboard /></W>} />
        <Route path={ROUTES.INSTRUCTOR_COURSES}        element={<W><InstructorCourses /></W>} />
        <Route path={ROUTES.INSTRUCTOR_LEARNING_PATHS} element={<W><InstructorLearningPaths /></W>} />
        <Route path={ROUTES.INSTRUCTOR_SANDBOX}        element={<W><InstructorSandbox /></W>} />
        <Route path={ROUTES.INSTRUCTOR_STUDENTS}       element={<W><InstructorStudents /></W>} />
        <Route path={ROUTES.INSTRUCTOR_SESSIONS}       element={<W><InstructorSessions /></W>} />
        <Route path={ROUTES.INSTRUCTOR_ASSIGNMENTS}    element={<W><InstructorAssignments /></W>} />
        <Route path={ROUTES.INSTRUCTOR_ASSESSMENTS}    element={<W><InstructorAssessments /></W>} />
        <Route path={ROUTES.INSTRUCTOR_CERTIFICATES}   element={<W><InstructorCertificates /></W>} />
        <Route path={ROUTES.INSTRUCTOR_COMMUNITIES}    element={<W><InstructorCommunities /></W>} />
        <Route path={ROUTES.INSTRUCTOR_ANALYTICS}      element={<W><InstructorAnalytics /></W>} />
        <Route path={ROUTES.INSTRUCTOR_RESOURCES}      element={<W><InstructorResources /></W>} />
        <Route path={ROUTES.INSTRUCTOR_SETTINGS}       element={<W><InstructorSettings /></W>} />
      </Route>

      {/* ── Admin Panel ───────────────────────────────────────────────────── */}
      <Route
        element={
          <RouteGuard isAuthenticated={isAuthenticated}>
            <PermissionGuard user={user} allowedRoles={['admin']}>
              <AdminLayout />
            </PermissionGuard>
          </RouteGuard>
        }
      >
        <Route path={ROUTES.ADMIN_DASHBOARD}     element={<W><AdminDashboard /></W>} />
        <Route path={ROUTES.ADMIN_USERS}         element={<W><AdminUsers /></W>} />
        <Route path={ROUTES.ADMIN_USER_DETAIL}   element={<W><AdminUserDetail /></W>} />
        <Route path={ROUTES.ADMIN_INSTRUCTORS}   element={<W><AdminInstructors /></W>} />
        <Route path={ROUTES.ADMIN_CONTENT}       element={<W><AdminContent /></W>} />
        <Route path={ROUTES.ADMIN_LEARNING}      element={<W><AdminLearning /></W>} />
        <Route path={ROUTES.ADMIN_RESOURCES}     element={<W><AdminResources /></W>} />
        <Route path={ROUTES.ADMIN_COMMUNITIES}   element={<W><AdminCommunities /></W>} />
        <Route path={ROUTES.ADMIN_SESSIONS}      element={<W><AdminSessions /></W>} />
        <Route path={ROUTES.ADMIN_EVENTS}        element={<W><AdminEvents /></W>} />
        <Route path={ROUTES.ADMIN_SANDBOX}       element={<W><AdminSandbox /></W>} />
        <Route path={ROUTES.ADMIN_CODEX}         element={<W><AdminCodex /></W>} />
        <Route path={ROUTES.ADMIN_TESTS}         element={<W><AdminTests /></W>} />
        <Route path={ROUTES.ADMIN_SUBSCRIPTIONS} element={<W><AdminSubscriptions /></W>} />
        <Route path={ROUTES.ADMIN_PAYMENTS}      element={<W><AdminPayments /></W>} />
        <Route path={ROUTES.ADMIN_REPORTS}       element={<W><AdminReports /></W>} />
        <Route path={ROUTES.ADMIN_MODERATION}    element={<W><AdminModeration /></W>} />
        <Route path={ROUTES.ADMIN_SETTINGS}      element={<W><AdminSettings /></W>} />
        <Route path={ROUTES.ADMIN_ANALYTICS}     element={<W><AdminAnalytics /></W>} />
        <Route path={ROUTES.ADMIN_AUDIT_LOGS}    element={<W><AdminAuditLogs /></W>} />
        <Route path={ROUTES.ADMIN_ANNOUNCEMENTS} element={<W><AdminAnnouncements /></W>} />
        <Route path={ROUTES.ADMIN_FEATURES}      element={<W><AdminFeatures /></W>} />
        <Route path={ROUTES.ADMIN_HEALTH}        element={<W><AdminHealth /></W>} />
      </Route>

      {/* ── Error / utility pages ─────────────────────────────────────────── */}
      <Route element={<ErrorLayout />}>
        <Route path={ROUTES.NOT_FOUND}   element={<W><NotFoundPage /></W>} />
        <Route path={ROUTES.SERVER_ERROR}element={<W><ServerErrorPage /></W>} />
        <Route path={ROUTES.MAINTENANCE} element={<W><MaintenancePage /></W>} />
      </Route>

      <Route element={<EmptyLayout />}>
        <Route path={ROUTES.COMING_SOON} element={<W><ComingSoonPage /></W>} />
        <Route path={ROUTES.DSA_PROBLEM} element={<W><DSAProblemPage /></W>} />
      </Route>

      {/* ── Redirect /admin → /admin/dashboard ───────────────────────────── */}
      <Route path="/admin" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />

      {/* ── Redirect /instructor → /instructor/dashboard ─────────────────── */}
      <Route path="/instructor" element={<Navigate to={ROUTES.INSTRUCTOR_DASHBOARD} replace />} />

      {/* ── Cloud Workspace / Code Server Full-Screen IDE View ────────────────── */}
      <Route element={<EmptyLayout />}>
        <Route path="/code-server" element={<W><CloudWorkspaceView /></W>} />
        <Route path="/code-server/:workspaceId" element={<W><CloudWorkspaceView /></W>} />
        <Route path="/workspace/:workspaceId" element={<W><CloudWorkspaceView /></W>} />
        <Route path="/learning/:courseId/lesson/:lessonId/practice" element={<W><CloudWorkspaceView /></W>} />
        <Route path="/learning/:courseId/module/:moduleId/lesson/:lessonId/practice" element={<W><CloudWorkspaceView /></W>} />
        <Route path={ROUTES.LEARNING_ARTICLE} element={<W><ArticlePage /></W>} />
      </Route>

      {/* ── Catch-all 404 ────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />

    </Routes>
  );
};

export default AppRoutes;
