import React, { useEffect, useState } from 'react';
import { 
  HardDrive, MessageSquare, Video, Calendar, Code2, 
  Layers, Award, CreditCard, DollarSign, Plus, Settings, ShieldAlert, RefreshCw, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchContentResourcesAPI, 
  fetchContentCommunitiesAPI, 
  fetchContentEventsAPI, 
  fetchContentSandboxAPI, 
  fetchContentWorkspacesAPI, 
  fetchContentAssessmentsAPI, 
  fetchContentSessionsAPI 
} from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';

const mockDataDefaults = {
  'resources': {
    title: 'Platform Resources Management',
    desc: 'Review and approve/delete resources, ZIP files, and templates uploaded by instructors.',
    icon: HardDrive,
    apiCall: fetchContentResourcesAPI,
    defaultItems: [
      { name: 'JavaScript ES6+ Cheatsheet.pdf', owner: 'sarah@example.com', date: 'August 4, 2026', type: 'PDF Notes' },
      { name: 'React 19 Router Templates.zip', owner: 'sarah@example.com', date: 'August 3, 2026', type: 'Source Code' },
      { name: 'Big-O Complexity Cheatsheet.pdf', owner: 'james@example.com', date: 'August 2, 2026', type: 'Cheat Sheet' }
    ]
  },
  'communities': {
    title: 'Platform Communities Moderation',
    desc: 'Moderate user communities, suspend spam forums, and promote cohort moderators.',
    icon: MessageSquare,
    apiCall: fetchContentCommunitiesAPI,
    defaultItems: [
      { name: 'JavaScript Developers', owner: 'sarah@example.com', members: '142 members', category: 'Programming' },
      { name: 'Data Science & ML', owner: 'james@example.com', members: '98 members', category: 'AI & Data' },
      { name: 'CodeSphere General', owner: 'admin@codesphere.dev', members: '340 members', category: 'General' }
    ]
  },
  'sessions': {
    title: 'Live Lectures & Sessions Monitor',
    desc: 'View active lectures, monitor WebRTC usage, and cancel inappropriate sessions.',
    icon: Video,
    apiCall: fetchContentSessionsAPI,
    defaultItems: [
      { name: 'React Performance Workshop', host: 'sarah@example.com', active: '18 students connected', start: 'Today 14:00 UTC' },
      { name: 'Python Data Science Masterclass', host: 'james@example.com', active: '24 students connected', start: 'Tomorrow 10:00 UTC' }
    ]
  },
  'events': {
    title: 'Hackathons & Events Coordinator',
    desc: 'Review submissions, feature premium coding competitions, and edit workshop schedules.',
    icon: Calendar,
    apiCall: fetchContentEventsAPI,
    defaultItems: [
      { name: 'National CodeSphere Hackathon 2026', start: 'August 10, 2026', prize: '₹50,000 + AWS Credits', mode: 'Online' },
      { name: 'React Performance Workshop', start: 'August 6, 2026', prize: 'Verifiable Certificate', mode: 'Online' },
      { name: 'JavaScript Coding Contest — July Edition', start: 'August 17, 2026', prize: 'XP & Badges', mode: 'Online' }
    ]
  },
  'sandbox': {
    title: 'Compiler Sandbox Templates',
    desc: 'Manage dockerized sandbox runtime configurations, language templates, and step-by-step metadata.',
    icon: Code2,
    apiCall: fetchContentSandboxAPI,
    defaultItems: [
      { name: 'Build a REST API with Node.js & Express', template: 'npm init && npm start', difficulty: 'Intermediate', enrolled: '142 enrolled' },
      { name: 'React Dashboard with Charts', template: 'npx create-react-app', difficulty: 'Intermediate', enrolled: '98 enrolled' },
      { name: 'Python Data Pipeline with Pandas', template: 'python main.py', difficulty: 'Advanced', enrolled: '76 enrolled' }
    ]
  },
  'codex': {
    title: 'Multiplayer Codex Workspaces Audit',
    desc: 'Review collaborative active coding workspaces, check git integrations, and archive old rooms.',
    icon: Layers,
    apiCall: fetchContentWorkspacesAPI,
    defaultItems: [
      { name: 'E-commerce Platform', room: 'workspace_dev_01', active: '2 active members', tech: 'Node.js, React, MongoDB' },
      { name: 'ML Price Predictor', room: 'workspace_ml_02', active: '1 active member', tech: 'Python, scikit-learn' },
      { name: 'CodeSphere Open Source', room: 'workspace_oss_03', active: '4 active members', tech: 'React, Express' }
    ]
  },
  'tests': {
    title: 'Coding Assessments & Tests Manager',
    desc: 'Create, edit, and assign timed assessments and code challenges to student groups.',
    icon: Award,
    apiCall: fetchContentAssessmentsAPI,
    defaultItems: [
      { name: 'JavaScript Fundamentals Assessment', duration: '45 mins', difficulty: 'Intermediate', attempts: '68 attempts' },
      { name: 'Data Structures Coding Challenge', duration: '60 mins', difficulty: 'Advanced', attempts: '42 attempts' }
    ]
  },
  'subscriptions': {
    title: 'Subscriptions & Premium Plans',
    desc: 'Configure student pricing tiers, apply platform coupon codes, and issue discounts.',
    icon: CreditCard,
    defaultItems: [
      { name: 'Free Starter Plan', price: '$0.00/mo', billing: 'Monthly', status: 'Active' },
      { name: 'Standard Developer Pass', price: '$9.99/mo', billing: 'Monthly', status: 'Active' },
      { name: 'Pro Master All-Access', price: '$19.99/mo', billing: 'Monthly', status: 'Active' }
    ]
  },
  'payments': {
    title: 'Platform Payments & Financial Audit',
    desc: 'Audit transaction history, track gross platform revenues, and manage credit refunds.',
    icon: DollarSign,
    defaultItems: [
      { name: 'SaaS Subscription Payment - inv_101', amount: '$19.99', status: 'Completed', date: 'Today 08:30' },
      { name: 'Standard Developer Pass - inv_102', amount: '$9.99', status: 'Completed', date: 'Yesterday 14:20' }
    ]
  }
};

export const AdminModulePlaceholder = ({ section }) => {
  const meta = mockDataDefaults[section] || {
    title: 'Admin Module Operations',
    desc: 'Manage global platform components and verify system status logs.',
    icon: Settings,
    defaultItems: []
  };

  const [items, setItems] = useState(meta.defaultItems);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!meta.apiCall) return;
    setLoading(true);
    try {
      const data = await meta.apiCall();
      const list = Array.isArray(data) ? data : (data?.items || data?.records || []);
      if (list.length > 0) {
        const formatted = list.map(item => ({
          name: item.title || item.name || 'Platform Record',
          owner: item.uploadedBy?.fullName || item.organizer?.fullName || item.owner?.fullName || 'CodeSphere User',
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active',
          type: item.resourceType || item.category || 'Record',
          difficulty: item.difficulty || 'Standard'
        }));
        setItems(formatted);
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems(meta.defaultItems);
    loadData();
  }, [section]);

  const Icon = meta.icon;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#04AA6D]/10 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">{meta.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{meta.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {meta.apiCall && (
            <button
              onClick={loadData}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}

          <button 
            onClick={() => toast.success(`Initiated action for ${meta.title}`)}
            className="flex items-center gap-2 bg-[#04AA6D] hover:bg-emerald-600 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            Add Record
          </button>
        </div>
      </div>

      {/* List Items Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1 font-mono text-xs text-slate-400 font-bold uppercase">
          <span>Global Database Records ({items.length})</span>
          <span>Status: Verified</span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center text-xs text-slate-400 font-mono">
            No records found.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#04AA6D]/40 transition-colors flex justify-between items-center shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{item.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                    {item.owner && <span>Owner: {item.owner}</span>}
                    {item.date && <span>• Date: {item.date}</span>}
                    {item.members && <span>• {item.members}</span>}
                    {item.host && <span>Host: {item.host}</span>}
                    {item.active && <span>• {item.active}</span>}
                    {item.start && <span>Starts: {item.start}</span>}
                    {item.prize && <span>• Prize: {item.prize}</span>}
                    {item.template && <span>Template: `{item.template}`</span>}
                    {item.room && <span>Room: {item.room}</span>}
                    {item.duration && <span>Duration: {item.duration}</span>}
                    {item.difficulty && <span>• {item.difficulty}</span>}
                    {item.price && <span>Price: {item.price}</span>}
                    {item.billing && <span>• {item.billing}</span>}
                    {item.amount && <span className="text-[#04AA6D]">Amount: {item.amount}</span>}
                  </div>
                </div>
                
                <span className="text-[9px] font-black uppercase font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
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
