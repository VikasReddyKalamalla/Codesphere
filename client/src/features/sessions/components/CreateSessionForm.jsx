import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const CreateSessionForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Live stream session scheduled!');
    onCancel && onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Session Topic" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input label="Schedule Date/Time" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
      <div className="flex justify-end gap-3 mt-2 border-t border-slate-100 dark:border-slate-850 pt-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Schedule webcast</Button>
      </div>
    </form>
  );
};
