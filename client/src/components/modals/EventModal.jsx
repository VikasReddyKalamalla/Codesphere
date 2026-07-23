import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from '../common/Button.jsx';

export const EventModal = ({ isOpen, onClose, event = {}, onRegister }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title || 'Event Details'}>
      <div className="flex flex-col gap-4 text-sm">
        <p className="text-slate-655 dark:text-slate-350">{event.description}</p>
        <div className="flex flex-col gap-1.5 text-xs text-slate-450 border-y border-slate-100 dark:border-slate-800 py-3 my-1">
          <span>Date: <strong>{event.date}</strong></span>
          <span>Location: <strong>{event.location}</strong></span>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={() => { onRegister && onRegister(); onClose(); }}>
            Confirm Register
          </Button>
        </div>
      </div>
    </Modal>
  );
};
