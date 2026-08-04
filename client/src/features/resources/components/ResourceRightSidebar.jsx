import React from 'react';
import { Sparkles, Trophy, Tag, Eye, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export const ResourceRightSidebar = ({ resources = [], history = [], onSelectResource }) => {
  // Compute top authors from MongoDB resources
  const authorMap = {};
  if (Array.isArray(resources)) {
    resources.forEach((r) => {
      const author = r.uploadedBy;
      if (author) {
        const name = typeof author === 'object' ? (author.fullName || author.email || 'Instructor') : 'Instructor';
        if (!authorMap[name]) {
          authorMap[name] = {
            name,
            role: (typeof author === 'object' && author.role) ? author.role.toUpperCase() : 'AUTHOR',
            uploads: 1,
            avatar: (typeof author === 'object' && author.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          };
        } else {
          authorMap[name].uploads += 1;
        }
      }
    });
  }
  const topContributors = Object.values(authorMap).sort((a, b) => b.uploads - a.uploads).slice(0, 5);

  // Compute tags from MongoDB resources
  const tagSet = new Set();
  if (Array.isArray(resources)) {
    resources.forEach((r) => {
      if (Array.isArray(r.tags)) {
        r.tags.forEach((t) => tagSet.add(t));
      }
    });
  }
  const popularTags = Array.from(tagSet);

  return (
    <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 font-sans">
      {/* AI Recommendations Banner */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#04AA6D] dark:text-emerald-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#04AA6D]" />
          AI Knowledge Agent
        </div>
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Smart Resource Curator</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
          AI recommends full-stack boilerplates, system design diagrams & verified interview sheets.
        </p>
      </div>

      {/* Top Contributors */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Top Authors</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {topContributors.length > 0 ? (
            topContributors.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-[#04AA6D]/40" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{c.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{c.role}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#04AA6D] dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {c.uploads} Uploads
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 font-mono text-center py-2">No authors yet.</p>
          )}
        </div>
      </div>

      {/* Trending Topics & Tags */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <Tag className="w-4 h-4 text-[#04AA6D]" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Popular Topics</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {popularTags.length > 0 ? (
            popularTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:text-[#04AA6D] cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-500 font-mono py-1">No topics yet.</p>
          )}
        </div>
      </div>

      {/* Recently Viewed History */}
      {history.length > 0 && (
        <div className="bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Recently Viewed</span>
          </div>

          <div className="flex flex-col gap-2">
            {history.slice(0, 4).map((h) => (
              <div
                key={h._id || h.id}
                onClick={() => onSelectResource && onSelectResource(h)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/40 text-xs flex flex-col gap-0.5 cursor-pointer transition-all"
              >
                <span className="font-bold text-slate-900 dark:text-slate-200 truncate">{h.title}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{h.resourceType} · {h.language || 'English'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ResourceRightSidebar;
