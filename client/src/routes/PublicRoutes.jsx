import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ROUTES from './RouteConstants.js';
import LoadingRoute from './LoadingRoute.jsx';
import { PublicLayout } from '@layouts';

// Lazy-loaded landing pages
const LandingPage   = lazy(() => import('@features/landing/pages/LandingPage.jsx'));
const AboutPage     = lazy(() => import('@features/landing/pages/AboutPage.jsx'));
const PricingPage   = lazy(() => import('@features/landing/pages/PricingPage.jsx'));
const FeaturesPage  = lazy(() => import('@features/landing/pages/FeaturesPage.jsx'));
const ContactPage   = lazy(() => import('@features/landing/pages/ContactPage.jsx'));
const PrivacyPage   = lazy(() => import('@features/legal/pages/PrivacyPage.jsx'));
const TermsPage     = lazy(() => import('@features/legal/pages/TermsPage.jsx'));
const CookiesPage   = lazy(() => import('@features/legal/pages/CookiesPage.jsx'));

/**
 * PublicRoutes — publicly accessible marketing / legal pages.
 * These routes are visible to both guests and authenticated users.
 */
const PublicRoutes = () => (
  <Route element={<PublicLayout />}>
    <Route index path={ROUTES.HOME}     element={<LoadingRoute><LandingPage /></LoadingRoute>} />
    <Route path={ROUTES.ABOUT}          element={<LoadingRoute><AboutPage /></LoadingRoute>} />
    <Route path={ROUTES.PRICING}        element={<LoadingRoute><PricingPage /></LoadingRoute>} />
    <Route path={ROUTES.FEATURES}       element={<LoadingRoute><FeaturesPage /></LoadingRoute>} />
    <Route path={ROUTES.CONTACT}        element={<LoadingRoute><ContactPage /></LoadingRoute>} />
    <Route path={ROUTES.PRIVACY}        element={<LoadingRoute><PrivacyPage /></LoadingRoute>} />
    <Route path={ROUTES.TERMS}          element={<LoadingRoute><TermsPage /></LoadingRoute>} />
    <Route path={ROUTES.COOKIE_POLICY}  element={<LoadingRoute><CookiesPage /></LoadingRoute>} />
  </Route>
);

export default PublicRoutes;
