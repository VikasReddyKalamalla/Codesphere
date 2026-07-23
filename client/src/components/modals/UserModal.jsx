import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';
import { Select } from '../common/Select.jsx';

export const UserModal = ({ isOpen, onClose, user = {}, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modify Member Account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Display Name" defaultValue={user.name || ''} required />
        <Input label="Email Address" type="email" defaultValue={user.email || ''} required />
        <Select
          label="Account Level"
          defaultValue={user.role || 'Student'}
          options={[
            { label: 'Learner/Student', value: 'Student' },
            { label: 'Instructor/Mentor', value: 'Instructor' },
            { label: 'Administrator', value: 'Admin' }
          ]}
        />
        <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-855 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};
