import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store.js';
import { ThemeProvider } from './theme.jsx';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
