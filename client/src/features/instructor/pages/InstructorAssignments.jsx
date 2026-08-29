import React, { useState } from 'react';
import { 
  FileText, Plus, RefreshCw, CheckCircle2, Clock, Award, Users, X, Code2, Sparkles, Check, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([
    { 
      id: 'asgn_1', 
      name: 'Build a Custom Express Middleware', 
      deadline: 'August 15, 2026', 
      submissions: '32 submissions', 
      pending: 5,
      maxPoints: 100,
      studentSubmissions: [
        { id: 'sub_1', studentName: 'Sarah Jenkins', submittedAt: 'Aug 14, 2026', score: '100/100', passRate: '8/8 Passed', code: 'const rateLimiter = (req, res, next) => {\n  const ip = req.ip;\n  if (cache.get(ip) > 10) return res.status(429).json({ error: "Too Many Requests" });\n  cache.set(ip, (cache.get(ip) || 0) + 1);\n  next();\n};', aiFeedback: 'Excellent implementation. Proper status code 429 and IP tracking.' },
        { id: 'sub_2', studentName: 'Alex Rivera', submittedAt: 'Aug 15, 2026', score: '85/100', passRate: '7/8 Passed', code: 'function authCheck(req, res, next) {\n  const token = req.headers.authorization;\n  if (!token) return res.sendStatus(401);\n  next();\n}', aiFeedback: 'Good approach. Consider checking token prefix Bearer before validation.' },
        { id: 'sub_3', studentName: 'David Kim', submittedAt: 'Aug 15, 2026', score: '92/100', passRate: '8/8 Passed', code: 'module.exports = (options) => {\n  return (req, res, next) => {\n    res.setHeader("X-Powered-By", "CodeSphere Sandbox");\n    next();\n  };\n};', aiFeedback: 'Clean closure pattern middleware.' }
      ]
    },
    { 
      id: 'asgn_2', 
      name: 'Mongoose Pre-Save Schema Hook Fixes', 
      deadline: 'August 20, 2026', 
      submissions: '14 submissions', 
      pending: 2,
      maxPoints: 100,
      studentSubmissions: [
        { id: 'sub_4', studentName: 'Emily Watson', submittedAt: 'Aug 19, 2026', score: '95/100', passRate: '5/5 Passed', code: 'userSchema.pre("save", async function(next) {\n  if (!this.isModified("password")) return next();\n  this.password = await bcrypt.hash(this.password, 10);\n  next();\n});', aiFeedback: 'Optimal bcrypt hashing pre-save hook.' }
      ]
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGradingModal, setSelectedGradingModal] = useState(null);
  const [activeStudentSub, setActiveStudentSub] = useState(null);
  const [gradeInput, setGradeInput] = useState('95');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [newAsgn, setNewAsgn] = useState({
    name: '',
    deadline: 'August 30, 2026',
    maxPoints: '100'
  });

  const handleCreateAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!newAsgn.name.trim()) {
      toast.error('Please enter assignment name.');
      return;
    }

    const created = {
      id: `asgn_${Date.now()}`,
      name: newAsgn.name,
      deadline: newAsgn.deadline,
      submissions: '0 submissions',
      pending: 0,
      maxPoints: parseInt(newAsgn.maxPoints, 10) || 100,
      studentSubmissions: []
    };

    setAssignments(prev => [created, ...prev]);
    setIsCreateModalOpen(false);
    setNewAsgn({ name: '', deadline: 'August 30, 2026', maxPoints: '100' });
    toast.success(`Created assignment: "${created.name}"`);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    toast.success(`Grade (${gradeInput}/100) and feedback saved for ${activeStudentSub?.studentName || 'Student'}!`);
    setActiveStudentSub(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Student Assignments Manager</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review homework submissions, inspect student code diffs, and submit grades.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create Assignment
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {assignments.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors flex justify-between items-center shadow-sm">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                <span>Deadline: {item.deadline}</span>
                <span>• {item.submissions}</span>
                <span className="text-amber-500 font-bold">• {item.pending} pending review</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedGradingModal(item);
                if (item.studentSubmissions?.length > 0) {
                  setActiveStudentSub(item.studentSubmissions[0]);
                  setFeedbackInput(item.studentSubmissions[0].aiFeedback || '');
                }
              }}
              className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl font-mono border border-indigo-500/30 transition-colors cursor-pointer"
            >
              Grade Submissions ({item.studentSubmissions?.length || 0})
            </button>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black">Create Student Assignment</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="flex flex-col gap-4 mt-4 text-xs font-mono">
              <div>
                <label className="font-bold text-slate-400 uppercase">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Build JWT Refresh Token Auth Flow"
                  value={newAsgn.name}
                  onChange={(e) => setNewAsgn({ ...newAsgn, name: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 uppercase">Deadline</label>
                  <input
                    type="text"
                    value={newAsgn.deadline}
                    onChange={(e) => setNewAsgn({ ...newAsgn, deadline: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 uppercase">Max Points</label>
                  <input
                    type="text"
                    value={newAsgn.maxPoints}
                    onChange={(e) => setNewAsgn({ ...newAsgn, maxPoints: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submissions & Auto-Evaluator Modal */}
      {selectedGradingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedGradingModal.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">Grading & AI Auto-Evaluator</span>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedGradingModal(null); setActiveStudentSub(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split View */}
            <div className="flex flex-col md:flex-row gap-4 mt-4 flex-1 overflow-hidden">
              {/* Left Roster */}
              <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 pr-3 flex flex-col gap-2 overflow-y-auto">
                <span className="text-[10px] font-bold font-mono uppercase text-slate-400 mb-1">Student Submissions</span>
                {selectedGradingModal.studentSubmissions?.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveStudentSub(sub);
                      setFeedbackInput(sub.aiFeedback || '');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      activeStudentSub?.id === sub.id
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-sans text-slate-900 dark:text-white">{sub.studentName}</span>
                      <span className="text-[10px] font-mono font-extrabold text-emerald-400">{sub.passRate}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Submitted: {sub.submittedAt}</span>
                  </button>
                ))}
              </div>

              {/* Right Code Inspector & Grade Panel */}
              <div className="w-full md:w-2/3 flex flex-col gap-3 overflow-y-auto pl-1">
                {activeStudentSub ? (
                  <form onSubmit={handleGradeSubmit} className="flex flex-col gap-3 text-xs font-mono">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white font-sans text-sm">{activeStudentSub.studentName}</span>
                        <div className="text-[10px] text-slate-400">Submission Code Preview</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {activeStudentSub.passRate}
                      </span>
                    </div>

                    {/* Code Snippet Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto max-h-48">
                      {activeStudentSub.code}
                    </div>

                    {/* AI Feedback Banner */}
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-start gap-2 text-[11px] font-sans">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold font-mono uppercase text-[10px] text-purple-400">AI Code Evaluator Insight: </span>
                        {activeStudentSub.aiFeedback}
                      </div>
                    </div>

                    {/* Grade Input & Feedback */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div>
                        <label className="font-bold text-slate-400 uppercase">Grade (Out of 100)</label>
                        <input
                          type="text"
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-400 uppercase">Instructor Feedback</label>
                        <input
                          type="text"
                          placeholder="Add comments..."
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post Grade & Feedback
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="py-12 text-center text-slate-400 font-mono text-xs">
                    Select a student submission from the left roster to inspect code and grade.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssignments;
