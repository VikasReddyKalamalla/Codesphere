import React, { useState } from 'react';
import { Input } from '@components/common/Input.jsx';
import { TextArea } from '@components/common/TextArea.jsx';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export default function Contact() {
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Query dispatch successful!');
    setMsg('');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white text-center">Contact support</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Your Email" type="email" required />
          <TextArea label="Message query" value={msg} onChange={(e) => setMsg(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full mt-2">Send message</Button>
        </form>
      </div>
    </div>
  );
}
