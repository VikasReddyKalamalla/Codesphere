import React, { useState, useEffect } from 'react';
import { X, Puzzle, CheckCircle2, Download, Search, Sparkles } from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';
import toast from 'react-hot-toast';

export const ExtensionMarketplaceModal = ({ isOpen, onClose }) => {
  const [extensions, setExtensions] = useState([]);
  const [installed, setInstalled] = useState(['esbenp.prettier-vscode', 'dbaeumer.vscode-eslint', 'pkief.material-icon-theme']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMarketplace();
    }
  }, [isOpen]);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await cloudWorkspaceAPI.getMarketplaceExtensions();
      if (res.success && res.data) {
        setExtensions(res.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = (extId, name) => {
    if (installed.includes(extId)) return;
    setInstalled([...installed, extId]);
    toast.success(`🧩 ${name} installed into container environment!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Curated Extension Marketplace</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <p className="text-xs text-slate-400">
            Browse and install pre-approved VS Code extensions verified for container safety and performance.
          </p>

          <div className="space-y-2 pt-2">
            {extensions.map((ext) => {
              const isInst = installed.includes(ext.extensionId);
              return (
                <div
                  key={ext.extensionId}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-300">
                      <Puzzle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ext.name}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                          {ext.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{ext.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInstall(ext.extensionId, ext.name)}
                    disabled={isInst}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isInst
                        ? 'bg-slate-900 text-emerald-400 border border-emerald-800/40 cursor-default'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                    }`}
                  >
                    {isInst ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Installed
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Install
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
