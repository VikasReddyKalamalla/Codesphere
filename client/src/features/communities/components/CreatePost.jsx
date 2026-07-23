import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Code, Image, Video, BarChart2, Plus, 
  Trash2, X, Sparkles, Layers, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createPostThunk } from '../redux/communityThunk.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const CreatePost = ({ communityId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState('text'); // text, code, poll
  const [previewMode, setPreviewMode] = useState(false);

  // Snippet state
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Image/Video state
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleAddOption = () => {
    if (pollOptions.length >= 6) {
      toast.error('Maximum 6 options allowed');
      return;
    }
    setPollOptions([...pollOptions, '']);
  };

  const handleRemoveOption = (index) => {
    if (pollOptions.length <= 2) {
      toast.error('Minimum 2 options required');
      return;
    }
    setPollOptions(pollOptions.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (value, index) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !codeSnippet.trim() && activeTab !== 'poll') {
      toast.error('Post content cannot be empty');
      return;
    }

    const payload = {
      communityId,
      title: title.trim(),
      content: content.trim()
    };

    // Code Snippet integration
    if (activeTab === 'code' && codeSnippet.trim()) {
      payload.codeSnippet = codeSnippet.trim();
      payload.codeLanguage = codeLanguage;
    }

    // Poll integration
    if (activeTab === 'poll') {
      const filteredOptions = pollOptions.filter(o => o.trim() !== '');
      if (!pollQuestion.trim() || filteredOptions.length < 2) {
        toast.error('Please specify a question and at least 2 options');
        return;
      }
      payload.poll = {
        question: pollQuestion.trim(),
        options: filteredOptions.map(o => ({ text: o.trim(), votes: 0 }))
      };
      payload.content = `Poll: ${pollQuestion.trim()}`;
    }

    // Attach Image
    if (imageUrl.trim()) {
      payload.images = [imageUrl.trim()];
    }

    dispatch(createPostThunk(payload));

    // Clear state
    setContent('');
    setTitle('');
    setCodeSnippet('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setImageUrl('');
    setShowImageInput(false);
    setActiveTab('text');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-2xl text-left select-none">
      
      {/* Upper info row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-955 flex items-center justify-center shrink-0">
          {currentUser?.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser?.fullName} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {(currentUser?.fullName || 'U').slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">What's on your mind, {currentUser?.fullName?.split(' ')[0]}?</span>
        
        {/* Editor Preview switch */}
        <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-0.5 rounded-lg ml-auto text-[9px] font-bold uppercase tracking-wider font-mono">
          <button 
            onClick={() => setPreviewMode(false)}
            className={`px-2.5 py-1 rounded-md transition-all ${!previewMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'}`}
          >
            Edit
          </button>
          <button 
            onClick={() => setPreviewMode(true)}
            className={`px-2.5 py-1 rounded-md transition-all ${previewMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-455 dark:text-slate-500 hover:text-slate-850 dark:hover:text-slate-355'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="min-h-[120px] bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-xl p-4.5 mb-4 select-text">
          {title && <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2">{title}</h4>}
          <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{content || 'Nothing written yet...'}</p>
          
          {activeTab === 'code' && codeSnippet && (
            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-955 p-3 font-mono text-[9px] text-indigo-650 dark:text-indigo-400 text-left">
              <pre>{codeSnippet}</pre>
            </div>
          )}

          {activeTab === 'poll' && pollQuestion && (
            <div className="mt-3 bg-slate-50 dark:bg-slate-955/60 border border-slate-200 dark:border-slate-900 rounded-xl p-4.5 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-202">📊 {pollQuestion}</span>
              {pollOptions.map((opt, i) => opt && (
                <div key={i} className="bg-white dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 text-[10px] px-3.5 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 font-bold">
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Post Title */}
          <input 
            type="text" 
            placeholder="Post Title (Optional)" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 font-sans"
          />

          {/* Text editor view */}
          {activeTab === 'text' && (
            <textarea 
              placeholder="Share a project, achievement, or ask a question using markdown..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 resize-none font-sans"
            />
          )}

          {/* Code snippet view */}
          {activeTab === 'code' && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">Language:</span>
                <select 
                  value={codeLanguage} 
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 rounded-lg py-1 px-2.5 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML/CSS</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <textarea 
                placeholder="// Write or paste code snippet here..." 
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={5}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-indigo-650 dark:text-indigo-400 focus:border-indigo-550 font-mono resize-none text-left"
              />
              <textarea 
                placeholder="Description of the code snippet..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-550 resize-none font-sans"
              />
            </div>
          )}

          {/* Poll creator view */}
          {activeTab === 'poll' && (
            <div className="bg-slate-50 dark:bg-slate-955/30 border border-slate-200 dark:border-slate-900 rounded-xl p-4 flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Ask a question..." 
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
              />
              
              <div className="flex flex-col gap-2.5">
                {pollOptions.map((opt, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder={`Option ${index + 1}`} 
                      value={opt}
                      onChange={(e) => handleOptionChange(e.target.value, index)}
                      className="flex-1 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-[11px] px-3.5 py-2 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
                    />
                    {pollOptions.length > 2 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOption(index)}
                        className="p-1.5 text-red-500 hover:text-red-405 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={handleAddOption}
                className="self-start text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 flex items-center gap-1 mt-1 transition-colors"
              >
                <Plus size={11} />
                <span>Add Option</span>
              </button>
            </div>
          )}

          {/* Image URL Input */}
          {showImageInput && (
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Paste Image URL..." 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 font-sans"
              />
              <button 
                type="button" 
                onClick={() => { setImageUrl(''); setShowImageInput(false); }}
                className="p-2 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-850 pt-3 mt-1">
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <button 
                type="button"
                onClick={() => { setActiveTab('text'); setPreviewMode(false); }}
                className={`p-2 rounded-xl transition-all ${activeTab === 'text' ? 'text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'}`}
                title="Post Text/Markdown"
              >
                <Edit3 size={14} />
              </button>
              
              <button 
                type="button"
                onClick={() => { setActiveTab('code'); setPreviewMode(false); }}
                className={`p-2 rounded-xl transition-all ${activeTab === 'code' ? 'text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'}`}
                title="Embed Code Snippet"
              >
                <Code size={14} />
              </button>
              
              <button 
                type="button"
                onClick={() => { setActiveTab('poll'); setPreviewMode(false); }}
                className={`p-2 rounded-xl transition-all ${activeTab === 'poll' ? 'text-indigo-655 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'}`}
                title="Create a Poll"
              >
                <BarChart2 size={14} />
              </button>

              <button 
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-xl transition-all ${imageUrl ? 'text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'}`}
                title="Add Image Attachment"
              >
                <Image size={14} />
              </button>
            </div>

            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Post
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
export default CreatePost;
