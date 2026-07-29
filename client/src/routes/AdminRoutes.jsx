import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import LoadingRoute from './LoadingRoute.jsx';
import RouteGuard from './RouteGuard.jsx';
import PermissionGuard from './PermissionGuard.jsx';
import { AdminLayout } from '@layouts';

// Lazy-loaded admin pages
const AdminDashboard    = lazy(() => import('@features/admin/pages/AdminDashboard.jsx'));
const AdminUsers        = lazy(() => import('@features/admin/pages/AdminUsers.jsx'));
const AdminUserDetail   = lazy(() => import('@features/admin/pages/AdminUserDetail.jsx'));
const AdminInstructors  = lazy(() => import('@features/admin/pages/AdminInstructors.jsx'));
const AdminContent      = lazy(() => import('@features/admin/pages/AdminContent.jsx'));
const AdminLearning     = lazy(() => import('@features/admin/pages/AdminLearning.jsx'));
const AdminReports      = lazy(() => import('@features/admin/pages/AdminReports.jsx'));
const AdminModeration   = lazy(() => import('@features/admin/pages/AdminModeration.jsx'));
const AdminSettings     = lazy(() => import('@features/admin/pages/AdminSettings.jsx'));
const AdminAnalytics    = lazy(() => import('@features/admin/pages/AdminAnalytics.jsx'));
const AdminAuditLogs    = lazy(() => import('@features/admin/pages/AdminAuditLogs.jsx'));
const AdminAnnouncements= lazy(() => import('@features/admin/pages/AdminAnnouncements.jsx'));
const AdminFeatures     = lazy(() => import('@features/admin/pages/AdminFeatures.jsx'));
const AdminHealth       = lazy(() => import('@features/admin/pages/AdminHealth.jsx'));

/**
 * AdminRoutes — all routes under /admin.
 * Double-guarded: RouteGuard (authenticated) + PermissionGuard (admin role).
 */
const AdminRoutes = ({ isAuthenticated = false, user = null }) => (
  <Route
    element={
      <RouteGuard isAuthenticated={isAuthenticated}>
        <PermissionGuard user={user} allowedRoles={['admin']}>
          <AdminLayout />
        </PermissionGuard>
      </RouteGuard>
    }
  >
    <Route path={ROUTES.ADMIN_DASHBOARD}    element={<LoadingRoute><AdminDashboard /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_USERS}        element={<LoadingRoute><AdminUsers /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_USER_DETAIL}  element={<LoadingRoute><AdminUserDetail /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_INSTRUCTORS}  element={<LoadingRoute><AdminInstructors /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_CONTENT}      element={<LoadingRoute><AdminContent /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_LEARNING}     element={<LoadingRoute><AdminFeatures defaultTab="learning" /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_REPORTS}      element={<LoadingRoute><AdminReports /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_MODERATION}   element={<LoadingRoute><AdminModeration /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_SETTINGS}     element={<LoadingRoute><AdminSettings /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_ANALYTICS}    element={<LoadingRoute><AdminAnalytics /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_AUDIT_LOGS}   element={<LoadingRoute><AdminAuditLogs /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_ANNOUNCEMENTS}element={<LoadingRoute><AdminAnnouncements /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_FEATURES}     element={<LoadingRoute><AdminFeatures /></LoadingRoute>} />
    <Route path={ROUTES.ADMIN_HEALTH}       element={<LoadingRoute><AdminHealth /></LoadingRoute>} />
  </Route>
);

export default AdminRoutes;
