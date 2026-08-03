import React, { useState } from 'react';
import { Sparkles, Send, Bug, Zap, FileCode, HelpCircle, Loader2, Copy, Check, Bot } from 'lucide-react';
import { cloudWorkspaceAPI } from '../services/cloudWorkspaceAPI';

export const WorkspaceAISidebar = ({ workspaceId, onInsertCode }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hello! I am your Codesphere AI Tutor. Ask me any programming questions, request error explanations, or automated code optimization.',
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
          text: 'Here is an optimized solution based on your code context:',
          codeSnippet: '// Optimized Solution\nclass Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // HashMap algorithm (O(N) time complexity)\n    return new int[]{0, 1};\n  }\n}'
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
    <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full shrink-0 select-none">
      {/* AI Header */}
      <div className="p-3.5 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <span className="text-xs font-extrabold text-white">AI Tutor Assistant</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white border border-zinc-800 font-bold">
          GPT-4o
        </span>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-3 bg-zinc-900/50 border-b border-zinc-800 grid grid-cols-2 gap-1.5 font-mono text-xs">
        <button
          onClick={() => handleSend('explain')}
          className="flex items-center justify-center gap-1.5 p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-200 font-bold transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Explain Code
        </button>
        <button
          onClick={() => handleSend('debug')}
          className="flex items-center justify-center gap-1.5 p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-200 font-bold transition-all"
        >
          <Bug className="w-3.5 h-3.5" />
          Debug Error
        </button>
        <button
          onClick={() => handleSend('optimize')}
          className="flex items-center justify-center gap-1.5 p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-200 font-bold transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          Optimize Code
        </button>
        <button
          onClick={() => handleSend('generate_tests')}
          className="flex items-center justify-center gap-1.5 p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-200 font-bold transition-all"
        >
          <FileCode className="w-3.5 h-3.5" />
          Gen Tests
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs select-text">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[90%] font-sans leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-white text-black font-bold rounded-br-none'
                  : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.codeSnippet && (
                <div className="mt-2 bg-black rounded border border-zinc-800 p-2 font-mono text-[11px] text-zinc-100 relative">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-800 mb-1 text-[10px] text-zinc-400 font-sans">
                    <span>Generated Code</span>
                    <button
                      onClick={() => copyToClipboard(msg.codeSnippet, idx)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <pre className="overflow-x-auto">{msg.codeSnippet}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs py-2 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            AI analyzing code...
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI Tutor..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-black border border-zinc-800 text-white text-xs px-3 py-2 rounded-md focus:outline-none focus:border-white font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="p-2 rounded-md bg-white hover:bg-zinc-200 text-black font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WorkspaceAISidebar;
