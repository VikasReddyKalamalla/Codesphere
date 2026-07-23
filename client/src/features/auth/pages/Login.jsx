import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader.jsx';
import { LoginForm } from '../components/LoginForm.jsx';
import { SocialLogin } from '../components/SocialLogin.jsx';
import { AuthFooter } from '../components/AuthFooter.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="flex flex-col gap-6 w-full">
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your CodeSphere account"
      />
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      <SocialLogin />
      <AuthFooter
        question="Don't have an account?"
        actionLabel="Sign Up"
        actionPath="/register"
      />
    </div>
  );
};
