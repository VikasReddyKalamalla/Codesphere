import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Hash, Volume2, HelpCircle, Bell, MessageSquare, Send, Users,
  Wifi, WifiOff, Sparkles, User, Smile, Plus, Code2, Copy, Check,
  Play, Pin, Search, Shield, ChevronDown, CheckCheck, Share2,
  FileText, CornerDownRight, X, ArrowDown
} from 'lucide-react';
import { useCommunityChat } from '../hooks/useCommunityChat.js';
import {
  fetchCommunityChannelsAPI,
  createChannelAPI,
  fetchDirectChatsAPI,
  openDirectChatAPI,
  generateInviteCodeAPI,
  searchCommunityMessagesAPI
} from '../services/communityAPI.js';
import {
  setChannels,
  setActiveChannel,
  addChannel,
  setDirectChats,
  setActiveDirectChat,
  setActiveMode
} from '../redux/communitySlice.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import toast from 'react-hot-toast';

export const CommunityChat = ({ communityId, communityName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  // Redux state
  const {
    channels,
    categorizedChannels,
    activeChannel,
    directChats,
    activeDirectChat,
    activeMode
  } = useSelector((state) => state.communities);

  // Modals & Panels
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showCodeSnippetModal, setShowCodeSnippetModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // New Channel Form state
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelCategory, setNewChannelCategory] = useState('General');
  const [newChannelType, setNewChannelType] = useState('text');
  const [newChannelTopic, setNewChannelTopic] = useState('');

  // Code Snippet Form state
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetLang, setSnippetLang] = useState('javascript');
  const [snippetCode, setSnippetCode] = useState('');

  // Input & Reply state
  const [inputMessage, setInputMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Hook for real-time WebSocket messaging
  const {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    loadingOlder,
    hasMore,
    roomKey,
    sendMessage,
    sendTyping,
    sendReaction,
    sendPin,
    loadOlderMessages
  } = useCommunityChat({
    communityId,
    channelId: activeChannel?._id,
    directChatId: activeDirectChat?._id,
    mode: activeMode,
  });

  // 1. Fetch Channels and Direct Chats on Mount
  useEffect(() => {
    if (communityId) {
      fetchCommunityChannelsAPI(communityId)
        .then((res) => {
          if (res?.data) {
            dispatch(setChannels(res.data));
          }
        })
        .catch((err) => console.error('Failed to load channels:', err));
    }

    fetchDirectChatsAPI()
      .then((res) => {
        if (res?.data) {
          dispatch(setDirectChats(res.data));
        }
      })
      .catch((err) => console.error('Failed to load direct chats:', err));
  }, [communityId, dispatch]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typingUsers.length]);

  // Handlers
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage({
      content: inputMessage.trim(),
      type: 'text',
      replyTo: replyingTo?._id,
    });

    setInputMessage('');
    setReplyingTo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendCodeSnippet = (e) => {
    e.preventDefault();
    if (!snippetCode.trim()) return;

    sendMessage({
      content: `Code Snippet: ${snippetTitle || snippetLang}`,
      type: 'code',
      codeSnippet: {
        title: snippetTitle || 'snippet',
        language: snippetLang,
        code: snippetCode,
      },
      replyTo: replyingTo?._id,
    });

    setSnippetTitle('');
    setSnippetCode('');
    setShowCodeSnippetModal(false);
    setReplyingTo(null);
    toast.success('Code snippet shared!');
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const res = await createChannelAPI(communityId, {
        name: newChannelName.trim(),
        category: newChannelCategory,
        type: newChannelType,
        topic: newChannelTopic.trim(),
      });

      dispatch(addChannel(res.data));
      dispatch(setActiveChannel(res.data));
      setShowCreateChannelModal(false);
      setNewChannelName('');
      setNewChannelTopic('');
      toast.success(`#${res.data.name} created!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create channel');
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenInIDE = (codeSnippet) => {
    navigate('/codex', { state: { initialCode: codeSnippet.code, language: codeSnippet.language } });
    toast.success('Opening snippet in CodeSphere Web IDE...');
  };

  const handleGenerateInvite = async () => {
    try {
      const res = await generateInviteCodeAPI(communityId);
      setInviteCode(res.data.inviteCode);
      setShowInviteModal(true);
    } catch (err) {
      toast.error('Failed to generate invite code');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchCommunityMessagesAPI(communityId, searchQuery);
      setSearchResults(res.data || []);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Channel Icon Selector
  const getChannelIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'forum':
        return <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />;
      case 'voice':
        return <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      default:
        return <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl flex h-[760px] overflow-hidden shadow-2xl text-slate-200 font-sans">
      
      {/* ─── LEFT COLUMN: Channels & Direct WhatsApp Chats ────────────────── */}
      <div className="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col flex-shrink-0">
        
        {/* Community Header Banner */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="overflow-hidden">
            <h2 className="text-xs font-black uppercase tracking-wider text-white font-mono truncate">
              {communityName || 'CodeSphere'}
            </h2>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Enterprise Workspace
            </p>
          </div>
          <button
            onClick={handleGenerateInvite}
            title="Invite to Community"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Switcher: Channels vs Direct Chats */}
        <div className="flex border-b border-slate-800 text-[11px] font-mono font-bold bg-slate-950/50 p-1">
          <button
            onClick={() => dispatch(setActiveMode('community'))}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeMode === 'community'
                ? 'bg-[#04AA6D] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => dispatch(setActiveMode('direct'))}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeMode === 'direct'
                ? 'bg-[#04AA6D] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct (WA)
          </button>
        </div>

        {/* Channels List */}
        {activeMode === 'community' ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar text-xs">
            <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span>Text Channels</span>
              <button
                onClick={() => setShowCreateChannelModal(true)}
                title="Create Channel"
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {Object.keys(categorizedChannels).length === 0 && channels.length === 0 ? (
              <p className="text-center text-[11px] text-slate-500 font-mono py-4">No channels yet.</p>
            ) : (
              Object.entries(categorizedChannels).map(([category, chList]) => (
                <div key={category} className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
                    {category}
                  </span>
                  {chList.map((ch) => {
                    const isActive = activeChannel?._id === ch._id;
                    return (
                      <button
                        key={ch._id}
                        onClick={() => dispatch(setActiveChannel(ch))}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-mono text-xs transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#04AA6D]/20 text-emerald-400 font-bold border border-[#04AA6D]/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        {getChannelIcon(ch.type)}
                        <span className="truncate">{ch.name}</span>
                        {ch.messageCount > 0 && (
                          <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                            {ch.messageCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Direct WhatsApp Chats List */
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <div className="px-2 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Direct Messages
            </div>
            {directChats.length === 0 ? (
              <p className="text-center text-[11px] text-slate-500 font-mono py-6">No direct chats yet.</p>
            ) : (
              directChats.map((chat) => {
                const isActive = activeDirectChat?._id === chat._id;
                const other = chat.recipient || (chat.participants && chat.participants.find(p => p._id !== currentUser?._id)) || {};
                return (
                  <button
                    key={chat._id}
                    onClick={() => dispatch(setActiveDirectChat(chat))}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#04AA6D]/20 text-emerald-400 border border-[#04AA6D]/30'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                      {other.avatar ? (
                        <img src={other.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{chat.isGroup ? chat.groupName : (other.fullName || other.username || 'Developer')}</span>
                        {chat.lastMessage?.timestamp && (
                          <span className="text-[9px] text-slate-400 font-mono">{formatTime(chat.lastMessage.timestamp)}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {chat.lastMessage?.content || 'Started chat'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Current User Quick Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
            {currentUser?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.fullName || 'User'}</p>
            <p className="text-[10px] text-emerald-400 font-mono">Online • {currentUser?.role || 'Student'}</p>
          </div>
        </div>
      </div>

      {/* ─── CENTER COLUMN: Active Chat Thread & Workspace ────────────────── */}
      <div className="flex-1 flex flex-col bg-[#070c18] relative">
        
        {/* Header Bar */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#04AA6D]/10 border border-[#04AA6D]/30 flex items-center justify-center text-[#04AA6D]">
              {activeMode === 'direct' ? <MessageSquare className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  {activeMode === 'direct'
                    ? (activeDirectChat?.isGroup ? activeDirectChat.groupName : activeDirectChat?.recipient?.fullName || 'Direct Chat')
                    : `#${activeChannel?.name || 'general'}`}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Realtime Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                {activeMode === 'direct' ? 'WhatsApp-style 1-on-1 End-to-End Chat' : (activeChannel?.topic || 'Community discussion channel')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Search Messages"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Connection Status */}
            <div className={`flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-xl border ${
              isConnected
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}>
              {isConnected ? <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isConnected ? 'LIVE' : 'RECONNECTING'}</span>
            </div>

            {/* Right Drawer Toggle */}
            <button
              onClick={() => setShowRightDrawer(!showRightDrawer)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                showRightDrawer
                  ? 'bg-[#04AA6D] text-white border-[#04AA6D]'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Members Panel"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/30"
        >
          {/* Load Older Messages Trigger */}
          {hasMore && messages.length >= 20 && (
            <div className="text-center py-2">
              <button
                onClick={loadOlderMessages}
                disabled={loadingOlder}
                className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 transition-all cursor-pointer"
              >
                {loadingOlder ? 'Loading older messages...' : '↑ Load Older Messages'}
              </button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-3xl bg-[#04AA6D]/10 border border-[#04AA6D]/20 flex items-center justify-center text-[#04AA6D] mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-200 font-mono">
                Welcome to #{activeChannel?.name || 'chat'}!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                This is the start of the #{activeChannel?.name || 'chat'} channel. Share code, ask questions, and collaborate in real-time.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = String(msg.sender?._id || msg.sender) === String(currentUser?._id);
              const senderName = msg.sender?.fullName || msg.sender?.username || 'Developer';
              const senderAvatar = msg.sender?.avatar;
              const isPinned = msg.isPinned;
              const isCode = msg.type === 'code' && msg.codeSnippet;

              return (
                <div
                  key={msg._id || index}
                  className={`group flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Sender Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-xs font-bold mt-1">
                    {senderAvatar ? (
                      <img src={senderAvatar} alt={senderName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Message Bubble Container */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    
                    {/* Header info */}
                    <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono">
                      <span className="font-bold text-slate-300">
                        {isMe ? 'You' : senderName}
                      </span>
                      {msg.sender?.role === 'admin' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">Admin</span>
                      )}
                      {msg.sender?.isInstructor && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Instructor</span>
                      )}
                      <span className="text-[9px] text-slate-400">
                        {formatTime(msg.createdAt)}
                      </span>
                      {isPinned && <Pin className="w-3 h-3 text-amber-400" />}
                    </div>

                    {/* Quoted Reply Preview */}
                    {msg.replyTo && (
                      <div className="mb-1 text-[10px] bg-slate-800/80 border-l-2 border-[#04AA6D] px-2.5 py-1 rounded text-slate-300 max-w-md truncate font-mono">
                        <span className="text-[#04AA6D] font-bold">@{msg.replyTo.sender?.fullName || 'User'}:</span> {msg.replyTo.content}
                      </div>
                    )}

                    {/* Main Content Bubble */}
                    <div
                      className={`relative px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md font-sans whitespace-pre-wrap break-words ${
                        isMe
                          ? 'bg-[#04AA6D] text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      {/* Code Snippet Card */}
                      {isCode ? (
                        <div className="mt-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-[11px] min-w-[320px]">
                          <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="text-emerald-400 font-bold">{msg.codeSnippet.title || 'snippet'} ({msg.codeSnippet.language})</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyCode(msg.codeSnippet.code, msg._id)}
                                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === msg._id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === msg._id ? 'Copied' : 'Copy'}</span>
                              </button>
                              <button
                                onClick={() => handleOpenInIDE(msg.codeSnippet)}
                                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3" />
                                <span>Run in IDE</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 overflow-x-auto text-emerald-300/90 leading-normal max-h-60">
                            <code>{msg.codeSnippet.code}</code>
                          </pre>
                        </div>
                      ) : (
                        <span>{msg.content}</span>
                      )}

                      {/* Delivery Status (WhatsApp ticks for own messages) */}
                      {isMe && (
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px]">
                          {msg.deliveryStatus === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-300" title="Read" />
                          ) : msg.deliveryStatus === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-white/70" title="Delivered" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-white/50" title="Sent" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reactions Pill Bar */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                          const hasReacted = users.some(u => String(u) === String(currentUser?._id));
                          return (
                            <button
                              key={emoji}
                              onClick={() => sendReaction(msg._id, emoji)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer border ${
                                hasReacted
                                  ? 'bg-[#04AA6D]/20 border-[#04AA6D] text-emerald-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-bold">{users.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Action Hover Bar */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 hover:text-white cursor-pointer"
                        title="Reply"
                      >
                        <CornerDownRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => sendReaction(msg._id, '👍')}
                        className="p-1 hover:text-white cursor-pointer"
                        title="React 👍"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => sendReaction(msg._id, '🔥')}
                        className="p-1 hover:text-white cursor-pointer"
                        title="React 🔥"
                      >
                        🔥
                      </button>
                      <button
                        onClick={() => sendPin(msg._id, !isPinned)}
                        className="p-1 hover:text-amber-400 cursor-pointer"
                        title={isPinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 italic pt-1">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span>
                {typingUsers.map((u) => u.fullName || u.username).join(', ')}{' '}
                {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Reply Quote Banner */}
        {replyingTo && (
          <div className="px-6 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <CornerDownRight className="w-3.5 h-3.5 text-[#04AA6D]" />
              <span>Replying to <b className="text-white">@{replyingTo.sender?.fullName || 'User'}</b>:</span>
              <span className="text-slate-400 truncate">{replyingTo.content}</span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input Footer */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900 flex items-center gap-3">
          {/* Share Code Snippet Trigger */}
          <button
            type="button"
            onClick={() => setShowCodeSnippetModal(true)}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer border border-slate-700"
            title="Share Code Snippet"
          >
            <Code2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              sendTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${activeChannel?.name || 'chat'} (Press Enter to send)...`}
            className="flex-1 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#04AA6D]/50 transition-all font-sans"
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

      {/* ─── RIGHT COLUMN: Members & Details Drawer ───────────────────────── */}
      {showRightDrawer && (
        <div className="w-64 bg-[#0a0f1d] border-l border-slate-800 flex flex-col overflow-y-auto p-4 custom-scrollbar">
          <div className="mb-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center justify-between">
              <span>Active Developers</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {onlineUsers.length} Online
              </span>
            </h4>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            {onlineUsers.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">No other users online</p>
            ) : (
              onlineUsers.map((user, idx) => (
                <div
                  key={user._id || idx}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer"
                  onClick={() => {
                    if (user._id !== currentUser?._id) {
                      openDirectChatAPI(user._id).then(res => {
                        dispatch(setActiveDirectChat(res.data));
                        dispatch(setActiveMode('direct'));
                        toast.success(`Opened chat with ${user.fullName}`);
                      });
                    }
                  }}
                >
                  <div className="relative w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400 m-auto mt-2" />
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-200 truncate">{user.fullName || user.username}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">@{user.username || 'user'}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Channel Guidelines Box */}
          <div className="mt-auto pt-6">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
              <span className="text-white font-bold block flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Channel Rules
              </span>
              <p>• Be respectful to fellow developers.</p>
              <p>• Share executable code snippets.</p>
              <p>• No spamming or unauthorized self-promotion.</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Create Channel ────────────────────────────────────────── */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Create Channel</h3>
              <button onClick={() => setShowCreateChannelModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">CHANNEL NAME</label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                  <Hash className="w-4 h-4 text-slate-400 mr-1.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. system-design"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="w-full bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">CATEGORY</label>
                <select
                  value={newChannelCategory}
                  onChange={(e) => setNewChannelCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Information">Information</option>
                  <option value="Showcase">Showcase</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">CHANNEL TYPE</label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="text">Text Discussion</option>
                  <option value="announcement">Announcement (Admins only)</option>
                  <option value="forum">Q&A Forum</option>
                  <option value="voice">Voice Stage</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">TOPIC (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="What is this channel about?"
                  value={newChannelTopic}
                  onChange={(e) => setNewChannelTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Share Code Snippet ────────────────────────────────────── */}
      {showCodeSnippetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Share Executable Code Snippet
              </h3>
              <button onClick={() => setShowCodeSnippetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendCodeSnippet} className="mt-4 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">SNIPPET TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g. quickSort.js"
                    value={snippetTitle}
                    onChange={(e) => setSnippetTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">LANGUAGE</label>
                  <select
                    value={snippetLang}
                    onChange={(e) => setSnippetLang(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="html">HTML / CSS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">CODE</label>
                <textarea
                  rows={8}
                  required
                  placeholder="// Paste or write your code here..."
                  value={snippetCode}
                  onChange={(e) => setSnippetCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-emerald-300 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCodeSnippetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold"
                >
                  Post Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Invite to Community ──────────────────────────────────── */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Community Invite Code</h3>
            <p className="text-xs text-slate-400 mt-1">Share this code with fellow developers to let them instantly join this community:</p>
            <div className="my-4 p-3 bg-slate-800 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
              <span className="text-lg font-black tracking-widest text-emerald-400 font-mono">{inviteCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  toast.success('Invite code copied!');
                }}
                className="px-3 py-1 rounded-xl bg-[#04AA6D] text-white text-xs font-bold font-mono"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL: Search Messages ──────────────────────────────────────── */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                Search Community Messages
              </h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Search words, code, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-[#04AA6D] text-white rounded-xl text-xs font-bold font-mono">
                Search
              </button>
            </form>
            <div className="flex-1 overflow-y-auto mt-4 space-y-2 text-xs custom-scrollbar">
              {isSearching ? (
                <p className="text-center text-slate-500 font-mono py-4">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-slate-500 font-mono py-4">No results found.</p>
              ) : (
                searchResults.map((res) => (
                  <div key={res._id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span className="font-bold text-emerald-400">@{res.sender?.fullName || 'User'}</span>
                      <span>{formatTime(res.createdAt)}</span>
                    </div>
                    <p className="text-slate-200">{res.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityChat;
