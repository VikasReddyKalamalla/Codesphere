import React, { useState } from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Button } from '@components/common/Button.jsx';
import { Input } from '@components/common/Input.jsx';

export const SessionChat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!text) return;
    setMessages([...messages, { user: 'Me', text }]);
    setText('');
  };

  return (
    <Card className="flex flex-col h-72">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Stream Chat</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.map((m, idx) => (
          <p key={idx} className="text-xs text-slate-700 dark:text-slate-300">
            <strong className="text-[#04AA6D] dark:text-emerald-400">{m.user}:</strong> {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={send} className="p-2 border-t border-slate-100 dark:border-slate-850 flex gap-2 shrink-0">
        <Input placeholder="Say hi..." value={text} onChange={(e) => setText(e.target.value)} className="py-1" />
        <Button type="submit" variant="primary" size="sm">Send</Button>
      </form>
    </Card>
  );
};
