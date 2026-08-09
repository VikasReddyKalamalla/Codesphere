import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Plus, Trash2, ArrowRight, ArrowLeft, Image as ImageIcon, 
  HelpCircle, Code2, FileText, CheckCircle2, Award, Upload 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateTestModal = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);

  // Test General Info
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'dsa',
    technology: 'React & Node.js',
    difficulty: 'beginner',
    duration: 45,
    passingMarks: 60,
    totalMarks: 100,
    isPremium: false,
  });

  // Questions List
  const [questions, setQuestions] = useState([]);

  // Current Question Form State
  const [qForm, setQForm] = useState({
    questionTitle: '',
    questionType: 'mcq', // 'mcq', 'image', 'essay', 'coding'
    imageUrl: '',
    codeSnippet: '',
    options: ['', '', '', ''],
    correctAnswer: '0',
    marks: 1,
  });

  const handleTestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add Question to List
  const handleAddQuestion = () => {
    if (!qForm.questionTitle.trim()) {
      return toast.error('Question title is required');
    }

    if (qForm.questionType === 'mcq' || qForm.questionType === 'image') {
      const validOpts = qForm.options.filter(o => o.trim() !== '');
      if (validOpts.length < 2) {
        return toast.error('Multiple Choice questions must have at least 2 options');
      }
    }

    const newQuestion = {
      ...qForm,
      id: Date.now(),
      options: (qForm.questionType === 'mcq' || qForm.questionType === 'image') ? qForm.options.filter(o => o.trim() !== '') : [],
    };

    setQuestions(prev => [...prev, newQuestion]);
    toast.success('Question added to test template!');

    // Reset current question form
    setQForm({
      questionTitle: '',
      questionType: 'mcq',
      imageUrl: '',
      codeSnippet: '',
      options: ['', '', '', ''],
      correctAnswer: '0',
      marks: 1,
    });
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSubmitAll = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error('Assessment title is required');
    }

    const finalPayload = {
      ...formData,
      totalQuestions: questions.length,
      questions: questions
    };

    onSubmit && onSubmit(finalPayload);
    toast.success('Assessment with question templates created!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-[#04AA6D]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Assessment Builder</h2>
                <p className="text-xs text-slate-500 font-mono">
                  {step === 1 ? 'Step 1: Test Details & Rules' : `Step 2: Question Templates (${questions.length} added)`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-xs">
            {step === 1 ? (
              /* STEP 1: TEST METADATA */
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Assessment Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Masterclass DSA & Full Stack Engineering Assessment"
                    value={formData.title}
                    onChange={handleTestChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Skill Track</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleTestChange}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                    >
                      <option value="dsa">DSA & Algorithms</option>
                      <option value="fullstack">Full Stack & Web Dev</option>
                      <option value="system_design">System Design</option>
                      <option value="sql">Database & SQL</option>
                      <option value="ai">AI & Machine Learning</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleTestChange}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleTestChange}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Description & Instructions</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Instructions for students, anti-cheat rules, syllabus overview..."
                    value={formData.description}
                    onChange={handleTestChange}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                  />
                </div>
              </div>
            ) : (
              /* STEP 2: QUESTION BUILDER TEMPLATES */
              <div className="flex flex-col gap-6">
                
                {/* Question Creator Box */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Add New Question Template
                  </h3>

                  {/* Question Type Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'mcq', label: 'Multiple Choice', icon: HelpCircle },
                      { id: 'image', label: 'Image-Based', icon: ImageIcon },
                      { id: 'essay', label: 'Essay / Text', icon: FileText },
                      { id: 'coding', label: 'Code Snippet', icon: Code2 },
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setQForm({ ...qForm, questionType: t.id })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          qForm.questionType === t.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <t.icon className="w-4 h-4 shrink-0" />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Question Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Question Title / Prompt *</label>
                    <input
                      type="text"
                      placeholder="e.g. Which of the following data structures operates on a FIFO basis?"
                      value={qForm.questionTitle}
                      onChange={(e) => setQForm({ ...qForm, questionTitle: e.target.value })}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                    />
                  </div>

                  {/* Image URL input (if image type) */}
                  {qForm.questionType === 'image' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Diagram / Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-... or Cloudinary URL"
                        value={qForm.imageUrl}
                        onChange={(e) => setQForm({ ...qForm, imageUrl: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                      />
                    </div>
                  )}

                  {/* Code Snippet input (if coding type) */}
                  {qForm.questionType === 'coding' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Starter Code / Snippet</label>
                      <textarea
                        rows={3}
                        placeholder="function solution(a, b) {\n  // write code here\n}"
                        value={qForm.codeSnippet}
                        onChange={(e) => setQForm({ ...qForm, codeSnippet: e.target.value })}
                        className="w-full font-mono bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl p-3 placeholder-slate-600 focus:outline-none focus:border-[#04AA6D]"
                      />
                    </div>
                  )}

                  {/* Options (for MCQ & Image types) */}
                  {(qForm.questionType === 'mcq' || qForm.questionType === 'image') && (
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Answer Options & Correct Key</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {qForm.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQForm({ ...qForm, correctAnswer: String(idx) })}
                              className={`w-7 h-7 rounded-lg font-bold text-[10px] flex items-center justify-center shrink-0 border transition-all ${
                                qForm.correctAnswer === String(idx)
                                  ? 'bg-[#04AA6D] text-white border-emerald-400'
                                  : 'bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800'
                              }`}
                              title="Click to set as correct answer"
                            >
                              {String.fromCharCode(65 + idx)}
                            </button>
                            <input
                              type="text"
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...qForm.options];
                                newOpts[idx] = e.target.value;
                                setQForm({ ...qForm, options: newOpts });
                              }}
                              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="self-end px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question to Test
                  </button>
                </div>

                {/* Added Questions List */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Questions Preview ({questions.length})
                  </h3>

                  {questions.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {questions.map((q, idx) => (
                        <div key={q.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-[#04AA6D] font-mono font-bold flex items-center justify-center text-xs">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{q.questionTitle}</p>
                              <span className="text-[10px] text-slate-500 uppercase font-mono">{q.questionType}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No questions added yet. Use the template form above to add questions.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.title.trim()) return toast.error('Title is required');
                    setStep(2);
                  }}
                  className="px-6 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  Next: Add Questions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAll}
                  className="px-6 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Finish & Publish Assessment
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CreateTestModal;
