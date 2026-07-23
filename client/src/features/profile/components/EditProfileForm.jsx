import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { TextArea } from '@components/common/TextArea.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const EditProfileForm = ({ initialData = {}, onSave }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    headline: initialData.headline || '',
    bio: initialData.bio || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave && onSave(form);
      toast.success('Profile details updated!');
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Input label="Headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
      <TextArea label="Biography" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      <Button type="submit" variant="primary" isLoading={loading} className="self-end">Save Changes</Button>
    </form>
  );
};
