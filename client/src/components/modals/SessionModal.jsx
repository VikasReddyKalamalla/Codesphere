import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';

export const SessionModal = ({ isOpen, onClose, onSave, sessionData = {} }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={sessionData.id ? 'Edit Session Config' : 'Schedule Live Session'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Session Topic" defaultValue={sessionData.title || ''} required />
        <Input label="Host Instructor" defaultValue={sessionData.host || ''} required />
        <Input label="Schedule Date" type="datetime-local" required />
        <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-855 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Schedule</Button>
        </div>
      </form>
    </Modal>
  );
};
