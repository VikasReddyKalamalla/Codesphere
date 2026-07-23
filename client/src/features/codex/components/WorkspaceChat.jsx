import React, { useState, useEffect, useRef } from 'react';
import { Send, Pin, AlertCircle, Smile, Search, Paperclip, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const WorkspaceChat = ({ 
  messages = [], 
  onSendMessage, 
  onPinMessage, 
  onSearchChat, 
  typingUsers = {}, 
  onTypingStart, 
  onTypingStop 
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeMessages = isSearching ? searchResults : messages;
  const pinnedMessages = messages.filter(m => m.isPinned || m.text?.startsWith('[PIN]') || m.content?.startsWith('[PIN]'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers, isSearching]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    onTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
    onTypingStop();
  };

  const handleEmojiClick = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmoji(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await onSearchChat(searchQuery.trim());
    setSearchResults(results || []);
  };

  const formatMessageText = (msgText) => {
    if (msgText.startsWith('```') && msgText.endsWith('```')) {
      const code = msgText.substring(3, msgText.length - 3).trim();
      return (
        <pre className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] p-2.5 rounded-xl font-mono text-[#6366f1] overflow-x-auto my-1 leading-relaxed max-w-full text-left">
          {code}
        </pre>
      );
    }
    return <span className="break-all">{msgText}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden text-left">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#6366f1]" />
          <span className="text-xs font-bold text-slate-855 dark:text-white tracking-wide uppercase font-mono">Workspace discussion</span>
        </div>
        
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chat..."
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 pl-7 pr-2.5 py-1 rounded-xl text-[10px] outline-none text-slate-700 dark:text-slate-355 focus:border-[#6366f1] font-mono w-[120px] focus:w-[150px] transition-all"
          />
          <Search size={10} className="absolute left-2.5 text-slate-455 dark:text-slate-550" />
        </form>
      </div>

      {/* Pinned Messages Header */}
      {pinnedMessages.length > 0 && (
        <div className="bg-indigo-50/50 dark:bg-emerald-955/10 border-b border-slate-200 dark:border-indigo-500/10 px-4 py-2 flex flex-col gap-1 select-none shrink-0">
          <span className="text-[9px] font-bold text-[#6366f1] uppercase tracking-widest flex items-center gap-1 font-mono">
            <Pin size={10} className="rotate-45" /> Pinned Messages
          </span>
          <div className="max-h-[60px] overflow-y-auto space-y-1 pr-1 no-scrollbar">
            {pinnedMessages.map((m, idx) => (
              <div key={idx} className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                <span className="font-bold text-slate-700 dark:text-slate-355 font-mono">{m.user || m.sender?.fullName || 'User'}:</span>
                <span>{m.text || m.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar min-h-0">
        {activeMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 py-10">
            <MessageSquare size={24} className="text-slate-300 dark:text-slate-700 animate-bounce" />
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-550 uppercase tracking-wider">No messages yet. Send a greeting!</span>
          </div>
        ) : (
          activeMessages.map((msg, idx) => {
            const isMe = msg.sender?._id === currentUser?._id || msg.user === currentUser?.fullName;
            const senderName = msg.sender?.fullName || msg.user || 'User';
            const senderAvatar = msg.sender?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${senderName}`;
            
            return (
              <div key={idx} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''} group`}>
                <img src={senderAvatar} alt={senderName} className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-750 bg-slate-100 dark:bg-slate-900" />
                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-1.5 mb-0.5 select-none">
                    <span className="text-[10px] font-bold text-slate-755 dark:text-slate-355 font-mono">{senderName}</span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-550 font-mono">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-2xl text-xs relative ${
                    isMe 
                      ? 'bg-[#6366f1] text-white rounded-tr-none shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-none'
                  }`}>
                    {formatMessageText(msg.text || msg.content)}
                    
                    <button 
                      onClick={() => onPinMessage(msg._id || msg)}
                      className={`absolute -top-1.5 ${isMe ? '-left-4' : '-right-4'} hidden group-hover:block p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400`}
                    >
                      <Pin size={9} className="rotate-45" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicators */}
      {Object.values(typingUsers).some(t => t && t.isTyping) && (
        <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-950/20 text-[9px] font-mono text-[#6366f1] select-none animate-pulse shrink-0">
          {Object.values(typingUsers)
            .filter(t => t && t.isTyping)
            .map(t => t.name)
            .join(', ')} currently typing...
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmoji && (
        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 p-2.5 flex flex-wrap gap-2 justify-center select-none shadow-inner shrink-0">
          {['👋', '💻', '🚀', '🔥', '🎉', '💡', '👍', '😱', '👀', '💖', '✅', '❌'].map(emoji => (
            <button 
              key={emoji} 
              onClick={() => handleEmojiClick(emoji)} 
              className="text-lg hover:scale-125 hover:rotate-6 transition-all duration-150 p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input box form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 flex items-center gap-2 shrink-0">
        <button 
          type="button" 
          onClick={() => setShowEmoji(!showEmoji)} 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-400 hover:text-[#6366f1] transition-all cursor-pointer"
        >
          <Smile size={16} />
        </button>

        <input
          value={text}
          onChange={handleInputChange}
          placeholder="Send message..."
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2 text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-[#6366f1]"
        />

        <button 
          type="submit" 
          className="p-2 bg-[#6366f1] hover:bg-[#4f46e5] hover:scale-105 active:scale-95 rounded-xl text-white transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
