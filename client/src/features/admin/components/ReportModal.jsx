import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ReportModal = ({ isOpen, onClose, onSave, report = null, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    targetType: 'post',
    targetModel: 'Post',
    targetSummary: '',
    reason: 'spam',
    priority: 'medium',
    description: '',
    status: 'pending',
    actionTaken: 'none',
    adminNotes: '',
  });

  useEffect(() => {
    if (report) {
      setFormData({
        targetType: report.targetType || 'post',
        targetModel: report.targetModel || 'Post',
        targetSummary: report.targetSummary || '',
        reason: report.reason || 'spam',
        priority: report.priority || 'medium',
        description: report.description || '',
        status: report.status || 'pending',
        actionTaken: report.actionTaken || 'none',
        adminNotes: report.adminNotes || '',
      });
    } else {
      setFormData({
        targetType: 'post',
        targetModel: 'Post',
        targetSummary: '',
        reason: 'spam',
        priority: 'medium',
        description: '',
        status: 'pending',
        actionTaken: 'none',
        adminNotes: '',
      });
    }
  }, [report, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-6 flex flex-col gap-4 text-xs select-none"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              {mode === 'create' ? 'Create Platform Report' : mode === 'resolve' ? 'Resolve Report Action' : 'Report Details'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'create' ? (
            <>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Target Summary / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spam links in discussion thread #42"
                  value={formData.targetSummary}
                  onChange={(e) => setFormData({ ...formData, targetSummary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Target Type</label>
                  <select
                    value={formData.targetType}
                    onChange={(e) => {
                      const val = e.target.value;
                      const modelMap = { post: 'Post', comment: 'Comment', community: 'Community' };
                      setFormData({ ...formData, targetType: val, targetModel: modelMap[val] || 'Post' });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="post">Post</option>
                    <option value="comment">Comment</option>
                    <option value="community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Reason</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="spam">Spam</option>
                    <option value="abuse">Abuse</option>
                    <option value="harassment">Harassment</option>
                    <option value="fake_information">Fake Info</option>
                    <option value="inappropriate_content">Inappropriate</option>
                    <option value="copyright">Copyright</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Detailed Report Explanation</label>
                <textarea
                  rows={3}
                  placeholder="Provide context on why this content was flagged..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Report Summary Card */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-slate-800 text-xs">{report?.targetSummary || 'Report Item'}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8.5px] uppercase font-bold tracking-wider ${
                    report?.priority === 'critical' ? 'bg-rose-100 text-rose-700' :
                    report?.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {report?.priority || 'medium'} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{report?.description || 'No description provided.'}</p>
                <div className="flex items-center gap-3 text-[9.5px] text-slate-400 font-mono-origin mt-1 pt-2 border-t border-slate-200/60">
                  <span>Reported By: {report?.reportedBy?.fullName || 'Anonymous'}</span>
                  <span>• Target: {report?.targetType}</span>
                  <span>• Date: {report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {/* Status & Resolution Controls */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Action Taken</label>
                  <select
                    value={formData.actionTaken}
                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="content_removed">Content Removed</option>
                    <option value="user_warned">User Warned</option>
                    <option value="user_suspended">User Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Admin Rationale & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter administrator notes or resolution rationale..."
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#04AA6D] hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              {mode === 'create' ? 'Create Report' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
