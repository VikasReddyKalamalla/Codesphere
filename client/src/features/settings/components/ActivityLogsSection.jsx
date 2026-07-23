import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, ShieldCheck } from 'lucide-react';
import { fetchActivityLogsThunk, selectActivityLogsList } from '../redux';

export const ActivityLogsSection = () => {
  const dispatch = useDispatch();
  const logs = useSelector(selectActivityLogsList);

  useEffect(() => {
    dispatch(fetchActivityLogsThunk());
  }, [dispatch]);

  const sampleLogs = logs.length > 0 ? logs : [
    { _id: '1', action: 'UPDATED_ACCOUNT_SETTINGS', module: 'SETTINGS', details: 'Updated profile bio & location', createdAt: new Date().toISOString() },
    { _id: '2', action: 'SUBMITTED_QUIZ', module: 'TESTS', details: 'Passed React Advanced Assessment (94%)', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: '3', action: 'CREATED_SANDBOX', module: 'SANDBOX', details: 'Launched Node.js microservice environment', createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Platform Activity Logs
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Complete audit trail of user actions across CodeSphere</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-950/80 text-[#04AA6D] dark:text-emerald-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Module</th>
              <th className="p-4">Details</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {sampleLogs.map((l) => (
              <tr key={l._id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
                <td className="p-4 font-bold font-mono text-slate-900 dark:text-white">{l.action}</td>
                <td className="p-4 uppercase text-[10px] text-emerald-500 font-bold">{l.module}</td>
                <td className="p-4">{l.details}</td>
                <td className="p-4 text-slate-500 font-mono">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
