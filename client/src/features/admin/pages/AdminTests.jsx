import React, { useEffect, useState } from 'react';
import apiClient from '@services/axios.js';
import toast from 'react-hot-toast';
import { Award, Plus, Trash2, CheckCircle2, Archive, Eye, Sparkles } from 'lucide-react';
import CreateTestModal from '@features/tests/components/CreateTestModal.jsx';

export const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTests = async () => {
    try {
      const res = await apiClient.get('/tests?all=true');
      const data = res.data?.data?.tests || res.data?.tests || res.data || [];
      setTests(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load assessment tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateTest = async (payload) => {
    try {
      await apiClient.post('/tests', payload);
      toast.success('Assessment test created successfully!');
      fetchTests();
    } catch (err) {
      toast.error('Failed to create assessment test');
    }
  };

  const handleTogglePublish = async (id, currentPublished) => {
    try {
      if (currentPublished) {
        await apiClient.patch(`/tests/${id}/archive`);
        toast.success('Test archived');
      } else {
        await apiClient.patch(`/tests/${id}/publish`);
        toast.success('Test published');
      }
      fetchTests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update test status');
    }
  };

  const handleDeleteTest = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await apiClient.delete(`/tests/${id}`);
      toast.success('Test deleted successfully');
      fetchTests();
    } catch (err) {
      toast.error('Failed to delete test');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl text-slate-800 dark:text-slate-100 font-sans">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-500" />
            Assessment & Test Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, manage, and publish coding assessments, MCQs, and proctored exams.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Assessment
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tests.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-6">No assessments created yet. Click "Create New Assessment" to add one.</p>
          ) : (
            tests.map((test) => (
              <div
                key={test._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      {test.category?.name || test.category || 'General'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">• {test.duration} mins</span>
                    <span className="text-xs text-slate-400 font-mono font-bold">• {test.totalQuestions || 0} Questions</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{test.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{test.description || 'Proctored Assessment Test'}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleTogglePublish(test._id, test.isPublished)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      test.isPublished
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {test.isPublished ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Archive className="w-3.5 h-3.5" />}
                    <span>{test.isPublished ? 'Published' : 'Draft / Archived'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTest(test._id)}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete Assessment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateTestModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTest}
        />
      )}
    </div>
  );
};
export default AdminTests;
