import React, { useEffect, useState } from 'react';
import apiClient from '@services/axios.js';
import toast from 'react-hot-toast';
import { BookOpen, Plus, Trash2, Video, Youtube, ExternalLink } from 'lucide-react';
import { BackButton } from '@components/common/BackButton.jsx';
import CreateResourceModal from '@features/resources/components/CreateResourceModal.jsx';

export const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await apiClient.get('/resources');
      const data = res.data?.data?.resources || res.data?.resources || res.data || [];
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateResource = async (payload) => {
    try {
      await apiClient.post('/resources', payload);
      toast.success('Resource added successfully!');
      fetchResources();
    } catch (err) {
      toast.error('Failed to create resource');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await apiClient.delete(`/resources/${id}`);
      toast.success('Resource deleted successfully');
      fetchResources();
    } catch (err) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl text-slate-800 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" />

      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            Resource & Mentor Video Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Publish recommended YouTube videos, mentor masterclasses, and curated learning notes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Recommended Video / Resource
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-6">No resources found.</p>
          ) : (
            resources.map((res) => (
              <div
                key={res._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      {res.category?.name || res.type || 'Video'}
                    </span>
                    <button
                      onClick={() => handleDeleteResource(res._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{res.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>
                </div>

                {res.url && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <Youtube className="w-4 h-4 text-rose-500" />
                    <span>Watch Resource Video</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateResourceModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateResource}
        />
      )}
    </div>
  );
};
export default AdminResources;
