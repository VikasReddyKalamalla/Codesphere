import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader.jsx';
import { RegisterForm } from '../components/RegisterForm.jsx';
import { SocialLogin } from '../components/SocialLogin.jsx';
import { AuthFooter } from '../components/AuthFooter.jsx';

export const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full">
      <AuthHeader
        title="Join CodeSphere"
        subtitle="Create your account and start coding today"
      />
      <RegisterForm onSuccess={() => navigate('/dashboard')} />
      <SocialLogin />
      <AuthFooter
        question="Already have an account?"
        actionLabel="Sign In"
        actionPath="/login"
      />
    </div>
  );
};
