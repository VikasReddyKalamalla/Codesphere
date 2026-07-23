import React from 'react';
import { 
  GitFork, FileText, ClipboardCheck, MessageSquare, 
  HardDrive, Settings, Plus, Calendar, User, CheckCircle
} from 'lucide-react';

const mockData = {
  'learning-paths': {
    title: 'Learning Path Roadmaps',
    desc: 'Sequence multiple courses to design career-ready curriculums.',
    icon: GitFork,
    stats: [{ label: 'Active Roadmaps', val: '4' }, { label: 'Total Enrolled', val: '840' }],
    items: [
      { name: 'Frontend Engineer Career Path', courses: '4 courses', level: 'Beginner to Advanced' },
      { name: 'Backend Masterclass Roadmap', courses: '5 courses', level: 'Intermediate to Expert' },
      { name: 'AI & Data Science Pathway', courses: '3 courses', level: 'Advanced' }
    ]
  },
  'assignments': {
    title: 'Assignments Manager',
    desc: 'Design and review student homework submissions and practical tasks.',
    icon: FileText,
    stats: [{ label: 'Pending Review', val: '18' }, { label: 'Graded Tasks', val: '142' }],
    items: [
      { name: 'Build a Custom Express Middleware', deadline: 'July 10, 2026', submissions: '32 submissions' },
      { name: 'Mongoose Pre-Save Schema Hook Fixes', deadline: 'July 15, 2026', submissions: '14 submissions' }
    ]
  },
  'assessments': {
    title: 'Assessments & Timed Quizzes',
    desc: 'Conduct timed coding challenges and multiple choice questionnaires.',
    icon: ClipboardCheck,
    stats: [{ label: 'Active Quizzes', val: '6' }, { label: 'Average Score', val: '84%' }],
    items: [
      { name: 'JavaScript Promises & Async/Await Quiz', type: 'MCQ (20 questions)', duration: '30 mins' },
      { name: 'React Hooks State Challenge', type: 'Coding Test (2 exercises)', duration: '45 mins' }
    ]
  },
  'communities': {
    title: 'Community Forums Owner',
    desc: 'Moderate your cohort discussions, publish pinned announcements, and interact with followers.',
    icon: MessageSquare,
    stats: [{ label: 'Followers', val: '540' }, { label: 'Discussion Threads', val: '84' }],
    items: [
      { name: 'React 19 Server Components Q&A', replies: '34 replies', active: 'Active today' },
      { name: 'Job Referrals & Portfolios Review', replies: '12 replies', active: 'Active yesterday' }
    ]
  },
  'resources': {
    title: 'Resource Repository',
    desc: 'Upload notes, PDFs, code playpen templates, and scripts for your students.',
    icon: HardDrive,
    stats: [{ label: 'Files Uploaded', val: '32' }, { label: 'Storage Used', val: '1.2 GB' }],
    items: [
      { name: 'Node.js WebSockets Boilerplate.zip', size: '4.8 MB', downloads: '180 downloads' },
      { name: 'Database Seed Scripts.sql', size: '12 KB', downloads: '92 downloads' }
    ]
  },
  'settings': {
    title: 'Instructor Portal Preferences',
    desc: 'Configure notification rules, meet links, visual themes, and profile tags.',
    icon: Settings,
    stats: [{ label: 'Notification Channels', val: 'Email/SMS' }, { label: 'API Integrations', val: 'Active' }],
    items: [
      { name: 'Auto-generate Meet Links', status: 'Enabled', type: 'Session Preference' },
      { name: 'Push notification on solution submissions', status: 'Enabled', type: 'Notification' }
    ]
  }
};

export const InstructorModulePlaceholder = ({ section }) => {
  const data = mockData[section] || {
    title: 'Instructor Module',
    desc: 'Coordinate syllabus content and track students performance metrics.',
    icon: Settings,
    stats: [],
    items: []
  };

  const Icon = data.icon;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-left text-slate-200">
      {/* Title block */}
      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 backdrop-blur-md flex justify-between items-center select-none">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icon className="text-blue-500" size={24} />
            {data.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{data.desc}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg transition-all duration-200">
          <Plus size={16} />
          Create / Update
        </button>
      </div>

      {/* Stats cards */}
      {data.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {data.stats.map((s, idx) => (
            <div key={idx} className="bg-[#151922] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
              <span className="text-2xl font-extrabold text-white mt-1">{s.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* List items */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">Active Database Records</span>
        {data.items.length === 0 ? (
          <div className="py-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl flex items-center justify-center">
            <p className="text-xs text-slate-500">No records found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {data.items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#151922] border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors flex justify-between items-center"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    {item.courses && <span>{item.courses}</span>}
                    {item.level && <span>• {item.level}</span>}
                    {item.deadline && <span>Deadline: {item.deadline}</span>}
                    {item.submissions && <span>• {item.submissions}</span>}
                    {item.type && <span>{item.type}</span>}
                    {item.duration && <span>• {item.duration}</span>}
                    {item.replies && <span>{item.replies}</span>}
                    {item.active && <span>• {item.active}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                    {item.downloads && <span>• {item.downloads}</span>}
                    {item.status && <span className="text-emerald-400">Status: {item.status}</span>}
                    {item.type && !item.duration && <span>• {item.type}</span>}
                  </div>
                </div>
                
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default InstructorModulePlaceholder;
