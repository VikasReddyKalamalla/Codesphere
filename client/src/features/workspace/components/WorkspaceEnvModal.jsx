import React, { useState, useEffect } from 'react';
import { X, Plus, Key, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';
import toast from 'react-hot-toast';

export const WorkspaceEnvModal = ({ isOpen, onClose, workspaceId }) => {
  const [envVars, setEnvVars] = useState([{ key: 'PORT', value: '3000', isSecret: false }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState({});

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchEnvVars();
    }
  }, [isOpen, workspaceId]);

  const fetchEnvVars = async () => {
    setLoading(true);
    try {
      const res = await cloudWorkspaceAPI.getEnvVars(workspaceId);
      if (res.success && res.data?.length) {
        setEnvVars(res.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setEnvVars([...envVars, { key: '', value: '', isSecret: false }]);
  };

  const handleRemoveRow = (idx) => {
    setEnvVars(envVars.filter((_, i) => i !== idx));
  };

  const handleChange = (idx, field, val) => {
    const updated = [...envVars];
    updated[idx][field] = val;
    setEnvVars(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await cloudWorkspaceAPI.saveEnvVars(workspaceId, envVars.filter(e => e.key.trim()));
      toast.success('🔒 Environment variables synced to container .env!');
      onClose();
    } catch (err) {
      toast.error('Failed to save environment variables');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Environment Variables & Secrets</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 flex-1 max-h-[60vh] overflow-y-auto text-xs">
          <p className="text-slate-400 leading-relaxed">
            Configure key-value environment variables. Secrets are masked and automatically mounted into your workspace container's <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-400">.env</code> file.
          </p>

          {envVars.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="KEY (e.g. API_KEY)"
                value={item.key}
                onChange={(e) => handleChange(idx, 'key', e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg w-1/3 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
              />
              <div className="relative flex-1">
                <input
                  type={item.isSecret && !showSecrets[idx] ? 'password' : 'text'}
                  placeholder="VALUE"
                  value={item.value}
                  onChange={(e) => handleChange(idx, 'value', e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
                {item.isSecret && (
                  <button
                    type="button"
                    onClick={() => setShowSecrets({ ...showSecrets, [idx]: !showSecrets[idx] })}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    {showSecrets[idx] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleChange(idx, 'isSecret', !item.isSecret)}
                className={`p-1.5 rounded border text-[10px] ${
                  item.isSecret ? 'bg-cyan-950 border-cyan-700 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
                title="Toggle Secret Masking"
              >
                Secret
              </button>
              <button onClick={() => handleRemoveRow(idx)} className="p-1 text-slate-500 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1 text-cyan-400 hover:underline pt-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Variable
          </button>
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Syncing...' : 'Save & Sync .env'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceEnvModal;
