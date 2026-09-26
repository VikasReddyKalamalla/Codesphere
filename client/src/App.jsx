import React, { useEffect } from 'react';
import ErrorBoundary from './app/ErrorBoundary.jsx';
import AppInitializer from './app/AppInitializer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.markAppMounted === 'function') {
      window.markAppMounted();
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppInitializer>
        <AppRoutes />
      </AppInitializer>
    </ErrorBoundary>
  );
}
