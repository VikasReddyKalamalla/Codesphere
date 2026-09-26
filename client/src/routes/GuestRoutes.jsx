import React from 'react';
import lazy from '@utils/lazyWithRetry.js';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import RouteLoader from './RouteLoader.jsx';
import { AuthLayout } from '@layouts';
import GuestGuard from './GuestGuard.jsx';

import LoginPage          from '@features/auth/pages/Login.jsx';
import RegisterPage       from '@features/auth/pages/Register.jsx';
import ForgotPasswordPage from '@features/auth/pages/ForgotPassword.jsx';
import ResetPasswordPage  from '@features/auth/pages/ResetPassword.jsx';
import VerifyEmailPage    from '@features/auth/pages/VerifyEmail.jsx';

export const GuestRoutes = ({ isAuthenticated = false, user = null }) => (
  <Route
    element={
      <GuestGuard isAuthenticated={isAuthenticated} user={user}>
        <AuthLayout />
      </GuestGuard>
    }
  >
    <Route path={ROUTES.LOGIN}           element={<RouteLoader><LoginPage /></RouteLoader>} />
    <Route path={ROUTES.REGISTER}        element={<RouteLoader><RegisterPage /></RouteLoader>} />
    <Route path={ROUTES.FORGOT_PASSWORD} element={<RouteLoader><ForgotPasswordPage /></RouteLoader>} />
    <Route path={ROUTES.RESET_PASSWORD}  element={<RouteLoader><ResetPasswordPage /></RouteLoader>} />
    <Route path={ROUTES.VERIFY_EMAIL}    element={<RouteLoader><VerifyEmailPage /></RouteLoader>} />
  </Route>
);

export default GuestRoutes;
