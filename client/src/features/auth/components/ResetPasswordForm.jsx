import React, { useState } from 'react';
import { PasswordInput } from '@components/common/PasswordInput.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const ResetPasswordForm = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password too short');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password updated successfully!');
      onSuccess && onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PasswordInput
        label="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <PasswordInput
        label="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
        Save Changes
      </Button>
    </form>
  );
};
