import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Image as ImageIcon, Code2, FileText } from 'lucide-react';

export const QuestionCard = ({ question = {}, selectedOption, onSelectOption, textAnswer, onChangeTextAnswer }) => {
  const isEssay = question.type === 'long_answer' || question.type === 'short_answer' || question.type === 'essay';

  return (
    <Card>
      <CardBody className="flex flex-col gap-4 select-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-indigo-500 uppercase font-mono tracking-wider">
            {question.type ? question.type.replace('_', ' ') : 'Assessment Item'}
          </span>
          {question.marks && (
            <span className="text-[10px] font-extrabold text-slate-500 font-mono">
              +{question.marks} Marks
            </span>
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">
            {question.text || question.questionTitle}
          </h4>
          {question.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {question.description}
            </p>
          )}
        </div>

        {/* Image Attachment (Image-based Question) */}
        {question.imageUrl && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 max-h-64 flex justify-center">
            <img 
              src={question.imageUrl} 
              alt="Question Diagram" 
              className="max-h-60 object-contain rounded-xl"
            />
          </div>
        )}

        {/* Code Snippet Attachment (Coding Question) */}
        {question.codeSnippet && (
          <div className="w-full rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-2 font-sans border-b border-slate-800 pb-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Starter Code / Snippet</span>
            </div>
            <pre><code>{question.codeSnippet}</code></pre>
          </div>
        )}

        {/* Essay / Text Answer Input */}
        {isEssay ? (
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Your Written Response
            </label>
            <textarea
              rows={5}
              value={textAnswer || ''}
              onChange={(e) => onChangeTextAnswer && onChangeTextAnswer(e.target.value)}
              placeholder="Type your detailed answer or explanation here..."
              className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        ) : (
          /* MCQ & Options List */
          <div className="flex flex-col gap-2.5 mt-2">
            {(question.options || []).map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectOption && onSelectOption(idx)}
                className={`w-full text-left px-4 py-3 text-xs rounded-xl border transition-all flex items-center gap-3 ${
                  selectedOption === idx 
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs' 
                    : 'border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg font-bold text-[10px] flex items-center justify-center font-mono ${
                  selectedOption === idx ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
