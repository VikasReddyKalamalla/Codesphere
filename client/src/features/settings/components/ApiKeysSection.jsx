import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react';
import { fetchApiKeysThunk, generateApiKeyThunk, revokeApiKeyThunk, selectApiKeysList } from '../redux';

export const ApiKeysSection = () => {
  const dispatch = useDispatch();
  const apiKeys = useSelector(selectApiKeysList);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedRawKey, setGeneratedRawKey] = useState('');

  useEffect(() => {
    dispatch(fetchApiKeysThunk());
  }, [dispatch]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!newKeyName) return;
    const res = await dispatch(generateApiKeyThunk({ keyName: newKeyName }));
    if (res?.rawKey) {
      setGeneratedRawKey(res.rawKey);
      setNewKeyName('');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Developer API Keys
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Generate personal access tokens for the CodeSphere REST API, CLI tool, and VS Code plugin</p>
      </div>

      {/* Generated Raw Key Alert */}
      {generatedRawKey && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2">
          <span className="text-xs font-bold text-[#04AA6D] dark:text-emerald-300">Copy Secret Key Now (Shown Only Once):</span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 font-mono text-xs text-emerald-400">
            <span>{generatedRawKey}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedRawKey);
                alert('Copied to clipboard!');
              }}
              className="p-1 text-slate-300 hover:text-white cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Key Form */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex gap-3">
        <input
          type="text"
          placeholder="Token Name (e.g. CI/CD Runner Key)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Generate API Key
        </button>
      </form>

      {/* Keys Table */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {apiKeys.map((k) => (
            <div key={k._id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{k.keyName}</div>
                <div className="text-[10px] font-mono text-slate-500">{k.keyPrefix} • Created {new Date(k.createdAt).toLocaleDateString()}</div>
              </div>
              <button
                onClick={() => dispatch(revokeApiKeyThunk(k._id))}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                title="Revoke Key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
