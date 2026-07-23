import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Users, Wifi, WifiOff } from 'lucide-react';
import { useCommunityChat } from '../hooks/useCommunityChat.js';

export const CommunityChat = ({ communityId }) => {
  const {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    sendTyping
  } = useCommunityChat(communityId);

  const [text, setText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    sendTyping();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col h-[500px] overflow-hidden shadow-sm dark:shadow-2xl text-left select-none">
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between bg-slate-50 dark:bg-slate-950/20">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">Community Lobby Chat</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Online count */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <Users size={11} className="text-slate-400 dark:text-slate-500" />
            <span>{onlineUsers.length} Online</span>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-1">
            {isConnected ? (
              <>
                <Wifi size={11} className="text-emerald-600 dark:text-emerald-500" />
                <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-mono font-bold uppercase">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={11} className="text-red-500" />
                <span className="text-[9px] text-red-500 font-mono font-bold uppercase">Reconnecting</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-1 flex flex-col justify-end bg-slate-50/30 dark:bg-slate-950/10 p-4 overflow-y-auto no-scrollbar select-text min-w-0">
          <div className="space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                <MessageSquare size={24} className="text-slate-400 dark:text-slate-600 animate-bounce" />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold">Lobby chat is empty</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-600">Send a message to introduce yourself!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg._id || idx} className="flex items-start gap-2.5 max-w-[85%] text-left">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0">
                    {msg.sender?.avatar ? (
                      <img 
                        src={msg.sender.avatar} 
                        alt={msg.sender?.fullName || msg.user} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-550 uppercase">
                        {(msg.sender?.fullName || msg.user || 'U').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 bg-slate-50 dark:bg-[#111827]/60 border border-slate-150 dark:border-slate-900 px-3 py-2 rounded-2xl">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[9px] font-mono leading-none">{msg.sender?.fullName || msg.user}</span>
                    <p className="text-xs text-slate-800 dark:text-slate-205 leading-relaxed mt-0.5 whitespace-pre-wrap">{msg.content || msg.text}</p>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-1.5 text-[9px] text-slate-455 dark:text-slate-500 font-mono pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 dark:bg-indigo-500 animate-ping" />
                <span>{typingUsers.map(u => u.fullName.split(' ')[0]).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Online panel sidebar */}
        <div className="w-36 border-l border-slate-150 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 p-3 hidden sm:flex flex-col gap-2.5 overflow-y-auto no-scrollbar text-left">
          <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Members Joined</span>
          <div className="flex flex-col gap-2">
            {onlineUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-5.5 h-5.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0">
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-slate-100 dark:border-slate-950" />
                </div>
                <span className="text-[10px] text-slate-705 dark:text-slate-300 font-semibold truncate max-w-full">{user.fullName}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-150 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/40 flex gap-2">
        <input 
          type="text" 
          placeholder="Send a chat message..." 
          value={text} 
          onChange={handleInputChange} 
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl outline-none text-slate-805 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
        />
        <button 
          type="submit" 
          className="bg-indigo-650 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
export default CommunityChat;
