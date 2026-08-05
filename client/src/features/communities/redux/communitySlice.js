import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  activeCommunity: null,
  posts: [],
  comments: {}, // mapped by postId
  chatMessages: [],
  status: 'idle',
  error: null
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

      // Update in items list
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
          members: updatedMembers
        };
      });

      // Update in activeCommunity if loaded
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
          members: updatedActiveMembers
        };
      }
    },
    
    // Posts
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePost: (state, action) => {
      const updated = action.payload;
      state.posts = state.posts.map(p => p._id === updated._id ? { ...p, ...updated } : p);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(p => p._id !== action.payload);
    },

    // Comments
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
        // Nested reply
        state.comments[postId] = state.comments[postId].map(c => {
          if (c._id === comment.parentComment) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          }
          return c;
        });
      } else {
        // Top-level comment
        state.comments[postId] = [...state.comments[postId], comment];
      }
    },
    deleteComment: (state, action) => {
      const { commentId, postId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId]
          .filter(c => c._id !== commentId)
          .map(c => ({
            ...c,
            replies: (c.replies || []).filter(r => r._id !== commentId)
          }));
      }
    },

    // Realtime chat messages
    setChatMessages: (state, action) => {
      state.chatMessages = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages = [...state.chatMessages, action.payload];
    },
    updateChatMessage: (state, action) => {
      const msg = action.payload;
      state.chatMessages = state.chatMessages.map(m => m._id === msg._id ? msg : m);
    },
    deleteChatMessage: (state, action) => {
      state.chatMessages = state.chatMessages.filter(m => m._id !== action.payload);
    }
  }
});

export const {
  fetchStart,
  fetchSuccess,
  fetchCommunitySuccess,
  fetchFailure,
  updateCommunityMembership,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setComments,
  addComment,
  deleteComment,
  setChatMessages,
  addChatMessage,
  updateChatMessage,
  deleteChatMessage
} = communitySlice.actions;

export default communitySlice.reducer;
