import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import RouteLoader from './RouteLoader.jsx';
import { AuthLayout } from '@layouts';
import GuestGuard from './GuestGuard.jsx';

const LoginPage          = lazy(() => import('@features/auth/pages/LoginPage.jsx'));
const RegisterPage       = lazy(() => import('@features/auth/pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage  = lazy(() => import('@features/auth/pages/ResetPasswordPage.jsx'));
const VerifyEmailPage    = lazy(() => import('@features/auth/pages/VerifyEmailPage.jsx'));

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
