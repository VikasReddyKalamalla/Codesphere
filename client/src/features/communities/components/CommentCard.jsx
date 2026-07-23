import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Trash2, CornerDownRight } from 'lucide-react';
import { addCommentThunk, deleteCommentThunk } from '../redux/communityThunk.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const CommentCard = ({ comment = {}, postId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const isAuthor = comment.author?._id === currentUser?._id;
  const canDelete = isAuthor || currentUser?.role === 'admin';

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    dispatch(addCommentThunk({
      postId,
      content: replyText.trim(),
      parentComment: comment._id
    }));
    setReplyText('');
    setShowReplyForm(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this comment?')) {
      dispatch(deleteCommentThunk(comment._id, postId));
    }
  };

  // Formatted date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-2.5">
      
      {/* Top level comment */}
      <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-xl p-3.5 flex flex-col gap-2 select-text hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex items-center justify-center shrink-0">
              {comment.author?.avatar ? (
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author?.fullName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-[9px] font-bold text-slate-500 uppercase">
                  {(comment.author?.fullName || 'U').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{comment.author?.fullName}</span>
          </div>
          <span className="text-[9px] text-slate-455 dark:text-slate-500 font-mono">{formatDate(comment.createdAt || comment.time)}</span>
        </div>

        <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-sans pl-1 text-left">{comment.content}</p>

        {/* Comment footer actions */}
        <div className="flex items-center gap-4 mt-1 text-[9px] text-slate-455 dark:text-slate-500 font-semibold">
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-350 transition-colors"
          >
            <MessageSquare size={11} />
            <span>Reply</span>
          </button>

          {canDelete && (
            <button 
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-500 hover:text-red-400 ml-auto transition-colors"
            >
              <Trash2 size={11} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Reply input form */}
      {showReplyForm && (
        <form onSubmit={handleAddReply} className="flex gap-2 pl-6 animate-fade-in">
          <input 
            type="text" 
            placeholder={`Reply to ${comment.author?.fullName}...`} 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 text-[11px] px-3 py-1.5 rounded-lg outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
            autoFocus
          />
          <button 
            type="submit" 
            className="bg-indigo-650 hover:bg-indigo-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            Reply
          </button>
        </form>
      )}

      {/* Nested Replies list */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-2 pl-6 border-l border-slate-200 dark:border-slate-900 mt-0.5">
          {comment.replies.map((reply) => {
            const isReplyAuthor = reply.author?._id === currentUser?._id;
            const canDeleteReply = isReplyAuthor || currentUser?.role === 'admin';
            
            const handleReplyDelete = () => {
              if (window.confirm('Delete this reply?')) {
                dispatch(deleteCommentThunk(reply._id, postId));
              }
            };

            return (
              <div key={reply._id} className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-900/60 rounded-xl p-3 flex flex-col gap-1.5 hover:border-slate-200 dark:hover:border-slate-800 transition-colors select-text relative text-left">
                <CornerDownRight size={10} className="absolute left-[-18px] top-4 text-slate-300 dark:text-slate-700" />
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 flex items-center justify-center shrink-0">
                      {reply.author?.avatar ? (
                        <img 
                          src={reply.author.avatar} 
                          alt={reply.author?.fullName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-[8px] font-bold text-slate-500 uppercase">
                          {(reply.author?.fullName || 'U').slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-350">{reply.author?.fullName}</span>
                  </div>
                  <span className="text-[8px] text-slate-455 dark:text-slate-500 font-mono">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="text-[11px] text-slate-655 dark:text-slate-300 leading-relaxed pl-1">{reply.content}</p>
                
                {canDeleteReply && (
                  <button 
                    onClick={handleReplyDelete}
                    className="self-end text-[8px] text-red-500 hover:text-red-400 mt-0.5 flex items-center gap-0.5"
                  >
                    <Trash2 size={9} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default CommentCard;
