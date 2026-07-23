import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { PasswordInput } from '@components/common/PasswordInput.jsx';
import { Button } from '@components/common/Button.jsx';
import { PasswordStrength } from './PasswordStrength.jsx';
import { validateRegister } from '../validations/registerValidation.js';
import { useAuth } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

export const RegisterForm = ({ onSuccess }) => {
  const { register, status } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validateRegister(form);
    if (!val.isValid) {
      setErrors(val.errors);
      return;
    }
    setErrors({});
    try {
      await register(form);
      toast.success('Account created successfully!');
      onSuccess && onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.message || err.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />
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
          placeholder="Min 6 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        {form.password && <PasswordStrength password={form.password} />}
      </div>
      <Button type="submit" variant="primary" className="w-full mt-2" isLoading={status === 'loading'}>
        Create Account
      </Button>
    </form>
  );
};
