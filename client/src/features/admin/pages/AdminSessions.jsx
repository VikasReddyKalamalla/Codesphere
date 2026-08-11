import React, { useEffect, useState } from 'react';
import apiClient from '@services/axios.js';
import toast from 'react-hot-toast';
import { Calendar, Video, CheckCircle2, XCircle } from 'lucide-react';

export const AdminSessions = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/sessions/requests');
      setRequests(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch session requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    if (status === 'approved' && !meetingLink) {
      return toast.error('Please enter a Google Meet link to approve');
    }
    try {
      await apiClient.put(`/sessions/requests/${id}`, { status, meetingLink });
      toast.success(`Session request ${status}`);
      setApprovingId(null);
      setMeetingLink('');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl text-slate-800 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-black mb-2">Session Requests</h1>
        <p className="text-sm text-slate-500">Approve user requests for hosting Google Meet sessions.</p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {requests.length === 0 ? (
          <p className="text-sm text-slate-500">No session requests found.</p>
        ) : (
          requests.map(req => (
            <div key={req._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{req.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">By {req.requestedBy?.fullName} (@{req.requestedBy?.username})</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  req.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                  req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {req.status}
                </span>
              </div>
              <p className="text-sm">{req.description}</p>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                <Calendar className="w-4 h-4" /> 
                Proposed Time: {new Date(req.proposedTime).toLocaleString()}
              </div>

              {req.status === 'pending' && (
                <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                  {approvingId === req._id ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold">Google Meet Link</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="https://meet.google.com/..." 
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <button 
                          onClick={() => handleUpdateStatus(req._id, 'approved')}
                          className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setApprovingId(null)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setApprovingId(req._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
