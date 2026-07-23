import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/common/Input.jsx';
import { TextArea } from '@components/common/TextArea.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const BecomeInstructor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ experience: '', topic: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Instructor application received!');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="flex flex-col gap-6 w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl shadow-xl p-8 animate-scale-in">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Become an Instructor</h2>
          <p className="text-xs text-slate-500">Provide details to register as a CodeSphere certified mentor</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Area of Expertise"
            placeholder="e.g. Python Compiler Systems"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            required
          />
          <TextArea
            label="Brief description of coaching experience"
            placeholder="Tell us about courses you taught or industry experience..."
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            required
          />
          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};
