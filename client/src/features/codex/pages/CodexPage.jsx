import React from 'react';
import CodexApp from '../App.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';

export const CodexPage = () => {
  return (
    <AuthProvider>
      <CodexApp />
    </AuthProvider>
  );
};

export default CodexPage;
