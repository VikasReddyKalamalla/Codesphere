import React, { Suspense } from 'react';

/**
 * LoadingRoute — High-performance Suspense wrapper with zero loading screens or bars.
 * Renders immediately with null fallback to guarantee zero layout shifts or loading delay.
 */
const LoadingRoute = ({ children }) => (
  <Suspense fallback={null}>
    {children}
  </Suspense>
);

export default LoadingRoute;
