import React, { useState, useEffect } from 'react';
import { Settings, ShieldAlert, Archive, Trash2, LogOut, Save } from 'lucide-react';
import { Input } from '@components/common/Input.jsx';
import { Select } from '@components/common/Select.jsx';
import { Button } from '@components/common/Button.jsx';

export const WorkspaceSettings = ({ 
  workspace = {}, 
  currentUser = null, 
  onUpdateSettings, 
  onArchive, 
  onRestore,
  onDelete, 
  onLeave 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [status, setStatus] = useState('active');
  const [framework, setFramework] = useState('');
  const [database, setDatabase] = useState('');
  const [deployment, setDeployment] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name || '');
      setDescription(workspace.description || '');
      setVisibility(workspace.visibility || 'private');
      setStatus(workspace.status || 'active');
      setFramework(workspace.framework || '');
      setDatabase(workspace.database || '');
      setDeployment(workspace.deployment || '');
      setGithubRepo(workspace.githubRepo || '');
      setLiveUrl(workspace.liveUrl || '');
    }
  }, [workspace]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onUpdateSettings({
      name,
      description,
      visibility,
      status,
      framework,
      database,
      deployment,
      githubRepo,
      liveUrl
    });
    setSaving(false);
  };

  const isOwner = workspace.owner?._id === currentUser?._id || workspace.owner === currentUser?._id;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left select-none">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Settings className="w-4 h-4 text-[#6366f1]" />
        <span className="text-xs font-bold text-slate-855 dark:text-white tracking-wide uppercase font-mono">Workspace Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Workspace Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="text-xs font-sans text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-[#6366f1]"
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Workspace purpose..."
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs outline-none text-slate-900 dark:text-slate-200 focus:border-[#6366f1] font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              options={[
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
                { label: 'Invite Only', value: 'invite_only' }
              ]}
              className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]"
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Planning', value: 'planning' },
                { label: 'Active', value: 'active' },
                { label: 'On Hold', value: 'on_hold' },
                { label: 'Completed', value: 'completed' },
                { label: 'Archived', value: 'archived' }
              ]}
              className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]"
            />
          </div>

          <div className="border-t border-slate-150 dark:border-slate-800/60 pt-4 space-y-4">
            <span className="text-[10px] font-bold text-[#6366f1] uppercase tracking-widest font-mono">Tech Stack & Integrations</span>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Framework" value={framework} onChange={(e) => setFramework(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]" />
              <Input label="Database" value={database} onChange={(e) => setDatabase(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]" />
              <Input label="Deployment" value={deployment} onChange={(e) => setDeployment(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1]" />
            </div>
            <Input label="GitHub Repository URL" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="https://github.com/org/repo" className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1] font-mono" />
            <Input label="Live Demo URL" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://app.codesphere.com" className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#6366f1] font-mono" />
          </div>

          <Button type="submit" variant="primary" size="sm" icon={Save} isLoading={saving} className="w-full justify-center bg-[#6366f1] hover:bg-[#4f46e5]">
            Save Changes
          </Button>
        </form>

        {/* Danger Zone */}
        <div className="border-t border-red-500/10 pt-4 space-y-3.5">
          <span className="text-[10px] font-bold text-red-400 dark:text-red-550 uppercase tracking-widest font-mono flex items-center gap-1">
            <ShieldAlert size={12} /> Danger Zone
          </span>
          
          <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-500/10 rounded-2xl p-4 flex flex-col gap-3">
            {!isOwner ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Leave Workspace</span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500">You will lose access to code, chat, and task dashboards.</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="xs" 
                  icon={LogOut} 
                  onClick={() => { if (confirm('Leave this workspace?')) onLeave(); }}
                  className="text-red-600 dark:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Leave
                </Button>
              </div>
            ) : (
              <>
                {status === 'archived' ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Restore Workspace</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500">Unfreeze workspace states and allow member edits.</span>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="xs" 
                      icon={Archive} 
                      onClick={() => { if (confirm('Restore this workspace?')) onRestore(); }}
                      className="text-indigo-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                    >
                      Restore
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Archive Workspace</span>
                      <span className="text-[10px] text-slate-455 dark:text-slate-500">Freeze workspace states as read-only. Members cannot edit.</span>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="xs" 
                      icon={Archive} 
                      onClick={() => { if (confirm('Archive this workspace?')) onArchive(); }}
                      className="text-amber-600 dark:text-amber-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    >
                      Archive
                    </Button>
                  </div>
                )}
                
                <div className="border-t border-red-200/50 dark:border-red-500/5 pt-3 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Delete Workspace</span>
                    <span className="text-[10px] text-slate-455 dark:text-slate-500">Permanently delete files, logs, and database records.</span>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="xs" 
                    icon={Trash2} 
                    onClick={() => { if (confirm('DESTRUCTIVE ACTION: Permanently delete this workspace? This cannot be undone.')) onDelete(); }}
                    className="text-red-600 dark:text-red-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
