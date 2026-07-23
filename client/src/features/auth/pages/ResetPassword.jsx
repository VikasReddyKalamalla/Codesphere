import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader.jsx';
import { ResetPasswordForm } from '../components/ResetPasswordForm.jsx';

export const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 w-full">
      <AuthHeader title="Create New Password" subtitle="Choose a strong password to secure your account" />
      <ResetPasswordForm onSuccess={() => navigate('/login')} />
    </div>
  );
};
