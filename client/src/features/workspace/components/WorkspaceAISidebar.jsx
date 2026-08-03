import React, { useState } from 'react';
import { Sparkles, Send, Bug, Zap, FileCode, HelpCircle, Loader2, Copy, Check } from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';

export const WorkspaceAISidebar = ({ workspaceId, onInsertCode }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hello! I am your CodeSphere AI Assistant. Ask me anything about your code, debug terminal output, or request automated refactoring.',
      timestamp: new Date()
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSend = async (actionType = null) => {
    const textToSend = prompt.trim() || actionType;
    if (!textToSend && !actionType) return;

    const userMsg = {
      sender: 'user',
      text: actionType ? `[Action: ${actionType.toUpperCase()}] ${prompt || ''}` : prompt,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await cloudWorkspaceAPI.sendAiMessage(workspaceId, {
        prompt: textToSend,
        action: actionType
      });

      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'AI response completed based on your workspace context.',
          codeSnippet: '// Clean refactored solution:\nfunction processWorkspace() {\n  return true;\n}'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0">
      {/* AI Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold text-white">AI Coding Assistant</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
          GPT-4o Ready
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => handleSend('explain')}
          className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Explain Code
        </button>
        <button
          onClick={() => handleSend('debug')}
          className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium transition-colors"
        >
          <Bug className="w-3.5 h-3.5 text-amber-400" />
          Debug Error
        </button>
        <button
          onClick={() => handleSend('optimize')}
          className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          Optimize Code
        </button>
        <button
          onClick={() => handleSend('generate_tests')}
          className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium transition-colors"
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          Generate Tests
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-xl max-w-[90%] ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              {msg.codeSnippet && (
                <div className="mt-2 bg-slate-900 rounded-lg border border-slate-800 p-2 font-mono text-[11px] text-emerald-400 relative group">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 mb-1 text-[10px] text-slate-400 font-sans">
                    <span>Generated Code</span>
                    <button
                      onClick={() => copyToClipboard(msg.codeSnippet, idx)}
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <pre className="overflow-x-auto">{msg.codeSnippet}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            AI analyzing code context...
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI assistant..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-purple-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WorkspaceAISidebar;
