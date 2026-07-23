import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import LoadingRoute from './LoadingRoute.jsx';
import { AuthLayout } from '@layouts';
import GuestGuard from './GuestGuard.jsx';

// Lazy-loaded auth pages
const LoginPage         = lazy(() => import('@features/auth/pages/LoginPage.jsx'));
const RegisterPage      = lazy(() => import('@features/auth/pages/RegisterPage.jsx'));
const ForgotPasswordPage= lazy(() => import('@features/auth/pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('@features/auth/pages/ResetPasswordPage.jsx'));
const VerifyEmailPage   = lazy(() => import('@features/auth/pages/VerifyEmailPage.jsx'));

/**
 * AuthRoutes — guest-only routes (Login, Register, etc.).
 * Authenticated users are redirected to their dashboard by GuestGuard.
 *
 * Note: isAuthenticated / user are supplied from Redux in the final integration.
 */
const AuthRoutes = ({ isAuthenticated = false, user = null }) => (
  <Route
    element={
      <GuestGuard isAuthenticated={isAuthenticated} user={user}>
        <AuthLayout />
      </GuestGuard>
    }
  >
    <Route
      path={ROUTES.LOGIN}
      element={<LoadingRoute><LoginPage /></LoadingRoute>}
    />
    <Route
      path={ROUTES.REGISTER}
      element={<LoadingRoute><RegisterPage /></LoadingRoute>}
    />
    <Route
      path={ROUTES.FORGOT_PASSWORD}
      element={<LoadingRoute><ForgotPasswordPage /></LoadingRoute>}
    />
    <Route
      path={ROUTES.RESET_PASSWORD}
      element={<LoadingRoute><ResetPasswordPage /></LoadingRoute>}
    />
    <Route
      path={ROUTES.VERIFY_EMAIL}
      element={<LoadingRoute><VerifyEmailPage /></LoadingRoute>}
    />
  </Route>
);

export default AuthRoutes;
