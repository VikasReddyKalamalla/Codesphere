import React from 'react';
import lazy from '@utils/lazyWithRetry.js';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import LoadingRoute from './LoadingRoute.jsx';
import { AuthLayout } from '@layouts';
import GuestGuard from './GuestGuard.jsx';

import LoginPage          from '@features/auth/pages/Login.jsx';
import RegisterPage       from '@features/auth/pages/Register.jsx';
import ForgotPasswordPage from '@features/auth/pages/ForgotPassword.jsx';
import ResetPasswordPage  from '@features/auth/pages/ResetPassword.jsx';
import VerifyEmailPage    from '@features/auth/pages/VerifyEmail.jsx';

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
