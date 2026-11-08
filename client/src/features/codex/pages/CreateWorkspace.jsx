import React from 'react';
import CodexApp from '../App.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';

export const CreateWorkspace = () => {
  return (
    <AuthProvider>
      <CodexApp />
    </AuthProvider>
  );
};

export default CreateWorkspace;
