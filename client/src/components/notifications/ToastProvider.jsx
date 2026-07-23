import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg shadow-md',
          duration: 3500,
          style: {
            fontSize: '13px',
          }
        }}
      />
    </>
  );
};
