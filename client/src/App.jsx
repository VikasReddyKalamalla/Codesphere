import React from 'react';
import ErrorBoundary from './app/ErrorBoundary.jsx';
import AppInitializer from './app/AppInitializer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <AppInitializer>
        <AppRoutes />
      </AppInitializer>
    </ErrorBoundary>
  );
}
