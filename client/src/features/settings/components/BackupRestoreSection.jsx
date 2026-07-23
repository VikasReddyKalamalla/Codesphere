import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History, Plus, Download } from 'lucide-react';
import { fetchBackupsThunk, triggerBackupThunk, selectBackupsList } from '../redux';

export const BackupRestoreSection = () => {
  const dispatch = useDispatch();
  const backups = useSelector(selectBackupsList);

  useEffect(() => {
    dispatch(fetchBackupsThunk());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Automated Cloud Backups
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Schedule automatic backups and restore your workspace configuration anytime</p>
        </div>

        <button
          onClick={() => dispatch(triggerBackupThunk())}
          className="px-4 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Trigger Immediate Backup
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {backups.map((b) => (
            <div key={b._id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{b.backupName}</div>
                <div className="text-[10px] text-slate-500">{b.sizeMB} MB • {new Date(b.createdAt).toLocaleDateString()}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[#04AA6D] text-[10px] font-bold uppercase">
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
