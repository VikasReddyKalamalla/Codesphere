import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProviders from './app/AppProviders.jsx';
import App from './App.jsx';
import './index.css';

const rootEl = document.getElementById('root');

if (rootEl) {
  try {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Fatal CodeSphere bootstrap error:', err);
    if (window.renderFatalError) {
      window.renderFatalError(err);
    }
  }
}

