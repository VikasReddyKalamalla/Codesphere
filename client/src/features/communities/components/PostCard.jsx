import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Heart, MessageSquare, Bookmark, Pin, Trash2, Share2, 
  Code, Image, Video, CheckCircle, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  toggleLikePostThunk, 
  toggleBookmarkPostThunk, 
  togglePinPostThunk,
  deletePostThunk,
  fetchCommentsThunk,
  addCommentThunk
} from '../redux/communityThunk.js';
import { selectPostComments } from '../redux/communitySelectors.js';
import { CommentCard } from './CommentCard.jsx';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const PostCard = ({ post = {}, community = {} }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const comments = useSelector(selectPostComments(post._id));
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = post.likes?.includes(currentUser?._id);
  const isBookmarked = post.bookmarks?.includes(currentUser?._id);
  const isAuthor = post.author?._id === currentUser?._id;
  const isOwner = community.owner?._id === currentUser?._id || community.owner === currentUser?._id;
  const isModerator = community.moderators?.some(m => m === currentUser?._id || m._id === currentUser?._id);
  const canDelete = isAuthor || isOwner || isModerator;
  const canPin = isOwner || isModerator;

  useEffect(() => {
    if (showComments) {
      dispatch(fetchCommentsThunk(post._id));
    }
  }, [showComments, post._id, dispatch]);

  const handleLike = () => {
    dispatch(toggleLikePostThunk(post._id));
  };

  const handleBookmark = () => {
    dispatch(toggleBookmarkPostThunk(post._id));
  };

  const handlePin = () => {
    dispatch(togglePinPostThunk(post._id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePostThunk(post._id));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(addCommentThunk({
      postId: post._id,
      content: commentText.trim()
    }));
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/community/${post.communityId}/posts/${post._id}`);
    toast.success('Post link copied to clipboard!');
  };

  // Formatted date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/25 transition-all shadow-sm dark:shadow-xl text-left select-none relative group">
      
      {/* Pin Badge */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-indigo-650 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider font-mono mb-3">
          <Pin size={10} className="rotate-45 fill-indigo-500 dark:fill-indigo-400" />
          <span>Pinned by Admin</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-955 flex items-center justify-center shrink-0">
            {post.author?.avatar ? (
              <img 
                src={post.author.avatar} 
                alt={post.author?.fullName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-xs font-bold text-slate-500 uppercase">
                {(post.author?.fullName || 'U').slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-205">{post.author?.fullName}</span>
              
              {/* Badge based on roles */}
              {isOwner && (
                <span className="text-[7.5px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-1.5 py-0.2 rounded uppercase">Owner</span>
              )}
              {!isOwner && isModerator && (
                <span className="text-[7.5px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 px-1.5 py-0.2 rounded uppercase">Mod</span>
              )}
            </div>
            <span className="text-[10px] text-slate-455 dark:text-slate-500 font-mono">{formatDate(post.createdAt || post.time)}</span>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
          >
            <MoreVertical size={14} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 shadow-2xl p-1 z-10 font-sans">
              {canPin && (
                <button 
                  onClick={() => { handlePin(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-left font-bold"
                >
                  <Pin size={12} />
                  <span>{post.isPinned ? 'Unpin Post' : 'Pin Post'}</span>
                </button>
              )}
              {canDelete && (
                <button 
                  onClick={() => { handleDelete(); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left font-bold"
                >
                  <Trash2 size={12} />
                  <span>Delete Post</span>
                </button>
              )}
              <button 
                onClick={() => { handleShare(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-left font-bold"
              >
                <Share2 size={12} />
                <span>Share Link</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title & Body */}
      {post.title && (
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-4 leading-snug">{post.title}</h4>
      )}
      <p className="text-xs text-slate-655 dark:text-slate-300 mt-2.5 leading-relaxed whitespace-pre-wrap select-text">{post.content}</p>

      {/* Code Snippet View */}
      {post.codeSnippet && (
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[10px] p-4 relative select-text text-left">
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <span className="text-[8px] font-bold text-slate-455 dark:text-slate-500 uppercase bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded">{post.codeLanguage || 'javascript'}</span>
          </div>
          <pre className="text-[#04AA6D] dark:text-emerald-400 overflow-x-auto max-w-full leading-relaxed">{post.codeSnippet}</pre>
        </div>
      )}

      {/* Media Attachments */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-4 rounded-xl overflow-hidden">
          {post.images.map((img, idx) => (
            <img key={idx} src={img} alt="Post Attachment" className="max-h-[300px] w-full object-cover border border-slate-150 dark:border-slate-800 rounded-xl" />
          ))}
        </div>
      )}

      {/* Post Actions footer */}
      <div className="flex items-center gap-5 mt-5 pt-3.5 border-t border-slate-150 dark:border-slate-850">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ${
            isLiked ? 'text-[#04AA6D] dark:text-emerald-400' : 'text-slate-455 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          <Heart size={14} className={isLiked ? 'fill-[#04AA6D] text-[#04AA6D]' : ''} />
          <span>{post.likeCount || 0}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ${
            showComments ? 'text-[#04AA6D] dark:text-emerald-400 font-bold' : 'text-slate-455 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          <MessageSquare size={14} />
          <span>{post.commentCount || 0}</span>
        </button>

        <button 
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ml-auto ${
            isBookmarked ? 'text-[#04AA6D] dark:text-emerald-400' : 'text-slate-455 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
          }`}
        >
          <Bookmark size={14} className={isBookmarked ? 'fill-[#04AA6D] text-[#04AA6D]' : ''} />
          <span>Save</span>
        </button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="mt-5 border-t border-slate-150 dark:border-slate-850 pt-4 flex flex-col gap-4 animate-fade-in">
          
          {/* Write comment */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Write a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500"
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              Comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-6 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              Be the first to comment!
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar select-text">
              {comments.map((comment) => (
                <CommentCard key={comment._id} comment={comment} postId={post._id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default PostCard;
