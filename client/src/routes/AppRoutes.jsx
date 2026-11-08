import React from 'react';
import lazy from '@utils/lazyWithRetry.js';
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

// ─── Core Student Pages (Statically imported for instant 0ms load and zero loading screens)
import LoginPage          from '@features/auth/pages/Login.jsx';
import RegisterPage       from '@features/auth/pages/Register.jsx';
import ForgotPasswordPage from '@features/auth/pages/ForgotPassword.jsx';
import ResetPasswordPage  from '@features/auth/pages/ResetPassword.jsx';
import VerifyEmailPage    from '@features/auth/pages/VerifyEmail.jsx';
import LandingPage        from '@features/landing/pages/Home.jsx';
import DashboardPage      from '@features/dashboard/pages/DashboardPage.jsx';
import LeaderboardPage    from '@features/leaderboard/pages/LeaderboardPage.jsx';
import LearningPage       from '@features/learning/pages/Learning.jsx';
import SandboxPage        from '@features/sandbox/pages/Sandbox.jsx';
import CodexPage          from '@features/codex/pages/CodexPage.jsx';
import CommunityPage      from '@features/communities/pages/Communities.jsx';
import SessionsPage       from '@features/sessions/pages/Sessions.jsx';
import EventsPage         from '@features/events/pages/Events.jsx';
import ResourcesPage      from '@features/resources/pages/Resources.jsx';
import TestsPage          from '@features/tests/pages/Tests.jsx';
import ProfilePage        from '@features/profile/pages/Profile.jsx';
import SubscriptionPage   from '@features/subscription/pages/Subscription.jsx';
import BillingPage        from '@features/subscription/pages/Billing.jsx';
import SettingsPage       from '@features/settings/pages/Settings.jsx';
import NotificationsPage  from '@features/notifications/pages/Notifications.jsx';
import PublicProfilePage  from '@features/profile/pages/PublicProfilePage.jsx';

// ─── Landing / public pages (Lazy loaded with zero-delay fallback) ───────────────
const AboutPage     = lazy(() => import('@features/landing/pages/About.jsx'));
const PricingPage   = lazy(() => import('@features/landing/pages/Pricing.jsx'));
const FeaturesPage  = lazy(() => import('@features/landing/pages/FeaturesPage.jsx'));
const ContactPage   = lazy(() => import('@features/landing/pages/Contact.jsx'));
const PrivacyPage   = lazy(() => import('@features/legal/pages/PrivacyPolicy.jsx'));
const TermsPage     = lazy(() => import('@features/legal/pages/TermsOfService.jsx'));
const CookiesPage   = lazy(() => import('@features/legal/pages/CookiePolicy.jsx'));

// ─── Secondary sub-pages (Lazy loaded with zero-delay fallback) ──────────────────
const LearningPathPage      = lazy(() => import('@features/learning/pages/LearningDetails.jsx'));
const LessonPage            = lazy(() => import('@features/learning/pages/LessonViewer.jsx'));
const ArticlePage           = lazy(() => import('@features/learning/pages/ArticlePage.jsx'));
const ResourceDetailPage     = lazy(() => import('@features/resources/pages/ResourceDetails.jsx'));
const CommunityDetailPage   = lazy(() => import('@features/communities/pages/CommunityDetails.jsx'));
const CreateCommunityPage   = lazy(() => import('@features/communities/pages/CreateCommunity.jsx'));
const CommunitySettingsPage = lazy(() => import('@features/communities/pages/CommunitySettings.jsx'));
const SessionDetailPage    = lazy(() => import('@features/sessions/pages/SessionDetails.jsx'));
const LiveSessionPage       = lazy(() => import('@features/sessions/pages/LiveSession.jsx'));
const EventDetailPage      = lazy(() => import('@features/events/pages/EventDetails.jsx'));
const CreateWorkspacePage   = lazy(() => import('@features/codex/pages/CreateWorkspace.jsx'));
const WorkspacePage         = lazy(() => import('@features/codex/pages/WorkspacePage.jsx'));
const SandboxProjectPage   = lazy(() => import('@features/sandbox/pages/SandboxProject.jsx'));
const CloudWorkspaceView    = lazy(() => import('@features/workspace/pages/CloudWorkspaceView.jsx'));
const WebIDEPage            = lazy(() => import('@features/ide/WebIDE.jsx'));
const TestDetailPage       = lazy(() => import('@features/tests/pages/TestDetails.jsx'));
const TestAttemptPage      = lazy(() => import('@features/tests/pages/TestAttempt.jsx'));
const TestResultsPage      = lazy(() => import('@features/tests/pages/TestResults.jsx'));

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

const InstructorApplyPage = lazy(() => import('@features/instructor/pages/InstructorApply.jsx'));

// ─── Instructor pages ─────────────────────────────────────────────────────────
const InstructorDashboard     = lazy(() => import('@features/instructor/pages/InstructorDashboard.jsx'));
const InstructorCourses       = lazy(() => import('@features/instructor/pages/Courses.jsx'));
const InstructorLearningPaths = lazy(() => import('@features/instructor/pages/InstructorLearningPaths.jsx'));
const InstructorSandbox       = lazy(() => import('@features/instructor/pages/InstructorSandbox.jsx'));
const InstructorStudents      = lazy(() => import('@features/instructor/pages/Students.jsx'));
const InstructorSessions      = lazy(() => import('@features/instructor/pages/InstructorSessions.jsx'));
const InstructorAssignments   = lazy(() => import('@features/instructor/pages/InstructorAssignments.jsx'));
const InstructorAssessments   = lazy(() => import('@features/instructor/pages/InstructorAssessments.jsx'));
const InstructorCertificates  = lazy(() => import('@features/instructor/pages/InstructorCertificates.jsx'));
const InstructorCommunities   = lazy(() => import('@features/instructor/pages/InstructorCommunities.jsx'));
const InstructorAnalytics     = lazy(() => import('@features/instructor/pages/Analytics.jsx'));
const InstructorResources     = lazy(() => import('@features/instructor/pages/InstructorResources.jsx'));
const InstructorSettings      = lazy(() => import('@features/instructor/pages/InstructorSettings.jsx'));

// ─── Admin pages ──────────────────────────────────────────────────────────────
const AdminDashboard     = lazy(() => import('@features/admin/pages/AdminDashboard.jsx'));
const AdminUsers         = lazy(() => import('@features/admin/pages/Users.jsx'));
const AdminUserDetail    = lazy(() => import('@features/admin/pages/AdminUserDetail.jsx'));
const AdminInstructors   = lazy(() => import('@features/admin/pages/InstructorRequests.jsx'));
const AdminContent       = lazy(() => import('@features/admin/pages/AdminContent.jsx'));
const AdminLearning      = lazy(() => import('@features/admin/pages/AdminLearning.jsx'));
const AdminSandbox       = lazy(() => import('@features/admin/pages/AdminSandbox.jsx'));
const AdminCodex         = lazy(() => import('@features/admin/pages/AdminCodex.jsx'));
const AdminSubscriptions = lazy(() => import('@features/admin/pages/AdminSubscriptions.jsx'));
const AdminPayments      = lazy(() => import('@features/admin/pages/AdminPayments.jsx'));
const AdminReports       = lazy(() => import('@features/admin/pages/Reports.jsx'));
const AdminModeration    = lazy(() => import('@features/admin/pages/Moderation.jsx'));
const AdminSettings      = lazy(() => import('@features/admin/pages/PlatformSettings.jsx'));
const AdminAnalytics     = lazy(() => import('@features/admin/pages/Analytics.jsx'));
const AdminAuditLogs     = lazy(() => import('@features/admin/pages/AuditLogs.jsx'));
const AdminAnnouncements = lazy(() => import('@features/admin/pages/AdminAnnouncements.jsx'));
const AdminFeatures      = lazy(() => import('@features/admin/pages/AdminFeatures.jsx'));
const AdminHealth        = lazy(() => import('@features/admin/pages/AdminHealth.jsx'));
const AdminSessions      = lazy(() => import('@features/admin/pages/AdminSessions.jsx'));
const AdminTests         = lazy(() => import('@features/admin/pages/AdminTests.jsx'));
const AdminResources     = lazy(() => import('@features/admin/pages/AdminResources.jsx'));
const AdminCommunities   = lazy(() => import('@features/admin/pages/AdminCommunities.jsx'));
const AdminEvents        = lazy(() => import('@features/admin/pages/AdminEvents.jsx'));

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

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>

      {/* ── Public / Landing ─────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME}           element={<LandingPage />} />
        <Route path={ROUTES.ABOUT}          element={<W><AboutPage /></W>} />
        <Route path={ROUTES.PRICING}        element={<W><PricingPage /></W>} />
        <Route path={ROUTES.FEATURES}       element={<W><FeaturesPage /></W>} />
        <Route path={ROUTES.CONTACT}        element={<W><ContactPage /></W>} />
        <Route path={ROUTES.PRIVACY}        element={<W><PrivacyPage /></W>} />
        <Route path={ROUTES.TERMS}          element={<W><TermsPage /></W>} />
        <Route path={ROUTES.COOKIE_POLICY}  element={<W><CookiesPage /></W>} />
      </Route>

      {/* ── Auth (guest only) — Immediate static render ──────────────────── */}
      <Route
        element={
          <GuestGuard isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </GuestGuard>
        }
      >
        <Route path={ROUTES.LOGIN}           element={<LoginPage />} />
        <Route path={ROUTES.REGISTER}        element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD}  element={<ResetPasswordPage />} />
        <Route path={ROUTES.VERIFY_EMAIL}    element={<VerifyEmailPage />} />
      </Route>

      {/* ── Student Dashboard (authenticated) ───────────────────────────── */}
      <Route
        element={
          <RouteGuard isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </RouteGuard>
        }
      >
        {/* Main Dashboard & Core Student Tabs (Instant 0ms render without any loader or screen) */}
        <Route path={ROUTES.DASHBOARD}         element={<DashboardPage />} />
        <Route path={ROUTES.LEADERBOARD}       element={<LeaderboardPage />} />

        {/* Learning */}
        <Route path={ROUTES.LEARNING}          element={<LearningPage />} />
        <Route path={ROUTES.LEARNING_PATH}     element={<LearningPathPage />} />
        <Route path={ROUTES.LEARNING_LESSON}   element={<LessonPage />} />

        {/* DSA Learning Path */}
        <Route path={ROUTES.DSA_ROADMAP}      element={<DSARoadmapPage />} />
        <Route path={ROUTES.DSA_TOPIC}        element={<DSATopicPage />} />
        <Route path={ROUTES.DSA_PROGRESS}     element={<DSAProgressPage />} />
        <Route path={ROUTES.DSA_REVISION}     element={<DSARevisionPage />} />
        <Route path={ROUTES.DSA_BOOKMARKS}    element={<DSABookmarksPage />} />
        <Route path={ROUTES.DSA_SEARCH}       element={<DSASearchPage />} />
        <Route path={ROUTES.DSA_PATTERNS}     element={<DSAPatternPage />} />
        <Route path={ROUTES.DSA_ACHIEVEMENTS} element={<DSAAchievementsPage />} />

        {/* Resources */}
        <Route path={ROUTES.RESOURCES}         element={<ResourcesPage />} />
        <Route path={ROUTES.RESOURCE_DETAIL}   element={<ResourceDetailPage />} />

        {/* Community */}
        <Route path={ROUTES.COMMUNITY}          element={<CommunityPage />} />
        <Route path={ROUTES.COMMUNITY_CREATE}   element={<CreateCommunityPage />} />
        <Route path={ROUTES.COMMUNITY_DETAIL}   element={<CommunityDetailPage />} />
        <Route path={ROUTES.COMMUNITY_SETTINGS} element={<CommunitySettingsPage />} />

        {/* Sessions */}
        <Route path={ROUTES.SESSIONS}          element={<SessionsPage />} />
        <Route path={ROUTES.SESSION_DETAIL}    element={<SessionDetailPage />} />
        <Route path={ROUTES.SESSION_LIVE}      element={<LiveSessionPage />} />

        {/* Events */}
        <Route path={ROUTES.EVENTS}            element={<EventsPage />} />
        <Route path={ROUTES.EVENT_DETAIL}      element={<EventDetailPage />} />

        {/* Codex */}
        <Route path={ROUTES.CODEX}             element={<CodexPage />} />
        <Route path={ROUTES.CODEX_CREATE}      element={<CreateWorkspacePage />} />
        <Route path={ROUTES.WORKSPACE}         element={<WorkspacePage />} />

        {/* Sandbox & Web IDE */}
        <Route path={ROUTES.SANDBOX}           element={<SandboxPage />} />
        <Route path={ROUTES.SANDBOX_PROJECT}   element={<SandboxProjectPage />} />
        <Route path="/vscode/:projectId"       element={<SandboxProjectPage />} />
        <Route path={ROUTES.IDE}               element={<WebIDEPage />} />

        {/* Tests */}
        <Route path={ROUTES.TESTS}             element={<TestsPage />} />
        <Route path={ROUTES.TEST_DETAIL}       element={<TestDetailPage />} />
        <Route path={ROUTES.TEST_ATTEMPT}      element={<TestAttemptPage />} />
        <Route path={ROUTES.TEST_RESULTS}      element={<TestResultsPage />} />

        {/* Profile & Notifications */}
        <Route path={ROUTES.PROFILE}           element={<ProfilePage />} />
        <Route path={ROUTES.NOTIFICATIONS}     element={<NotificationsPage />} />

        {/* Subscription */}
        <Route path={ROUTES.SUBSCRIPTION}      element={<SubscriptionPage />} />
        <Route path={ROUTES.BILLING}           element={<BillingPage />} />

        {/* Settings */}
        <Route path={ROUTES.SETTINGS}          element={<SettingsPage />} />
        <Route path={ROUTES.PROFILE_PUBLIC}    element={<PublicProfilePage />} />

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
