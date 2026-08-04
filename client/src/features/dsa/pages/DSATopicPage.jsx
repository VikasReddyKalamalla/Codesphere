import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, Clock, Building2,
  AlertTriangle, CheckCircle2, Circle, RotateCw, Bookmark, Star, Zap
} from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const DiffBadge = ({ d }) => {
  const c = { easy:'text-emerald-400 bg-emerald-500/15', medium:'text-amber-400 bg-amber-500/15', hard:'text-red-400 bg-red-500/15' };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c[d]||c.easy}`}>{d}</span>;
};

const StatusIcon = ({ status }) => {
  if (status === 'solved') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === 'in_progress') return <RotateCw className="w-4 h-4 text-amber-400" />;
  if (status === 'needs_revision') return <AlertTriangle className="w-4 h-4 text-orange-400" />;
  return <Circle className="w-4 h-4 text-zinc-600" />;
};

export default function DSATopicPage() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeTab, setActiveTab] = useState('problems');

  useEffect(() => { loadTopic(); }, [topicSlug]);

  const loadTopic = async () => {
    try {
      const res = await dsaAPI.getTopicBySlug(topicSlug);
      setData(res.data);
      // Expand all sections by default
      const expanded = {};
      (res.data?.sections || []).forEach(s => { expanded[s._id] = true; });
      setExpandedSections(expanded);
    } catch (err) {
      toast.error('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Zap className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Topic not found</div>;

  const { topic, sections, unsectionedProblems } = data;
  const allProblems = [...(unsectionedProblems || []), ...(sections || []).flatMap(s => s.problems || [])];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dsa')} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{topic.icon}</span>
              <h1 className="text-lg font-bold truncate">{topic.title}</h1>
              <DiffBadge d={topic.difficulty} />
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
              <span>{topic.userSolved || 0}/{topic.totalProblems} solved</span>
              <span>{topic.completionPercent || 0}% complete</span>
              {topic.estimatedHours > 0 && <span><Clock className="w-3 h-3 inline mr-0.5" />{topic.estimatedHours}h</span>}
            </div>
          </div>
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="w-32 h-2 rounded-full bg-zinc-800">
              <motion.div initial={{width:0}} animate={{width:`${topic.completionPercent||0}%`}} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" transition={{duration:0.8}} />
            </div>
            <span className="text-sm font-bold text-zinc-300">{topic.completionPercent || 0}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-6 w-fit">
          {['problems', 'overview', 'resources'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Problems Tab */}
        {activeTab === 'problems' && (
          <div className="space-y-4">
            {sections?.map((section, si) => (
              <motion.div key={section._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:si*0.05}} className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                <button onClick={() => toggleSection(section._id)} className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">{section.title}</h3>
                    <span className="text-xs text-zinc-500">{section.problems?.length || 0} problems</span>
                  </div>
                  {expandedSections[section._id] ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                </button>
                {expandedSections[section._id] && (
                  <div className="border-t border-zinc-800">
                    {(section.problems || []).map((problem, pi) => (
                      <motion.button key={problem._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:pi*0.03}}
                        onClick={() => navigate(`/dsa/problem/${problem.slug}`)}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-900/80 transition-colors border-b border-zinc-800/50 last:border-0 text-left group"
                      >
                        <StatusIcon status={problem.userStatus} />
                        <span className="flex-1 text-sm text-zinc-200 group-hover:text-white truncate font-medium">{problem.title}</span>
                        <DiffBadge d={problem.difficulty} />
                        {problem.estimatedTime > 0 && <span className="text-[11px] text-zinc-600">{problem.estimatedTime}m</span>}
                        {problem.bookmarkLabels?.length > 0 && <Bookmark className="w-3.5 h-3.5 text-amber-400" />}
                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                      </motion.button>
                    ))}
                    {(!section.problems || section.problems.length === 0) && (
                      <div className="px-5 py-6 text-center text-xs text-zinc-600">No problems in this section yet</div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            {/* Unsectioned problems */}
            {unsectionedProblems?.length > 0 && (
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-sm font-bold text-white">Other Problems</h3>
                </div>
                {unsectionedProblems.map((p, pi) => (
                  <button key={p._id} onClick={() => navigate(`/dsa/problem/${p.slug}`)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-900/80 transition-colors border-b border-zinc-800/50 last:border-0 text-left group">
                    <StatusIcon status={p.userStatus} />
                    <span className="flex-1 text-sm text-zinc-200 group-hover:text-white truncate font-medium">{p.title}</span>
                    <DiffBadge d={p.difficulty} />
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {topic.introduction && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{topic.introduction}</ReactMarkdown>
              </div>
            )}
            {topic.whyItMatters && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Why It Matters</h3>
                <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{topic.whyItMatters}</ReactMarkdown></div>
              </div>
            )}
            {topic.interviewCompanies?.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-400" /> Interview Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {topic.interviewCompanies.map(c => (
                    <span key={c} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {topic.cheatSheet && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3">📋 Cheat Sheet</h3>
                <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{topic.cheatSheet}</ReactMarkdown></div>
              </div>
            )}
            {topic.commonMistakes && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3">⚠️ Common Mistakes</h3>
                <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{topic.commonMistakes}</ReactMarkdown></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
