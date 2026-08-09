import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, User, Sparkles, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

export const DirectMessageDrawer = ({ isOpen, onClose, targetUser }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Hey! Welcome to CodeSphere. How is your project going?', timestamp: '10:14 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate auto-reply from peer
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'them',
          text: 'Thanks for reaching out! Let us collaborate on CodeSphere sandboxes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-4 right-4 z-50 w-80 md:w-96 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans text-xs"
      >
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-400/40 bg-slate-800">
              <img
                src={targetUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser?.name || 'User'}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-white leading-none">{targetUser?.name || 'Direct Message'}</h4>
              <span className="text-[10px] text-emerald-400 font-mono">Online • CodeSphere Direct</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="p-4 flex-1 h-72 overflow-y-auto flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'me'
                    ? 'bg-[#04AA6D] text-white rounded-br-none shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold transition-all cursor-pointer shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};
export default DirectMessageDrawer;
