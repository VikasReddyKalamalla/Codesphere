import { useState } from 'react';

export const useWorkspaceChat = () => {
  const [messages, setMessages] = useState([]);
  const send = (text) => setMessages([...messages, { text, user: 'Me' }]);
  return { messages, send };
};
