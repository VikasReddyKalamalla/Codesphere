import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset link dispatched!');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email Address"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
        Reset Password
      </Button>
    </form>
  );
};
