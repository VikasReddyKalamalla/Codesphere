import React from 'react';
import { 
  HardDrive, MessageSquare, Video, Calendar, Code2, 
  Layers, Award, CreditCard, DollarSign, Plus, Settings, ShieldAlert
} from 'lucide-react';

const mockData = {
  'resources': {
    title: 'Platform Resources Management',
    desc: 'Review and approve/delete resources, ZIP files, and templates uploaded by instructors.',
    icon: HardDrive,
    stats: [{ label: 'Pending Approval', val: '4' }, { label: 'Total Files', val: '280' }],
    items: [
      { name: 'Deploying Node.js to AWS.pdf', owner: 'instructor@gmail.com', date: 'July 2, 2026' },
      { name: 'React 19 Router Templates.zip', owner: 'john@example.com', date: 'July 1, 2026' }
    ]
  },
  'communities': {
    title: 'Platform Communities Moderation',
    desc: 'Moderate user communities, suspend spam forums, and promote cohort moderators.',
    icon: MessageSquare,
    stats: [{ label: 'Active Communities', val: '12' }, { label: 'Flagged Posts', val: '3' }],
    items: [
      { name: 'React Developers Group', owner: 'instructor@gmail.com', members: '142 members' },
      { name: 'CodeSphere Beta Testers', owner: 'vikasreddyk0@gmail.com', members: '84 members' }
    ]
  },
  'sessions': {
    title: 'Live Lectures & Sessions Monitor',
    desc: 'View active lectures, monitor WebRTC usage, and cancel inappropriate sessions.',
    icon: Video,
    stats: [{ label: 'Live Right Now', val: '1' }, { label: 'Completed Today', val: '8' }],
    items: [
      { name: 'Mongoose Pre-Save Schema Hooks Debugging', host: 'instructor@gmail.com', active: '18 students connected' }
    ]
  },
  'events': {
    title: 'Hackathons & Events Coordinator',
    desc: 'Review submissions, feature premium coding competitions, and edit workshop schedules.',
    icon: Calendar,
    stats: [{ label: 'Upcoming Hackathons', val: '2' }, { label: 'Registered Teams', val: '120' }],
    items: [
      { name: 'Codesphere 2.0 Launch Hackathon', start: 'July 12, 2026', prize: '$1,000 USD' },
      { name: 'Node.js Backend Scaling Workshop', start: 'July 18, 2026', prize: 'Verifiable Certificate' }
    ]
  },
  'sandbox': {
    title: 'Compiler Sandbox Templates',
    desc: 'Manage dockerized sandbox runtime configurations, language templates, and step-by-step metadata.',
    icon: Code2,
    stats: [{ label: 'Active Runtimes', val: '24' }, { label: 'Average Execution Speed', val: '38ms' }],
    items: [
      { name: 'Node.js 22 Playpen Env', template: 'npm init && npm start', status: 'Ready' },
      { name: 'Python 3.12 Compiler Sandbox', template: 'python main.py', status: 'Ready' }
    ]
  },
  'codex': {
    title: 'Multiplayer Codex Workspaces audit',
    desc: 'Review collaborative active coding workspaces, check git integrations, and archive old rooms.',
    icon: Layers,
    stats: [{ label: 'Active Rooms', val: '18' }, { label: 'WebSocket connections', val: '42' }],
    items: [
      { name: 'Quicksort Debugging Session', room: 'room_ws_68', active: '3 users editing' },
      { name: 'WebRTC Peer-to-Peer Test', room: 'room_webrtc_92', active: '2 users editing' }
    ]
  },
  'tests': {
    title: 'Coding Assessments & Tests Manager',
    desc: 'Create, edit, and assign timed assessments and code challenges to student groups.',
    icon: Award,
    stats: [{ label: 'System Tests', val: '8' }, { label: 'Auto-Graded Submissions', val: '430' }],
    items: [
      { name: 'Fullstack React/Express Assessment', duration: '90 mins', difficulty: 'Intermediate' },
      { name: 'Data Structures Coding Challenge', duration: '60 mins', difficulty: 'Advanced' }
    ]
  },
  'subscriptions': {
    title: 'Subscriptions & Premium Plans',
    desc: 'Configure student pricing tiers, apply platform coupon codes, and issue discounts.',
    icon: CreditCard,
    stats: [{ label: 'Active Subscribers', val: '48' }, { label: 'SaaS Monthly MRR', val: '$960.00' }],
    items: [
      { name: 'Pro Developer Plan', price: '$19.99/mo', billing: 'Monthly' },
      { name: 'Classroom Sandbox Bundle', price: '$49.99/mo', billing: 'Monthly' }
    ]
  },
  'payments': {
    title: 'Platform Payments Transactions',
    desc: 'Audit transaction history, track gross platform revenues, and manage credit refunds.',
    icon: DollarSign,
    stats: [{ label: 'Gross Revenue', val: '$2,840.00' }, { label: 'Refund Claims', val: '0' }],
    items: [
      { name: 'SaaS Subscription Payment - invoice_198', amount: '$19.99', status: 'Success' },
      { name: 'Classroom Sandbox Bundle - invoice_199', amount: '$49.99', status: 'Success' }
    ]
  }
};

export const AdminModulePlaceholder = ({ section }) => {
  const data = mockData[section] || {
    title: 'Admin Operations Module',
    desc: 'Manage global platform components and verify system status logs.',
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
          Modify Component
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
        <span className="text-[10px] font-bold text-slate-505 uppercase tracking-wider select-none">Global Database Records</span>
        {data.items.length === 0 ? (
          <div className="py-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl flex items-center justify-center">
            <p className="text-xs text-slate-505">No records found.</p>
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
                    {item.owner && <span>Owner: {item.owner}</span>}
                    {item.date && <span>• {item.date}</span>}
                    {item.members && <span>{item.members}</span>}
                    {item.host && <span>Host: {item.host}</span>}
                    {item.active && <span>• {item.active}</span>}
                    {item.start && <span>Starts: {item.start}</span>}
                    {item.prize && <span>• Prize: {item.prize}</span>}
                    {item.template && <span>Template: `{item.template}`</span>}
                    {item.status && <span className="text-emerald-400">Status: {item.status}</span>}
                    {item.room && <span>Room ID: {item.room}</span>}
                    {item.duration && <span>Duration: {item.duration}</span>}
                    {item.difficulty && <span>• Difficulty: {item.difficulty}</span>}
                    {item.price && <span>Price: {item.price}</span>}
                    {item.billing && <span>• Billing: {item.billing}</span>}
                    {item.amount && <span className="text-emerald-400">Amount: {item.amount}</span>}
                  </div>
                </div>
                
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Approved
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminModulePlaceholder;
