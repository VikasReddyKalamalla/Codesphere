import React from 'react';
import { Globe } from 'lucide-react';

export const GeoLocationBreakdown = ({ geoData = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Global User Geographic Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Active platform traffic originating regions
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          {geoData.length} Regions
        </span>
      </div>

      {geoData.length > 0 ? (
        <div className="flex flex-col gap-3">
          {geoData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-4 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-mono flex items-center justify-center text-slate-700 dark:text-slate-300">
                    {item.code || 'US'}
                  </span>
                  <span>{item.country || 'Global'}</span>
                </div>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  {(item.users || 0).toLocaleString()} Users ({item.percentage || 0}%)
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500"
                  style={{ width: `${item.percentage || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-400 font-mono">
          No region data recorded in database yet.
        </div>
      )}
    </div>
  );
};
