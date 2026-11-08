import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Code2,
  Check,
  Copy,
  Zap,
  ShieldCheck,
  TestTube,
  FileCode,
  RefreshCw,
  CornerDownLeft,
  Bot
} from 'lucide-react';
import { geminiService, AIMessage } from '../services/geminiService';
import { WorkspaceFile } from '../types/codex';

interface AICopilotPanelProps {
  isDark: boolean;
  activeFile?: WorkspaceFile;
  onInsertCode?: (code: string) => void;
}

export const AICopilotPanel: React.FC<AICopilotPanelProps> = ({
  isDark,
  activeFile,
  onInsertCode,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to **CodeSphere Codex AI Copilot** powered by Google Gemini! 🚀\n\nI can assist you with:\n- **Explaining** complex data structures & algorithms\n- **Refactoring** for performance and readability\n- **Generating** unit tests with full edge-case coverage\n- **Detecting** security vulnerabilities and syntax errors\n\nHow can I help you today?`,
      timestamp: 'Now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeFileContext, setIncludeFileContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (overridePrompt?: string) => {
    const promptToSend = (overridePrompt || inputPrompt).trim();
    if (!promptToSend || isLoading) return;

    const userMsg: AIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) setInputPrompt('');
    setIsLoading(true);

    try {
      const context =
        includeFileContext && activeFile
          ? {
              code: activeFile.content,
              language: activeFile.language,
              filePath: activeFile.path,
            }
          : undefined;

      const responseText = await geminiService.askAI(promptToSend, context);

      const aiMsg: AIMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error generating AI response: ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: 'explain' | 'optimize' | 'test' | 'fix') => {
    if (!activeFile) return;

    if (action === 'explain') {
      handleSend(`Explain this ${activeFile.language} file (${activeFile.name}) in detail with time/space complexity.`);
    } else if (action === 'optimize') {
      handleSend(`Optimize and refactor the code in ${activeFile.name} for maximum performance.`);
    } else if (action === 'test') {
      handleSend(`Generate comprehensive unit tests covering edge cases for ${activeFile.name}.`);
    } else if (action === 'fix') {
      handleSend(`Find potential bugs, edge-case failures, or security issues in ${activeFile.name} and provide fixes.`);
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  // Helper to extract code blocks from response
  const renderMessageContent = (msg: AIMessage) => {
    const parts = msg.content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim();
        const code = (lang ? lines.slice(1) : lines).join('\n');
        const blockId = `${msg.id}_${index}`;

        return (
          <div key={index} className="my-2 rounded-md overflow-hidden border border-[#2b2b36] bg-[#121216]">
            <div className="px-3 py-1.5 bg-[#18181f] border-b border-[#2b2b36] flex items-center justify-between text-[10px] font-mono text-[#a1a1aa]">
              <span>{lang || 'code'}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyCode(code, blockId)}
                  className="px-2 py-0.5 rounded hover:bg-white/10 flex items-center gap-1 text-[10px] transition cursor-pointer"
                >
                  {copiedId === blockId ? (
                    <Check className="w-3 h-3 text-[#04AA6D]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedId === blockId ? 'Copied' : 'Copy'}</span>
                </button>

                {onInsertCode && (
                  <button
                    onClick={() => onInsertCode(code)}
                    className="px-2 py-0.5 rounded bg-[#04AA6D]/20 hover:bg-[#04AA6D]/30 text-[#04AA6D] flex items-center gap-1 text-[10px] transition cursor-pointer font-medium"
                    title="Insert code into active editor"
                  >
                    <CornerDownLeft className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                )}
              </div>
            </div>
            <pre className="p-3 text-[11px] font-mono text-[#e4e4e7] overflow-x-auto select-text leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }

      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed select-text text-[11px]">
          {part}
        </div>
      );
    });
  };

  return (
    <div
      className={`h-full flex flex-col text-xs select-none overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'
      }`}
    >
      {/* Top Header */}
      <div className={`p-3 border-b flex items-center justify-between shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#04AA6D] animate-pulse" />
          <span className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Codex AI Copilot</span>
          <span className="px-1.5 py-0.5 rounded bg-[#04AA6D]/20 border border-[#04AA6D]/30 text-[#04AA6D] font-mono text-[9px]">
            Gemini 2.5
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className={`p-1 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            } hover:text-rose-500`}
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Context Banner */}
      <div className={`px-3 py-1.5 border-b flex items-center justify-between shrink-0 text-[10px] font-mono ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100/60 border-slate-200'
      }`}>
        <div className={`flex items-center gap-1.5 truncate max-w-[200px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <FileCode className="w-3 h-3 text-[#04AA6D]" />
          <span className={`truncate font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {activeFile ? activeFile.name : 'No active file'}
          </span>
        </div>
        <label className={`flex items-center gap-1 cursor-pointer ${isDark ? 'text-[#71717a] hover:text-[#a1a1aa]' : 'text-slate-500 hover:text-slate-700'}`}>
          <input
            type="checkbox"
            checked={includeFileContext}
            onChange={(e) => setIncludeFileContext(e.target.checked)}
            className="rounded accent-[#04AA6D] cursor-pointer"
          />
          <span>Include context</span>
        </label>
      </div>

      {/* Quick Action Pills */}
      {activeFile && (
        <div className={`px-3 py-2 border-b grid grid-cols-2 gap-1.5 shrink-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => handleQuickAction('explain')}
            disabled={isLoading}
            className={`px-2 py-1 rounded border text-[10px] flex items-center gap-1 transition cursor-pointer active:scale-98 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Explain Code</span>
          </button>
          <button
            onClick={() => handleQuickAction('optimize')}
            disabled={isLoading}
            className={`px-2 py-1 rounded border text-[10px] flex items-center gap-1 transition cursor-pointer active:scale-98 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#04AA6D]" />
            <span>Optimize</span>
          </button>
          <button
            onClick={() => handleQuickAction('test')}
            disabled={isLoading}
            className={`px-2 py-1 rounded border text-[10px] flex items-center gap-1 transition cursor-pointer active:scale-98 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <TestTube className="w-3 h-3 text-cyan-400" />
            <span>Unit Tests</span>
          </button>
          <button
            onClick={() => handleQuickAction('fix')}
            disabled={isLoading}
            className={`px-2 py-1 rounded border text-[10px] flex items-center gap-1 transition cursor-pointer active:scale-98 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-rose-400" />
            <span>Fix & Harden</span>
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] rounded-lg p-2.5 shadow-xs ${
                  isUser
                    ? 'bg-[#04AA6D] text-white rounded-br-none'
                    : isDark
                    ? 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none'
                    : 'bg-slate-100 text-slate-900 border border-slate-300 rounded-bl-none'
                }`}
              >
                {!isUser && (
                  <div className={`flex items-center gap-1.5 mb-1.5 pb-1 border-b text-[10px] font-mono text-[#04AA6D] ${
                    isDark ? 'border-slate-800' : 'border-slate-300'
                  }`}>
                    <Bot className="w-3 h-3" />
                    <span className="font-semibold">Gemini AI Copilot</span>
                    <span className={`ml-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{msg.timestamp}</span>
                  </div>
                )}
                <div className="text-xs">{renderMessageContent(msg)}</div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className={`flex items-center gap-2 p-3 rounded-lg border text-xs ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}>
            <RefreshCw className="w-4 h-4 animate-spin text-[#04AA6D]" />
            <span>Codex AI is analyzing and generating code...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className={`p-3 border-t shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Codex Copilot anything... (Enter to send, Shift+Enter for newline)"
            className={`w-full p-2.5 pr-10 rounded-xl border text-xs resize-none h-20 outline-none transition focus:border-[#04AA6D] ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] disabled:opacity-40 text-white transition cursor-pointer shadow-xs"
            title="Send prompt"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
