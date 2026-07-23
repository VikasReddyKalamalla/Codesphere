import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store.jsx';
import { ThemeProvider } from '../providers/ThemeProvider.jsx';
import { ToastProvider } from '../providers/ToastProvider.jsx';

export const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default AppProviders;
