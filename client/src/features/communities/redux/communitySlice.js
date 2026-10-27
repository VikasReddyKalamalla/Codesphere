import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  activeCommunity: null,
  // Channels
  channels: [],
  categorizedChannels: {},
  activeChannel: null,
  // Direct WhatsApp Chats
  directChats: [],
  activeDirectChat: null,
  activeMode: 'community', // 'community' | 'direct'
  // Realtime Chat
  chatMessages: [],
  hasMoreMessages: false,
  // Forum Posts & Comments
  posts: [],
  comments: {},
  // Status
  status: 'idle',
  error: null,
};

const communitySlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
    },
    fetchCommunitySuccess: (state, action) => {
      state.status = 'succeeded';
      state.activeCommunity = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    updateCommunityMembership: (state, action) => {
      const raw = action.payload || {};
      const payloadData = (raw.data && raw.data.communityId) ? raw.data : raw;
      const { communityId, memberCount, members, userId, action: memberAction } = payloadData;
      if (!communityId) return;

      state.items = state.items.map((comm) => {
        if (comm._id !== communityId) return comm;

        let updatedMembers = comm.members ? [...comm.members] : [];

        if (members && Array.isArray(members)) {
          updatedMembers = members.map((m) => (m._id || m).toString());
        }

        if (userId) {
          const userIdStr = userId.toString();
          if (memberAction === 'joined') {
            const exists = updatedMembers.some((m) => (m._id || m).toString() === userIdStr);
            if (!exists) updatedMembers.push(userIdStr);
          } else if (memberAction === 'left') {
            updatedMembers = updatedMembers.filter((m) => (m._id || m).toString() !== userIdStr);
          }
        }

        const isJoined = memberAction === 'joined' ? true : memberAction === 'left' ? false : comm._isJoinedLocally;

        return {
          ...comm,
          _isJoinedLocally: isJoined,
          memberCount: typeof memberCount === 'number' ? memberCount : updatedMembers.length,
          members: updatedMembers,
        };
      });

      if (state.activeCommunity && state.activeCommunity._id === communityId) {
        let updatedActiveMembers = state.activeCommunity.members ? [...state.activeCommunity.members] : [];

        if (members && Array.isArray(members)) {
          updatedActiveMembers = members.map((m) => (m._id || m).toString());
        }

        if (userId) {
          const userIdStr = userId.toString();
          if (memberAction === 'joined') {
            const exists = updatedActiveMembers.some((m) => (m._id || m).toString() === userIdStr);
            if (!exists) updatedActiveMembers.push(userIdStr);
          } else if (memberAction === 'left') {
            updatedActiveMembers = updatedActiveMembers.filter((m) => (m._id || m).toString() !== userIdStr);
          }
        }

        state.activeCommunity = {
          ...state.activeCommunity,
          memberCount: typeof memberCount === 'number' ? memberCount : updatedActiveMembers.length,
          members: updatedActiveMembers,
        };
      }
    },

    // ─── Channels ─────────────────────────────────────────────────────────────
    setChannels: (state, action) => {
      const { channels, categorized } = action.payload;
      state.channels = channels || [];
      state.categorizedChannels = categorized || {};
      if (!state.activeChannel && channels && channels.length > 0) {
        state.activeChannel = channels.find((c) => c.slug === 'general') || channels[0];
      }
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
      state.activeMode = 'community';
    },
    addChannel: (state, action) => {
      const ch = action.payload;
      state.channels.push(ch);
      const cat = ch.category || 'General';
      if (!state.categorizedChannels[cat]) state.categorizedChannels[cat] = [];
      state.categorizedChannels[cat].push(ch);
    },

    // ─── Direct WhatsApp Chats ────────────────────────────────────────────────
    setDirectChats: (state, action) => {
      state.directChats = action.payload || [];
    },
    setActiveDirectChat: (state, action) => {
      state.activeDirectChat = action.payload;
      state.activeMode = 'direct';
    },
    setActiveMode: (state, action) => {
      state.activeMode = action.payload;
    },

    // ─── Realtime Messages & WhatsApp Ticks ───────────────────────────────────
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload || [];
    },
    prependChatMessages: (state, action) => {
      state.chatMessages = [...(action.payload || []), ...state.chatMessages];
    },
    addChatMessage: (state, action) => {
      const msg = action.payload;
      const exists = state.chatMessages.some((m) => m._id === msg._id);
      if (!exists) {
        state.chatMessages = [...state.chatMessages, msg];
      }
    },
    updateChatMessage: (state, action) => {
      const msg = action.payload;
      state.chatMessages = state.chatMessages.map((m) => (m._id === msg._id ? { ...m, ...msg } : m));
    },
    deleteChatMessage: (state, action) => {
      state.chatMessages = state.chatMessages.filter((m) => m._id !== action.payload);
    },
    updateDeliveryStatus: (state, action) => {
      const { messageId, deliveryStatus } = action.payload;
      state.chatMessages = state.chatMessages.map((m) =>
        m._id === messageId ? { ...m, deliveryStatus } : m
      );
    },
    updateReactions: (state, action) => {
      const { messageId, reactions } = action.payload;
      state.chatMessages = state.chatMessages.map((m) =>
        m._id === messageId ? { ...m, reactions } : m
      );
    },

    // ─── Posts & Comments ─────────────────────────────────────────────────────
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePost: (state, action) => {
      const updated = action.payload;
      state.posts = state.posts.map((p) => (p._id === updated._id ? { ...p, ...updated } : p));
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.comments[postId] = comments;
    },
    addComment: (state, action) => {
      const comment = action.payload;
      const postId = comment.postId;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      if (comment.parentComment) {
        state.comments[postId] = state.comments[postId].map((c) => {
          if (c._id === comment.parentComment) {
            return {
              ...c,
              replies: [...(c.replies || []), comment],
            };
          }
          return c;
        });
      } else {
        state.comments[postId] = [...state.comments[postId], comment];
      }
    },
    deleteComment: (state, action) => {
      const { commentId, postId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId]
          .filter((c) => c._id !== commentId)
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r._id !== commentId),
          }));
      }
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchCommunitySuccess,
  fetchFailure,
  updateCommunityMembership,
  setChannels,
  setActiveChannel,
  addChannel,
  setDirectChats,
  setActiveDirectChat,
  setActiveMode,
  setChatMessages,
  prependChatMessages,
  addChatMessage,
  updateChatMessage,
  deleteChatMessage,
  updateDeliveryStatus,
  updateReactions,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setComments,
  addComment,
  deleteComment,
} = communitySlice.actions;

export default communitySlice.reducer;
