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
