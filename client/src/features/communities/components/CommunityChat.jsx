import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MessageSquare, Send, Users, Wifi, WifiOff, Sparkles, User, Smile } from 'lucide-react';
import { useCommunityChat } from '../hooks/useCommunityChat.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const CommunityChat = ({ communityId, communityName }) => {
  const currentUser = useSelector(selectCurrentUser);
  const { messages, onlineUsers, typingUsers, isConnected, sendMessage, sendTyping } = useCommunityChat(communityId);

  const [inputMessage, setInputMessage] = useState('');
  const [showUsersList, setShowUsersList] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    sendTyping();
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col h-[650px] overflow-hidden shadow-2xl text-left font-sans">
      
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#04AA6D]/10 border border-[#04AA6D]/30 flex items-center justify-center text-[#04AA6D] shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                {communityName || 'CodeSphere'} Live Workspace
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 font-mono">
                <Sparkles className="w-2.5 h-2.5" />
                Native Realtime
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Built-in WebSocket chat engine • End-to-end connected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className={`flex items-center gap-1.5 text-[10px] font-bold font-mono px-3 py-1 rounded-xl border ${
            isConnected 
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
              : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>CONNECTED</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span>CONNECTING...</span>
              </>
            )}
          </div>

          {/* Online users toggle */}
          <button
            onClick={() => setShowUsersList(!showUsersList)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
              showUsersList 
                ? 'bg-[#04AA6D] text-white border-[#04AA6D]' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{onlineUsers.length} Online</span>
          </button>
        </div>
      </div>

      {/* Main Chat Body & Online Sidebar */}
      <div className="flex-1 flex overflow-hidden relative bg-slate-50/50 dark:bg-slate-950/40">
        
        {/* Messages Feed */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-3xl bg-[#04AA6D]/10 border border-[#04AA6D]/20 flex items-center justify-center text-[#04AA6D] mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 font-mono">Welcome to {communityName || 'Community'} Chat!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                No messages yet. Send the first message to kick off the conversation with fellow developers!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = String(msg.sender?._id || msg.sender) === String(currentUser?._id);
              const senderName = msg.sender?.fullName || msg.sender?.username || 'Developer';
              const senderAvatar = msg.sender?.avatar;

              return (
                <div 
                  key={msg._id || index} 
                  className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Sender Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                    {senderAvatar ? (
                      <img src={senderAvatar} alt={senderName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  {/* Message Container */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 font-mono">
                        {isMe ? 'You' : senderName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm font-sans whitespace-pre-wrap break-words ${
                      isMe 
                        ? 'bg-[#04AA6D] text-white rounded-tr-none' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 italic pt-2">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span>
                {typingUsers.map(u => u.fullName || u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sidebar for Online Users */}
        {showUsersList && (
          <div className="w-64 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono mb-3 flex items-center justify-between">
              <span>Active Developers</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {onlineUsers.length}
              </span>
            </h4>
            <div className="space-y-2">
              {onlineUsers.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono">No other users online</p>
              ) : (
                onlineUsers.map((user, idx) => (
                  <div key={user._id || idx} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-slate-500 m-auto" />
                      )}
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">@{user.username || 'user'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${communityName || 'community'}...`}
          className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#04AA6D]/50 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || !isConnected}
          className="px-5 py-3 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer font-mono"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default CommunityChat;
