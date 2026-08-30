import React, { useState } from 'react';
import { 
  ClipboardCheck, Plus, Award, Clock, Trash2, Edit3, Eye, Check, X, 
  HelpCircle, Code2, AlertTriangle, User, RefreshCw, BarChart2, FileText, CheckCircle2, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorAssessments = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 'q1',
      title: 'JavaScript Promises & Async/Await Mastery',
      category: 'JavaScript',
      type: 'MCQ & Code Output',
      duration: '30 Mins',
      passingScore: 75,
      questionsCount: 15,
      attemptsCount: 42,
      avgScore: 84.5,
      status: 'Active'
    },
    {
      id: 'q2',
      title: 'React Hooks & State Management Challenge',
      category: 'React',
      type: 'Code Output Prediction',
      duration: '45 Mins',
      passingScore: 80,
      questionsCount: 10,
      attemptsCount: 28,
      avgScore: 78.2,
      status: 'Active'
    },
    {
      id: 'q3',
      title: 'Node.js Event Loop & Stream Architecture',
      category: 'Backend Node.js',
      type: 'MCQ Quiz',
      duration: '20 Mins',
      passingScore: 70,
      questionsCount: 12,
      attemptsCount: 19,
      avgScore: 91.0,
      status: 'Draft'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedScoresModal, setSelectedScoresModal] = useState(null);

  // New Quiz Form State
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    category: 'JavaScript',
    duration: '30 Mins',
    passingScore: 75,
    questions: [
      {
        id: 1,
        type: 'mcq',
        question: 'What is the output of typeof null in JavaScript?',
        codeSnippet: '',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctIndex: 1,
        points: 5
      },
      {
        id: 2,
        type: 'code_output',
        question: 'What will be printed to the console?',
        codeSnippet: 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 3, 4, 2', '4, 3, 2, 1'],
        correctIndex: 1,
        points: 10
      }
    ]
  });

  const studentAttemptsData = [
    { id: 'st_1', name: 'Alex Rivera', email: 'alex@codesphere.io', score: 95, points: '19/20', timeTaken: '18 mins', tabSwitches: 0, status: 'PASSED' },
    { id: 'st_2', name: 'Sarah Jenkins', email: 'sarah@codesphere.io', score: 85, points: '17/20', timeTaken: '24 mins', tabSwitches: 1, status: 'PASSED' },
    { id: 'st_3', name: 'Michael Chen', email: 'michael@codesphere.io', score: 60, points: '12/20', timeTaken: '29 mins', tabSwitches: 3, status: 'FAILED' }
  ];

  const handleAddQuestion = () => {
    const nextId = newQuiz.questions.length + 1;
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: nextId,
          type: 'mcq',
          question: `Question #${nextId}: Enter question prompt here`,
          codeSnippet: '',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: 0,
          points: 5
        }
      ]
    }));
    toast.success(`Added Question #${nextId}`);
  };

  const handleRemoveQuestion = (idx) => {
    if (newQuiz.questions.length <= 1) return toast.error('Quiz must have at least 1 question');
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    if (!newQuiz.title.trim()) return toast.error('Please enter a quiz title');

    const createdItem = {
      id: `q_${Date.now()}`,
      title: newQuiz.title,
      category: newQuiz.category,
      type: `${newQuiz.questions.length} Questions (${newQuiz.duration})`,
      duration: newQuiz.duration,
      passingScore: newQuiz.passingScore,
      questionsCount: newQuiz.questions.length,
      attemptsCount: 0,
      avgScore: 0,
      status: 'Active'
    };

    setQuizzes([createdItem, ...quizzes]);
    setIsCreateModalOpen(false);
    toast.success('Assessment created & published successfully!');
  };

  const handleDeleteQuiz = (id, title) => {
    if (!window.confirm(`Delete assessment "${title}"?`)) return;
    setQuizzes(quizzes.filter(q => q.id !== id));
    toast.success('Assessment deleted');
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Assessments & Quiz Creator Engine</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Build timed quizzes, code output prediction challenges, anti-cheat proctored tests, and analyze student scores.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold font-mono px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create Assessment Quiz
        </button>
      </div>

      {/* Quizzes Roster */}
      <div className="flex flex-col gap-3">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:border-emerald-500/40 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">{quiz.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  quiz.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {quiz.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">{quiz.category}</span>
                <span>• {quiz.questionsCount} Questions</span>
                <span>• Duration: {quiz.duration}</span>
                <span>• Pass Target: {quiz.passingScore}%</span>
                <span>• {quiz.attemptsCount} Student Attempts</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button 
                onClick={() => setSelectedScoresModal(quiz)}
                className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono rounded-xl border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BarChart2 className="w-3.5 h-3.5" /> Student Scores
              </button>
              <button 
                onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Delete Assessment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment & Quiz Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Create Assessment Quiz</h3>
                  <span className="text-[10px] font-mono text-slate-400">Configure Questions, Code Output Snippets & Limits</span>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="flex flex-col gap-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-400 uppercase text-[10px]">Quiz Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JavaScript Promises & Async/Await Mastery Quiz"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 uppercase text-[10px]">Track / Category</label>
                  <select
                    value={newQuiz.category}
                    onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Backend Node.js">Backend Node.js</option>
                    <option value="Python">Python</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-400 uppercase text-[10px]">Time Duration Limit</label>
                  <select
                    value={newQuiz.duration}
                    onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-white"
                  >
                    <option value="15 Mins">15 Mins</option>
                    <option value="30 Mins">30 Mins</option>
                    <option value="45 Mins">45 Mins</option>
                    <option value="60 Mins">60 Mins</option>
                  </select>
                </div>
              </div>

              {/* Question Editor Array */}
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Questions ({newQuiz.questions.length})</h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-mono text-[11px] font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {newQuiz.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Question #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const updated = [...newQuiz.questions];
                            updated[idx].type = e.target.value;
                            setNewQuiz({ ...newQuiz, questions: updated });
                          }}
                          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px]"
                        >
                          <option value="mcq">MCQ Choice</option>
                          <option value="code_output">Code Output Prediction</option>
                        </select>
                        {newQuiz.questions.length > 1 && (
                          <button type="button" onClick={() => handleRemoveQuestion(idx)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter question text..."
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...newQuiz.questions];
                        updated[idx].question = e.target.value;
                        setNewQuiz({ ...newQuiz, questions: updated });
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />

                    {q.type === 'code_output' && (
                      <textarea
                        rows={3}
                        placeholder="Paste code snippet here..."
                        value={q.codeSnippet}
                        onChange={(e) => {
                          const updated = [...newQuiz.questions];
                          updated[idx].codeSnippet = e.target.value;
                          setNewQuiz({ ...newQuiz, questions: updated });
                        }}
                        className="w-full p-2.5 bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 rounded-xl focus:outline-none"
                      />
                    )}

                    {/* Options list */}
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${idx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => {
                              const updated = [...newQuiz.questions];
                              updated[idx].correctIndex = optIdx;
                              setNewQuiz({ ...newQuiz, questions: updated });
                            }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...newQuiz.questions];
                              updated[idx].options[optIdx] = e.target.value;
                              setNewQuiz({ ...newQuiz, questions: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold font-mono text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save & Publish Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Scores Modal */}
      {selectedScoresModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-xl w-full shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Student Attempts Score Analytics</span>
                <h3 className="text-base font-black">{selectedScoresModal.title}</h3>
              </div>
              <button onClick={() => setSelectedScoresModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-xs">
              {studentAttemptsData.map((st) => (
                <div key={st.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{st.name}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                        st.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-500'
                      }`}>
                        {st.status} ({st.score}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Points: {st.points} • Time: {st.timeTaken} • Tab Switches: {st.tabSwitches}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedScoresModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssessments;
