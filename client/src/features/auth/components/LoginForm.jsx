import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { PasswordInput } from '@components/common/PasswordInput.jsx';
import { Button } from '@components/common/Button.jsx';
import { RememberMe } from './RememberMe.jsx';
import { validateLogin } from '../validations/loginValidation.js';
import { useAuth } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

export const LoginForm = ({ onSuccess }) => {
  const { login, status } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validateLogin(form);
    if (!val.isValid) {
      setErrors(val.errors);
      return;
    }
    setErrors({});
    try {
      await login(form);
      toast.success('Logged in successfully!');
      onSuccess && onSuccess();
    } catch (err) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email Address"
        placeholder="email@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
      />
      <div>
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        <RememberMe checked={remember} onChange={setRemember} />
      </div>
      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={status === 'loading'}>
        Sign In
      </Button>
    </form>
  );
};
