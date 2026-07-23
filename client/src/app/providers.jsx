import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store.jsx';
import ThemeProvider from './theme.jsx';

/**
 * Providers — wraps the entire application with all required context providers.
 *
 * Order matters:
 *   1. HelmetProvider  → SEO <head> management
 *   2. Redux Provider  → global state
 *   3. BrowserRouter   → client-side routing
 *   4. ThemeProvider   → dark / light mode
 *   5. Toaster         → global toast notifications
 */
const Providers = ({ children }) => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
              }}
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
};

export default Providers;
