import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import LoadingRoute from './LoadingRoute.jsx';
import RouteGuard from './RouteGuard.jsx';
import PermissionGuard from './PermissionGuard.jsx';
import { InstructorLayout } from '@layouts';

// Lazy-loaded instructor pages
const InstructorDashboard    = lazy(() => import('@features/instructor/pages/InstructorDashboard.jsx'));
const InstructorCourses      = lazy(() => import('@features/instructor/pages/InstructorCourses.jsx'));
const InstructorStudents     = lazy(() => import('@features/instructor/pages/InstructorStudents.jsx'));
const InstructorSessions     = lazy(() => import('@features/instructor/pages/InstructorSessions.jsx'));
const InstructorAnalytics    = lazy(() => import('@features/instructor/pages/InstructorAnalytics.jsx'));
const InstructorCertificates = lazy(() => import('@features/instructor/pages/InstructorCertificates.jsx'));
const InstructorApply        = lazy(() => import('@features/instructor/pages/InstructorApply.jsx'));

/**
 * InstructorRoutes — routes under /instructor.
 * Requires authentication + instructor OR admin role.
 */
const InstructorRoutes = ({ isAuthenticated = false, user = null }) => (
  <Route
    element={
      <RouteGuard isAuthenticated={isAuthenticated}>
        <PermissionGuard user={user} allowedRoles={['instructor', 'admin']}>
          <InstructorLayout />
        </PermissionGuard>
      </RouteGuard>
    }
  >
    <Route path={ROUTES.INSTRUCTOR_DASHBOARD}    element={<LoadingRoute><InstructorDashboard /></LoadingRoute>} />
    <Route path={ROUTES.INSTRUCTOR_COURSES}      element={<LoadingRoute><InstructorCourses /></LoadingRoute>} />
    <Route path={ROUTES.INSTRUCTOR_STUDENTS}     element={<LoadingRoute><InstructorStudents /></LoadingRoute>} />
    <Route path={ROUTES.INSTRUCTOR_SESSIONS}     element={<LoadingRoute><InstructorSessions /></LoadingRoute>} />
    <Route path={ROUTES.INSTRUCTOR_ANALYTICS}    element={<LoadingRoute><InstructorAnalytics /></LoadingRoute>} />
    <Route path={ROUTES.INSTRUCTOR_CERTIFICATES} element={<LoadingRoute><InstructorCertificates /></LoadingRoute>} />
  </Route>
);

/**
 * InstructorApplyRoute — any authenticated user can apply.
 * Kept separate so DashboardLayout wraps the apply page.
 */
export const InstructorApplyRoute = ({ isAuthenticated = false }) => (
  <Route
    path={ROUTES.INSTRUCTOR_APPLY}
    element={
      <RouteGuard isAuthenticated={isAuthenticated}>
        <LoadingRoute><InstructorApply /></LoadingRoute>
      </RouteGuard>
    }
  />
);

export default InstructorRoutes;
