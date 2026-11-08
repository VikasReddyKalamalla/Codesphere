import React from 'react';
import CodexApp from '../App.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';

export const WorkspacePage = () => {
  return (
    <AuthProvider>
      <CodexApp />
    </AuthProvider>
  );
};

export default WorkspacePage;
