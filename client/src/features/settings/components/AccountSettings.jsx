import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const AccountSettings = () => {
  const [email, setEmail] = useState('developer@codesphere.edu');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Account credentials settings saved!');
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <Input label="Primary Login Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Button type="submit" variant="primary" className="self-end" size="sm">Save changes</Button>
    </form>
  );
};
