import React from 'react';
import { Button } from '@components/common/Button.jsx';
import { Input } from '@components/common/Input.jsx';
import toast from 'react-hot-toast';

export const InviteMember = () => {
  const handleInvite = (e) => {
    e.preventDefault();
    toast.success('Invitation link dispatched!');
  };

  return (
    <form onSubmit={handleInvite} className="flex gap-2 w-full max-w-sm items-end select-none">
      <Input label="Invite Collaborator Email" placeholder="collaborator@college.edu" type="email" required />
      <Button type="submit" variant="primary">Invite</Button>
    </form>
  );
};
