import React, { useState } from 'react';
import { SandboxSidebar } from '../components/SandboxSidebar.jsx';
import { CodeEditor } from '../components/CodeEditor.jsx';
import { Terminal } from '../components/Terminal.jsx';
import { PreviewPanel } from '../components/PreviewPanel.jsx';
import { Instructions } from '../components/Instructions.jsx';
import { HintBox } from '../components/HintBox.jsx';
import { Button } from '@components/common/Button.jsx';
import { Play } from 'lucide-react';
import toast from 'react-hot-toast';

export const SandboxEditor = () => {
  const [code, setCode] = useState('// JavaScript playpen context\nconsole.log("Compile successful!");');
  const [terminal, setTerminal] = useState([]);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setTerminal(['Connecting playpen websockets compiler...', 'Executing script...']);
    setTimeout(() => {
      setRunning(false);
      setTerminal(['Connecting playpen websockets compiler...', 'Executing script...', 'Compile successful!']);
      toast.success('Script executed successfully!');
    }, 1500);
  };

  return (
    <div className="flex border border-slate-205 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <SandboxSidebar />
      <div className="flex-1 p-6 h-[calc(100vh-64px)] overflow-y-auto flex flex-col gap-5">
        <div className="flex justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-3 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-indigo-505 uppercase">Sandbox playpen editor</span>
            <h4 className="text-xs font-semibold text-slate-800 dark:text-white mt-0.5">Connection setup test.js</h4>
          </div>
          <Button variant="success" size="sm" icon={Play} onClick={handleRun} isLoading={running}>Run Code</Button>
        </div>

        <Instructions />
        <CodeEditor code={code} onChange={setCode} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Terminal output={terminal} />
          <PreviewPanel />
        </div>
        <HintBox />
      </div>
    </div>
  );
};
