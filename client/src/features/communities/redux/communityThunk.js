import { 
  fetchCommunitiesAPI, 
  fetchCommunityDetailsAPI,
  createCommunityAPI,
  updateCommunityAPI,
  joinCommunityAPI,
  leaveCommunityAPI,
  fetchPostsAPI,
  createPostAPI,
  deletePostAPI,
  toggleLikePostAPI,
  toggleBookmarkPostAPI,
  togglePinPostAPI,
  fetchCommentsAPI,
  addCommentAPI,
  deleteCommentAPI
} from '../services/communityAPI.js';
import { getUserId } from '../utils/communityHelpers.js';

import { 
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
  deleteComment
} from './communitySlice.js';

import toast from 'react-hot-toast';

export const fetchCommunitiesThunk = (params) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await fetchCommunitiesAPI(params);
    const payload = res?.data || res;
    const list = Array.isArray(payload) ? payload : (payload?.communities || payload?.data || []);
    dispatch(fetchSuccess(list));
  } catch (err) {
    dispatch(fetchFailure(err.message));
    toast.error('Failed to load communities');
  }
};

export const fetchCommunityDetailsThunk = (id) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await fetchCommunityDetailsAPI(id);
    const payload = res.data || res;
    dispatch(fetchCommunitySuccess(payload));
  } catch (err) {
    dispatch(fetchFailure(err.message));
    toast.error('Failed to load community details');
  }
};

export const createCommunityThunk = (payload, onSuccess) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await createCommunityAPI(payload);
    const payloadData = res.data || res;
    toast.success('Community created successfully!');
    if (onSuccess) onSuccess(payloadData._id || payloadData);
  } catch (err) {
    dispatch(fetchFailure(err.message));
    toast.error(err.response?.data?.message || 'Failed to create community');
  }
};

export const updateCommunityThunk = (id, payload, onSuccess) => async (dispatch) => {
  try {
    const res = await updateCommunityAPI(id, payload);
    const payloadData = res.data || res;
    dispatch(fetchCommunitySuccess(payloadData));
    toast.success('Community settings saved!');
    if (onSuccess) onSuccess();
  } catch (err) {
    toast.error('Failed to save settings');
  }
};

export const joinCommunityThunk = (id) => async (dispatch, getState) => {
  try {
    const state = getState();
    const user = state.auth?.user;
    const userId = getUserId(user);

    const res = await joinCommunityAPI(id);
    const payloadData = res.data?.data || res.data || res;
    dispatch(updateCommunityMembership({
      ...payloadData,
      communityId: id,
      userId: payloadData.userId || userId,
      action: 'joined'
    }));
    await dispatch(fetchCommunitiesThunk());
    toast.success('Joined community!');
  } catch (err) {
    const isAlreadyMember = err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('already');
    if (isAlreadyMember) {
      const state = getState();
      const user = state.auth?.user;
      const userId = getUserId(user);
      dispatch(updateCommunityMembership({
        communityId: id,
        userId,
        action: 'joined'
      }));
      await dispatch(fetchCommunitiesThunk());
      toast.success('Joined community!');
    } else {
      toast.error(err.response?.data?.message || err.message || 'Failed to join community');
    }
  }
};

export const leaveCommunityThunk = (id) => async (dispatch, getState) => {
  try {
    const state = getState();
    const user = state.auth?.user;
    const userId = getUserId(user);

    const res = await leaveCommunityAPI(id);
    const payloadData = res.data?.data || res.data || res;
    dispatch(updateCommunityMembership({
      ...payloadData,
      communityId: id,
      userId: payloadData.userId || userId,
      action: 'left'
    }));
    await dispatch(fetchCommunitiesThunk());
    toast.success('Left community');
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || 'Failed to leave community');
  }
};

export const fetchPostsThunk = (communityId) => async (dispatch) => {
  try {
    const res = await fetchPostsAPI(communityId);
    const payload = res.data || res;
    dispatch(setPosts(payload.posts || payload || []));
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
};

export const createPostThunk = (payload) => async (dispatch) => {
  try {
    const res = await createPostAPI(payload);
    const payloadData = res.data || res;
    dispatch(addPost(payloadData));
    toast.success('Post published!');
  } catch (err) {
    toast.error('Failed to publish post');
  }
};

export const deletePostThunk = (id) => async (dispatch) => {
  try {
    await deletePostAPI(id);
    dispatch(deletePost(id));
    toast.success('Post deleted successfully');
  } catch (err) {
    toast.error('Failed to delete post');
  }
};

export const toggleLikePostThunk = (postId) => async (dispatch) => {
  try {
    const res = await toggleLikePostAPI(postId);
    const payload = res.data || res;
    dispatch(updatePost({ _id: postId, likeCount: payload.likeCount, likes: payload.liked ? [1] : [] })); // Mock simple check for user liked status
  } catch (err) {
    console.error('Failed to toggle like:', err);
  }
};

export const toggleBookmarkPostThunk = (postId) => async (dispatch) => {
  try {
    const res = await toggleBookmarkPostAPI(postId);
    const payload = res.data || res;
    dispatch(updatePost({ _id: postId, bookmarkCount: payload.bookmarkCount, bookmarks: payload.bookmarked ? [1] : [] }));
    toast.success(payload.bookmarked ? 'Post bookmarked' : 'Post removed from bookmarks');
  } catch (err) {
    console.error('Failed to toggle bookmark:', err);
  }
};

export const togglePinPostThunk = (postId) => async (dispatch) => {
  try {
    const res = await togglePinPostAPI(postId);
    const payload = res.data || res;
    dispatch(updatePost({ _id: postId, isPinned: payload.isPinned }));
    toast.success(payload.isPinned ? 'Post pinned to top' : 'Post unpinned');
  } catch (err) {
    toast.error('Failed to pin post');
  }
};

export const fetchCommentsThunk = (postId) => async (dispatch) => {
  try {
    const res = await fetchCommentsAPI(postId);
    const payload = res.data || res;
    dispatch(setComments({ postId, comments: payload.comments || payload || [] }));
  } catch (err) {
    console.error('Failed to load comments:', err);
  }
};

export const addCommentThunk = (payload) => async (dispatch) => {
  try {
    const res = await addCommentAPI(payload);
    const payloadData = res.data || res;
    dispatch(addComment(payloadData));
  } catch (err) {
    toast.error('Failed to post comment');
  }
};

export const deleteCommentThunk = (commentId, postId) => async (dispatch) => {
  try {
    await deleteCommentAPI(commentId);
    dispatch(deleteComment({ commentId, postId }));
    toast.success('Comment deleted');
  } catch (err) {
    toast.error('Failed to delete comment');
  }
};
