import React, { useState } from 'react';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const QuizLesson = ({ lesson = {} }) => {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const choices = lesson.options || ['Option A', 'Option B', 'Option C', 'Option D'];

  const handleSubmit = () => {
    if (selected === null) {
      toast.error('Choose a choice first');
      return;
    }
    setSubmitted(true);
    toast.success('Response registered successfully!');
  };

  return (
    <div className="max-w-md mx-auto border border-slate-200 dark:border-slate-805 bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col gap-4 shadow-sm select-none">
      <div>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Quick Quiz</span>
        <h4 className="text-sm font-semibold text-slate-850 dark:text-white mt-1">{lesson.question || 'Select the correct statement'}</h4>
      </div>
      <div className="flex flex-col gap-2.5">
        {choices.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={submitted}
            onClick={() => setSelected(idx)}
            className={`w-full text-left px-4 py-2.5 text-xs rounded-lg border transition-all ${selected === idx ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-bold' : 'border-slate-200 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button variant="primary" onClick={handleSubmit} className="w-full mt-2" disabled={submitted}>
        {submitted ? 'Completed' : 'Submit response'}
      </Button>
    </div>
  );
};
