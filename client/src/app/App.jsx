import React from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';
import AppInitializer from './AppInitializer.jsx';
import Routes from './routes.jsx';

/**
 * App — root component.
 *
 * Wrapping order:
 *   ErrorBoundary  → catches crashes anywhere in the tree
 *   AppInitializer → restores auth session before rendering routes
 *   Routes         → the full React Router route tree
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AppInitializer>
        <Routes />
      </AppInitializer>
    </ErrorBoundary>
  );
};

export default App;
