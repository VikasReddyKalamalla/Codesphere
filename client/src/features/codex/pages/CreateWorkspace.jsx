import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/common/Input.jsx';
import { Select } from '@components/common/Select.jsx';
import { Button } from '@components/common/Button.jsx';
import { createWorkspaceAPI } from '../services/codexAPI.js';
import { FolderPlus, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateWorkspace = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lang, setLang] = useState('JavaScript');
  const [framework, setFramework] = useState('React');
  const [database, setDatabase] = useState('MongoDB');
  const [deployment, setDeployment] = useState('Vercel');
  const [githubRepo, setGithubRepo] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Workspace name is required');
    }
    
    setLoading(true);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      technologyStack: [lang],
      framework: framework.trim(),
      database: database.trim(),
      deployment: deployment.trim(),
      githubRepo: githubRepo.trim(),
      liveUrl: liveUrl.trim(),
      visibility,
      status: 'active'
    };

    createWorkspaceAPI(payload)
      .then((res) => {
        if (res.success) {
          toast.success('Workspace created successfully!');
          navigate('/codex');
        } else {
          toast.error(res.message || 'Failed to create workspace');
        }
      })
      .catch((err) => {
        console.error('Create workspace error:', err);
        toast.error(err.response?.data?.message || 'Error creating workspace');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 text-left select-none bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl min-h-[calc(100vh-100px)]">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm dark:shadow-2xl flex flex-col gap-6 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button onClick={() => navigate('/codex')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white font-mono uppercase tracking-wider">Launch Collaborative Workspace</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">Initialize a Codex project sandbox environment for team coding.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Project Name" 
            placeholder="e.g. E-Commerce Cart Platform"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans focus:border-[#04AA6D]"
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider font-mono">Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain target objectives of this collaborative sandbox module..."
              rows={3}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs outline-none text-slate-900 dark:text-slate-200 focus:border-[#04AA6D] font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Primary Language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              options={[
                { label: 'JavaScript', value: 'JavaScript' },
                { label: 'Python (3.x)', value: 'Python' },
                { label: 'C++', value: 'C++' },
                { label: 'HTML/CSS', value: 'HTML/CSS' }
              ]}
              className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#04AA6D]"
            />
            
            <Select
              label="Workspace Visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              options={[
                { label: 'Public', value: 'public' },
                { label: 'Private (Members only)', value: 'private' },
                { label: 'Invite Only', value: 'invite_only' }
              ]}
              className="text-xs border-slate-200 dark:border-slate-800 focus:border-[#04AA6D]"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col gap-4">
            <span className="text-[10px] font-bold text-[#04AA6D] uppercase tracking-widest font-mono">Tech Stack & Environments (Optional)</span>
            
            <div className="grid grid-cols-3 gap-3">
              <Input label="Framework" placeholder="e.g. React" value={framework} onChange={(e) => setFramework(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#04AA6D]" />
              <Input label="Database" placeholder="e.g. MongoDB" value={database} onChange={(e) => setDatabase(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#04AA6D]" />
              <Input label="Deployment" placeholder="e.g. Vercel" value={deployment} onChange={(e) => setDeployment(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-[#04AA6D]" />
            </div>

            <Input label="GitHub Repository URL" placeholder="e.g. https://github.com/Codesphere/ecommerce-cart" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-[#04AA6D]" />
            <Input label="Live Demo URL" placeholder="e.g. https://ecommerce.codesphere.com" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="text-xs border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-[#04AA6D]" />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/codex')} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Cancel</Button>
            <Button type="submit" variant="primary" icon={FolderPlus} isLoading={loading} className="bg-[#04AA6D] hover:bg-[#4f46e5]">Launch Workspace</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspace;
