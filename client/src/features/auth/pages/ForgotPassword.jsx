import React from 'react';
import { AuthHeader } from '../components/AuthHeader.jsx';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm.jsx';
import { AuthFooter } from '../components/AuthFooter.jsx';

export const ForgotPassword = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <AuthHeader title="Reset Password" subtitle="Enter your email to receive recovery instructions" />
      <ForgotPasswordForm />
      <AuthFooter question="Remember password?" actionLabel="Back to Login" actionPath="/login" />
    </div>
  );
};
