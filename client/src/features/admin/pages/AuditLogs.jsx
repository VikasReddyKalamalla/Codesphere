import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, RefreshCw, Search, Calendar, User, Clock,
  Filter, CheckCircle2, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAuditLogsAPI } from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogsAPI({ page, search: searchTerm });
      const list = Array.isArray(data) ? data : (data?.logs || data?.items || []);
      setLogs(list);
      if (data?.pagination?.totalPages) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load audit logs: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const filteredLogs = logs.filter(l => 
    (l.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.admin?.fullName || l.admin?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.module || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">System Audit & Security Logs</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive immutable ledger recording all administrative actions, database mutations, and security events.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs by action, admin email, or module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Total Entries: <span className="font-extrabold text-slate-900 dark:text-white">{filteredLogs.length}</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-xs text-slate-400 font-mono">Querying security audit logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">
            No audit log records match filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase font-mono text-slate-400">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Admin User</th>
                  <th className="py-4 px-6">Module</th>
                  <th className="py-4 px-6">Action Performed</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                {filteredLogs.map((log, idx) => (
                  <tr key={log._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-400">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : log.time || 'Recently'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {log.admin?.fullName || log.admin?.email || 'System Admin'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {log.module || 'System'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-3 px-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
