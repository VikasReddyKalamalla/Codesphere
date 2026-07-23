import React, { useState } from 'react';
import { PasswordInput } from '@components/common/PasswordInput.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const SecuritySettings = () => {
  const [pass, setPass] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success('Password update configured!');
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-4">
      <PasswordInput label="Update security password" value={pass} onChange={(e) => setPass(e.target.value)} required />
      <Button type="submit" variant="primary" className="self-end" size="sm">Update credentials</Button>
    </form>
  );
};
