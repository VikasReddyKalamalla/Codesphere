import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store.js';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { SocketProvider } from '../context/SocketContext.jsx';

export const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  );
};
