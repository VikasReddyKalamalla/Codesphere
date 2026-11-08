import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader.jsx';
import { RegisterForm } from '../components/RegisterForm.jsx';
import { SocialLogin } from '../components/SocialLogin.jsx';
import { AuthFooter } from '../components/AuthFooter.jsx';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="flex flex-col gap-6 w-full">
      <AuthHeader
        title="Join CodeSphere"
        subtitle="Create your account and start coding today"
      />
      <RegisterForm onSuccess={() => navigate(from, { replace: true })} />
      <SocialLogin />
      <AuthFooter
        question="Already have an account?"
        actionLabel="Sign In"
        actionPath="/login"
        state={location.state}
      />
    </div>
  );
};

export default Register;
