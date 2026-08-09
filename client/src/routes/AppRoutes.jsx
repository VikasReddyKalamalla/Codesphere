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

// ─── Student dashboard pages (Statically imported for 100% stability) ─────────
import DashboardPage from '@features/dashboard/pages/DashboardPage.jsx';
import LearningPage from '@features/learning/pages/LearningPage.jsx';
import LearningPathPage from '@features/learning/pages/LearningPathPage.jsx';
import LessonPage from '@features/learning/pages/LessonPage.jsx';
import ArticlePage from '@features/learning/pages/ArticlePage.jsx';
import ResourcesPage from '@features/resources/pages/ResourcesPage.jsx';
import ResourceDetailPage from '@features/resources/pages/ResourceDetailPage.jsx';
import CommunityPage from '@features/communities/pages/CommunityPage.jsx';
import CommunityDetailPage from '@features/communities/pages/CommunityDetailPage.jsx';
import CreateCommunityPage from '@features/communities/pages/CreateCommunity.jsx';
import CommunitySettingsPage from '@features/communities/pages/CommunitySettings.jsx';
import SessionsPage from '@features/sessions/pages/SessionsPage.jsx';
import SessionDetailPage from '@features/sessions/pages/SessionDetailPage.jsx';
import LiveSessionPage from '@features/sessions/pages/LiveSession.jsx';
import EventsPage from '@features/events/pages/EventsPage.jsx';
import EventDetailPage from '@features/events/pages/EventDetailPage.jsx';
import CodexPage from '@features/codex/pages/CodexPage.jsx';
import CreateWorkspacePage from '@features/codex/pages/CreateWorkspace.jsx';
import WorkspacePage from '@features/codex/pages/WorkspacePage.jsx';
import SandboxPage from '@features/sandbox/pages/SandboxPage.jsx';
import SandboxProjectPage from '@features/sandbox/pages/SandboxProjectPage.jsx';
import CloudWorkspaceView from '@features/workspace/pages/CloudWorkspaceView.jsx';
import WebIDEPage from '@features/ide/WebIDE.jsx';
import TestsPage from '@features/tests/pages/TestsPage.jsx';
import TestDetailPage from '@features/tests/pages/TestDetailPage.jsx';
import TestAttemptPage from '@features/tests/pages/TestAttemptPage.jsx';
import TestResultsPage from '@features/tests/pages/TestResultsPage.jsx';
import ProfilePage from '@features/profile/pages/ProfilePage.jsx';
import PublicProfilePage from '@features/profile/pages/PublicProfilePage.jsx';
import NotificationsPage from '@features/notifications/pages/NotificationsPage.jsx';
import SubscriptionPage from '@features/subscription/pages/SubscriptionPage.jsx';
import BillingPage from '@features/subscription/pages/BillingPage.jsx';
import SettingsPage from '@features/settings/pages/SettingsPage.jsx';

// ─── DSA Learning Path pages ──────────────────────────────────────────────────
import {
  DSARoadmapPage,
  DSATopicPage,
  DSAProblemPage,
  DSAProgressPage,
  DSARevisionPage,
  DSABookmarksPage,
  DSASearchPage,
  DSAPatternPage,
  DSAAchievementsPage,
} from '@features/dsa';

const InstructorApplyPage= lazy(() => import('@features/instructor/pages/InstructorApply.jsx'));

// ─── Instructor pages ─────────────────────────────────────────────────────────
const InstructorDashboard    = lazy(() => import('@features/instructor/pages/InstructorDashboard.jsx'));
const InstructorCourses      = lazy(() => import('@features/instructor/pages/InstructorCourses.jsx'));
const InstructorSandbox      = lazy(() => import('@features/instructor/pages/InstructorSandbox.jsx'));
const InstructorStudents     = lazy(() => import('@features/instructor/pages/InstructorStudents.jsx'));
const InstructorSessions     = lazy(() => import('@features/instructor/pages/InstructorSessions.jsx'));
const InstructorAnalytics    = lazy(() => import('@features/instructor/pages/InstructorAnalytics.jsx'));
const InstructorCertificates = lazy(() => import('@features/instructor/pages/InstructorCertificates.jsx'));
const InstructorModulePlaceholder = lazy(() => import('@features/instructor/pages/InstructorModulePlaceholder.jsx'));

// ─── Admin pages ──────────────────────────────────────────────────────────────
const AdminDashboard     = lazy(() => import('@features/admin/pages/AdminDashboard.jsx'));
const AdminUsers         = lazy(() => import('@features/admin/pages/AdminUsers.jsx'));
const AdminUserDetail    = lazy(() => import('@features/admin/pages/AdminUserDetail.jsx'));
const AdminInstructors   = lazy(() => import('@features/admin/pages/AdminInstructors.jsx'));
const AdminContent       = lazy(() => import('@features/admin/pages/AdminContent.jsx'));
const AdminLearning      = lazy(() => import('@features/admin/pages/AdminLearning.jsx'));
const AdminReports       = lazy(() => import('@features/admin/pages/AdminReports.jsx'));
const AdminModeration    = lazy(() => import('@features/admin/pages/AdminModeration.jsx'));
const AdminSettings      = lazy(() => import('@features/admin/pages/AdminSettings.jsx'));
const AdminAnalytics     = lazy(() => import('@features/admin/pages/AdminAnalytics.jsx'));
const AdminAuditLogs     = lazy(() => import('@features/admin/pages/AdminAuditLogs.jsx'));
const AdminAnnouncements = lazy(() => import('@features/admin/pages/AdminAnnouncements.jsx'));
const AdminFeatures      = lazy(() => import('@features/admin/pages/AdminFeatures.jsx'));
const AdminHealth        = lazy(() => import('@features/admin/pages/AdminHealth.jsx'));
const AdminSessions      = lazy(() => import('@features/admin/pages/AdminSessions.jsx'));
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
        <Route path={ROUTES.INSTRUCTOR_LEARNING_PATHS} element={<W><InstructorModulePlaceholder section="learning-paths" /></W>} />
        <Route path={ROUTES.INSTRUCTOR_SANDBOX}        element={<W><InstructorSandbox /></W>} />
        <Route path={ROUTES.INSTRUCTOR_STUDENTS}       element={<W><InstructorStudents /></W>} />
        <Route path={ROUTES.INSTRUCTOR_SESSIONS}       element={<W><InstructorSessions /></W>} />
        <Route path={ROUTES.INSTRUCTOR_ASSIGNMENTS}    element={<W><InstructorModulePlaceholder section="assignments" /></W>} />
        <Route path={ROUTES.INSTRUCTOR_ASSESSMENTS}    element={<W><InstructorModulePlaceholder section="assessments" /></W>} />
        <Route path={ROUTES.INSTRUCTOR_CERTIFICATES}   element={<W><InstructorCertificates /></W>} />
        <Route path={ROUTES.INSTRUCTOR_COMMUNITIES}    element={<W><InstructorModulePlaceholder section="communities" /></W>} />
        <Route path={ROUTES.INSTRUCTOR_ANALYTICS}      element={<W><InstructorAnalytics /></W>} />
        <Route path={ROUTES.INSTRUCTOR_RESOURCES}      element={<W><InstructorModulePlaceholder section="resources" /></W>} />
        <Route path={ROUTES.INSTRUCTOR_SETTINGS}       element={<W><InstructorModulePlaceholder section="settings" /></W>} />
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
        <Route path={ROUTES.ADMIN_RESOURCES}     element={<W><AdminModulePlaceholder section="resources" /></W>} />
        <Route path={ROUTES.ADMIN_COMMUNITIES}   element={<W><AdminModulePlaceholder section="communities" /></W>} />
        <Route path={ROUTES.ADMIN_SESSIONS}      element={<W><AdminSessions /></W>} />
        <Route path={ROUTES.ADMIN_EVENTS}        element={<W><AdminModulePlaceholder section="events" /></W>} />
        <Route path={ROUTES.ADMIN_SANDBOX}       element={<W><AdminModulePlaceholder section="sandbox" /></W>} />
        <Route path={ROUTES.ADMIN_CODEX}         element={<W><AdminModulePlaceholder section="codex" /></W>} />
        <Route path={ROUTES.ADMIN_TESTS}         element={<W><AdminModulePlaceholder section="tests" /></W>} />
        <Route path={ROUTES.ADMIN_SUBSCRIPTIONS} element={<W><AdminModulePlaceholder section="subscriptions" /></W>} />
        <Route path={ROUTES.ADMIN_PAYMENTS}      element={<W><AdminModulePlaceholder section="payments" /></W>} />
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
