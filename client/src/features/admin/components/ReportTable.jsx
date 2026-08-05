import React, { useState, useEffect } from 'react';
import apiClient from '@services/axios.js';
import {
  ShieldAlert, Search, Filter, RefreshCw, CheckCircle, AlertTriangle,
  XCircle, Eye, Trash2, Plus, ArrowLeftRight, ChevronLeft, ChevronRight,
  MessageSquare, UserX, AlertCircle, FileText, Check, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { socket } from '../../../socket/socket.js';
import { ReportModal } from './ReportModal.jsx';

export const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, critical: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/reports', {
        params: {
          page,
          limit: 10,
          search,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          reason: reasonFilter || undefined,
          targetType: targetTypeFilter || undefined,
        },
      });

      const data = res.data.data;
      setReports(data.reports || []);
      setStats(data.stats || { total: 0, pending: 0, critical: 0, resolved: 0 });
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch platform reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Listen for real-time WebSocket events from backend
    const handleReportSocket = (event) => {
      fetchReports();
      if (event.action === 'created') {
        toast('New report submitted live!', { icon: '🔔' });
      }
    };

    socket.on('report_changed', handleReportSocket);
    return () => {
      socket.off('report_changed', handleReportSocket);
    };
  }, [page, statusFilter, priorityFilter, reasonFilter, targetTypeFilter]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchReports();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Quick Action Handler (Resolve / Dismiss / Delete)
  const handleQuickAction = async (reportId, action) => {
    const loader = toast.loading(`Processing report ${action}...`);
    try {
      if (action === 'delete') {
        await apiClient.delete(`/admin/reports/${reportId}`);
        toast.success('Report log deleted', { id: loader });
      } else {
        await apiClient.put(`/admin/reports/${reportId}`, {
          status: action,
          actionTaken: action === 'resolved' ? 'content_removed' : 'none',
        });
        toast.success(`Report marked as ${action}`, { id: loader });
      }
      fetchReports();
    } catch (err) {
      toast.error(err.message || 'Operation failed', { id: loader });
    }
  };

  // Handle Save from Modal
  const handleSaveModal = async (formData) => {
    const loader = toast.loading('Saving report changes...');
    try {
      if (modalMode === 'create') {
        await apiClient.post('/admin/reports', formData);
        toast.success('Report submitted successfully', { id: loader });
      } else {
        await apiClient.put(`/admin/reports/${selectedReport._id}`, formData);
        toast.success('Report resolved and updated', { id: loader });
      }
      setModalOpen(false);
      fetchReports();
    } catch (err) {
      toast.error(err.message || 'Action failed', { id: loader });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-slate-800">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-emerald-600" size={22} />
            Platform Reports & Moderation Audit
          </h1>
          <p className="text-[11px] text-slate-500 mt-1">
            Review user flags, policy violations, spam reports, and resolve safety incidents in real-time.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedReport(null);
            setModalMode('create');
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#04AA6D] text-white rounded-xl hover:bg-emerald-700 font-bold transition-all text-xs flex items-center gap-1.5 shadow-sm select-none"
        >
          <Plus size={15} />
          <span>File Manual Report</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
        {[
          { label: 'Total Reports Logged', value: stats.total, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'Pending Review', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Critical / High Alerts', value: stats.critical, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
          { label: 'Resolved Case Rate', value: stats.resolved, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
        ].map((card, idx) => (
          <div key={idx} className={`p-4 border rounded-2xl flex flex-col justify-between shadow-[0_1px_2px_0_rgba(0,0,0,0.01)] ${card.bg}`}>
            <span className="text-[8.5px] uppercase tracking-wider font-extrabold text-slate-400 font-mono-origin">{card.label}</span>
            <span className={`text-xl font-black mt-1 font-mono-origin ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200/85 p-4 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search reports by headline, description, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono-origin"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 focus:bg-white focus:outline-none"
        >
          <option value="">All Reasons</option>
          <option value="spam">Spam</option>
          <option value="abuse">Abuse</option>
          <option value="harassment">Harassment</option>
          <option value="fake_information">Fake Info</option>
          <option value="inappropriate_content">Inappropriate</option>
          <option value="copyright">Copyright</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-emerald-600" size={32} />
            <span className="text-xs text-slate-400 font-semibold font-mono-origin">Querying report logs...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center select-none">
            <ShieldAlert size={40} className="text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No reports found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or keyword query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-mono-origin">
                  <th className="py-3 px-4">Headline & Reason</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reviewer & Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-semibold">
                {reports.map((r) => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700',
                    reviewed: 'bg-blue-100 text-blue-700',
                    resolved: 'bg-emerald-100 text-emerald-700',
                    dismissed: 'bg-slate-100 text-slate-500',
                  };

                  const priorityColors = {
                    critical: 'bg-rose-100 text-rose-700 border-rose-200',
                    high: 'bg-orange-100 text-orange-700 border-orange-200',
                    medium: 'bg-sky-100 text-sky-700 border-sky-200',
                    low: 'bg-slate-100 text-slate-600 border-slate-200',
                  };

                  return (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <p className="font-extrabold text-slate-800 text-xs line-clamp-1">
                          {r.targetSummary || 'Report Entry'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 capitalize font-mono-origin">
                          Reason: {r.reason?.replace('_', ' ')}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9.5px] uppercase font-bold text-slate-600">
                          {r.targetType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded border text-[8.5px] uppercase font-bold tracking-wider ${priorityColors[r.priority] || priorityColors.medium}`}>
                          {r.priority || 'medium'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700">{r.reportedBy?.fullName || 'Anonymous'}</span>
                          <span className="font-mono-origin text-[9px]">{r.reportedBy?.email || ''}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[8.5px] uppercase font-bold tracking-wider leading-none ${statusColors[r.status] || statusColors.pending}`}>
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[180px]">
                        {r.reviewedBy ? (
                          <div className="flex flex-col text-[10px]">
                            <span className="font-bold text-slate-700">{r.reviewedBy.fullName}</span>
                            <span className="text-[9px] text-slate-400 line-clamp-1">{r.adminNotes || 'No notes'}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unreviewed</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedReport(r);
                              setModalMode('resolve');
                              setModalOpen(true);
                            }}
                            className="p-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase transition-all"
                            title="Inspect & Resolve"
                          >
                            <Eye size={13} />
                          </button>

                          {r.status !== 'resolved' && (
                            <button
                              onClick={() => handleQuickAction(r._id, 'resolved')}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50"
                              title="Resolve"
                            >
                              <Check size={14} />
                            </button>
                          )}

                          {r.status !== 'dismissed' && (
                            <button
                              onClick={() => handleQuickAction(r._id, 'dismissed')}
                              className="p-1 text-slate-400 hover:text-amber-600 rounded hover:bg-amber-50"
                              title="Dismiss"
                            >
                              <XCircle size={14} />
                            </button>
                          )}

                          <button
                            onClick={() => handleQuickAction(r._id, 'delete')}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            title="Delete Log"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
        report={selectedReport}
        mode={modalMode}
      />
    </div>
  );
};
