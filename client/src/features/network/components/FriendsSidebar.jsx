import React, { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Check, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { 
  searchUsersAPI, 
  sendFriendRequestAPI, 
  respondToFriendRequestAPI, 
  getFriendsListAPI 
} from '../services/networkAPI';
import { socket } from '../../../socket/socket';

export const FriendsSidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'search'
  const [friends, setFriends] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isOpen) {
      fetchNetworkData();
    }
  }, [isOpen]);

  // Listen to Socket events for real-time updates
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleRequestReceived = (data) => {
      toast.success(`${data.sender.fullName} sent you a friend request!`, { icon: '👋' });
      fetchNetworkData();
    };

    const handleRequestAccepted = (data) => {
      toast.success(`${data.friend.fullName} accepted your friend request!`, { icon: '🎉' });
      fetchNetworkData();
    };

    socket.on('friend_request_received', handleRequestReceived);
    socket.on('friend_request_accepted', handleRequestAccepted);

    return () => {
      socket.off('friend_request_received', handleRequestReceived);
      socket.off('friend_request_accepted', handleRequestAccepted);
    };
  }, [isOpen]);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      const res = await getFriendsListAPI();
      if (res.success) {
        setFriends(res.data.friends);
        setPendingSent(res.data.pendingSent);
        setPendingReceived(res.data.pendingReceived);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 2) return;
    
    setLoading(true);
    try {
      const res = await searchUsersAPI(searchQuery);
      if (res.success) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequestAPI(userId);
      toast.success('Friend request sent!');
      fetchNetworkData(); // Refresh to update lists
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await respondToFriendRequestAPI(requestId, action);
      toast.success(`Request ${action}ed`);
      fetchNetworkData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error responding to request');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 shadow-2xl flex flex-col animate-fade-in-right">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#04AA6D]/10 rounded-lg text-[#04AA6D]">
              <Users size={18} />
            </div>
            <h2 className="font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider text-sm">Network</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20">
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'friends' ? 'border-[#04AA6D] text-[#04AA6D]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Friends ({friends.length})
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors relative ${activeTab === 'requests' ? 'border-[#04AA6D] text-[#04AA6D]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Requests
            {pendingReceived.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'search' ? 'border-[#04AA6D] text-[#04AA6D]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Find
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {loading && <div className="text-center text-xs text-slate-500 font-mono py-4">Loading...</div>}

          {!loading && activeTab === 'friends' && (
            <div className="space-y-3">
              {friends.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 font-sans">No friends yet. Head to 'Find' to connect with others!</p>
              ) : (
                friends.map(f => (
                  <div key={f._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group cursor-pointer border border-transparent dark:hover:border-slate-700">
                    <div className="relative">
                      {f.avatar ? (
                        <img src={f.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" alt={f.username} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 uppercase text-xs">
                          {f.username[0]}
                        </div>
                      )}
                      {/* Placeholder for online presence dot */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{f.fullName}</h4>
                      <p className="text-[10px] font-mono text-slate-500">@{f.username}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'requests' && (
            <div className="space-y-6">
              
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-3">Received ({pendingReceived.length})</h3>
                {pendingReceived.length === 0 ? (
                  <p className="text-xs text-slate-500">No pending requests.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingReceived.map(req => (
                      <div key={req._id} className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex justify-center items-center font-bold text-xs">
                            {req.sender.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{req.sender.fullName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">@{req.sender.username}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => handleRespond(req._id, 'accept')} className="flex-1 py-1.5 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-lg text-xs font-bold font-mono transition-colors flex justify-center items-center gap-1">
                            <Check size={12} /> Accept
                          </button>
                          <button onClick={() => handleRespond(req._id, 'reject')} className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold font-mono transition-colors flex justify-center items-center gap-1">
                            <XCircle size={12} /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-3">Sent ({pendingSent.length})</h3>
                <div className="space-y-2">
                  {pendingSent.map(req => (
                    <div key={req._id} className="flex justify-between items-center p-2 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">@{req.receiver.username}</span>
                      <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Pending</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {!loading && activeTab === 'search' && (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search username or email..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#04AA6D] transition-colors font-sans text-slate-800 dark:text-slate-200"
                />
                <button type="submit" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 transition-colors">
                  <Search size={16} />
                </button>
              </form>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                {searchResults.map(u => (
                  <div key={u._id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex justify-center items-center font-bold text-xs">
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">{u.fullName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">@{u.username}</p>
                      </div>
                    </div>
                    {friends.some(f => f._id === u._id) ? (
                      <span className="text-[10px] font-mono text-[#04AA6D] px-2 py-1 bg-emerald-500/10 rounded-lg">Friend</span>
                    ) : pendingSent.some(r => r.receiver._id === u._id) ? (
                       <span className="text-[10px] font-mono text-amber-500 px-2 py-1 bg-amber-500/10 rounded-lg">Pending</span>
                    ) : pendingReceived.some(r => r.sender._id === u._id) ? (
                       <span className="text-[10px] font-mono text-blue-500 px-2 py-1 bg-blue-500/10 rounded-lg">Respond</span>
                    ) : (
                      <button onClick={() => handleSendRequest(u._id)} className="p-1.5 bg-[#04AA6D]/10 hover:bg-[#04AA6D] text-[#04AA6D] hover:text-white rounded-lg transition-colors cursor-pointer">
                        <UserPlus size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FriendsSidebar;
