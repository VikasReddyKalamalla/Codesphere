import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#f8fafc' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
        }}
      />
    </>
  );
};
export default ToastProvider;
