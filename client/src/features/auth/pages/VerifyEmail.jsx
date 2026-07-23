import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader.jsx';
import { OTPInput } from '../components/OTPInput.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const VerifyEmail = () => {
  const navigate = useNavigate();

  const handleVerify = (code) => {
    toast.success('Email verified successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <AuthHeader title="Confirm your email" subtitle="Enter the 6-digit confirmation code sent to you" />
      <OTPInput length={6} onComplete={handleVerify} />
      <Button variant="outline" className="w-full mt-2" onClick={() => toast.success('New code sent!')}>
        Resend Code
      </Button>
    </div>
  );
};
