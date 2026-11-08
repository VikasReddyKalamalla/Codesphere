import React, { useState } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Clock,
  HardDrive,
  Code2,
  Globe,
  Settings2,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

interface ParamPair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  durationMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  data: any;
  error?: string;
}

export const ApiTesterPanel: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');

  const [params, setParams] = useState<ParamPair[]>([
    { id: '1', key: 'userId', value: '1', enabled: false },
  ]);
  const [headers, setHeaders] = useState<ParamPair[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
    { id: '2', key: 'Accept', value: 'application/json', enabled: true },
  ]);
  const [bodyContent, setBodyContent] = useState<string>(
    JSON.stringify({ title: 'New CodeSphere Module', body: 'Collaborative development test', userId: 1 }, null, 2)
  );
  const [authToken, setAuthToken] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [responseTab, setResponseTab] = useState<'body' | 'headers' | 'raw'>('body');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Preset sample requests
  const samplePresets = [
    { label: 'JSONPlaceholder Post', method: 'GET' as HttpMethod, url: 'https://jsonplaceholder.typicode.com/posts/1' },
    { label: 'GitHub User (octocat)', method: 'GET' as HttpMethod, url: 'https://api.github.com/users/octocat' },
    { label: 'Create Post (Mock)', method: 'POST' as HttpMethod, url: 'https://jsonplaceholder.typicode.com/posts' },
    { label: 'HTTPBin Headers', method: 'GET' as HttpMethod, url: 'https://httpbin.org/headers' },
  ];

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    const startTime = performance.now();

    try {
      // Build URL with enabled query params
      const parsedUrl = new URL(url);
      params.filter((p) => p.enabled && p.key.trim()).forEach((p) => {
        parsedUrl.searchParams.set(p.key.trim(), p.value.trim());
      });

      // Build Headers
      const reqHeaders: Record<string, string> = {};
      headers.filter((h) => h.enabled && h.key.trim()).forEach((h) => {
        reqHeaders[h.key.trim()] = h.value.trim();
      });
      if (authToken.trim()) {
        reqHeaders['Authorization'] = `Bearer ${authToken.trim()}`;
      }

      const reqInit: RequestInit = {
        method,
        headers: reqHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && bodyContent.trim()) {
        reqInit.body = bodyContent;
      }

      const res = await fetch(parsedUrl.toString(), reqInit);
      const durationMs = Math.round(performance.now() - startTime);

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      let rawDataText = await res.text();
      let parsedData: any = rawDataText;
      try {
        parsedData = JSON.parse(rawDataText);
      } catch {}

      setResponse({
        status: res.status,
        statusText: res.statusText || (res.status === 200 ? 'OK' : ''),
        durationMs,
        sizeBytes: new Blob([rawDataText]).size,
        headers: resHeaders,
        data: parsedData,
      });
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      setResponse({
        status: 0,
        statusText: 'Network / CORS Error',
        durationMs,
        sizeBytes: 0,
        headers: {},
        data: null,
        error: err.message || 'Request failed. The endpoint might have blocked CORS or is unreachable.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(type);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const generateCurl = () => {
    let curl = `curl -X ${method} "${url}"`;
    headers.filter((h) => h.enabled && h.key).forEach((h) => {
      curl += ` \\\n  -H "${h.key}: ${h.value}"`;
    });
    if (['POST', 'PUT', 'PATCH'].includes(method) && bodyContent) {
      curl += ` \\\n  -d '${bodyContent.replace(/'/g, "\\'")}'`;
    }
    return curl;
  };

  const methodColors: Record<HttpMethod, string> = {
    GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    POST: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    PUT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    DELETE: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    HEAD: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  };

  return (
    <div
      className={`h-full flex flex-col text-xs select-none overflow-hidden transition-colors ${
        isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'
      }`}
    >
      {/* Top Header */}
      <div className={`p-3 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 font-semibold">
          <Globe className="w-4 h-4 text-[#04AA6D]" />
          <span className={isDark ? 'text-white' : 'text-slate-900'}>API Tester & REST Client</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => copyToClipboard(generateCurl(), 'curl')}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition cursor-pointer ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
            title="Copy as cURL"
          >
            {copiedSnippet === 'curl' ? <Check className="w-3 h-3 text-[#04AA6D]" /> : <Code2 className="w-3 h-3" />}
            <span>cURL</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Select */}
      <div className={`px-3 py-1.5 border-b flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none ${
        isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'
      }`}>
        <span className={`text-[10px] uppercase font-mono tracking-wider shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Presets:</span>
        {samplePresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMethod(preset.method);
              setUrl(preset.url);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition shrink-0 cursor-pointer ${
              isDark
                ? 'border-slate-800 hover:border-[#04AA6D]/40 bg-slate-900 hover:bg-slate-850 text-slate-300'
                : 'border-slate-200 hover:border-[#04AA6D] bg-white hover:bg-slate-100 text-slate-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* URL & Method Input Bar */}
      <div className={`p-3 border-b flex items-center gap-2 shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className={`px-2.5 py-1.5 rounded font-mono font-bold border text-xs cursor-pointer focus:outline-none transition ${methodColors[method]}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
          <option value="HEAD">HEAD</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className={`flex-1 px-3 py-1.5 rounded-lg border focus:border-[#04AA6D] font-mono text-xs focus:outline-none transition ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
          }`}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !url.trim()}
          className="px-4 py-1.5 rounded-lg bg-[#04AA6D] hover:bg-[#03985e] disabled:opacity-50 text-white font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Send</span>
        </button>
      </div>

      {/* Request Config Tabs */}
      <div className={`flex border-b px-3 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
        {(['params', 'headers', 'body', 'auth'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 font-mono text-[11px] uppercase tracking-wide border-b-2 transition cursor-pointer ${
              activeTab === tab
                ? 'border-[#04AA6D] text-[#04AA6D] font-bold'
                : isDark
                ? 'border-transparent text-[#a1a1aa] hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
            {tab === 'params' && params.filter((p) => p.enabled).length > 0 && (
              <span className="ml-1.5 px-1 rounded-full bg-[#04AA6D]/20 text-[9px]">
                {params.filter((p) => p.enabled).length}
              </span>
            )}
            {tab === 'headers' && headers.filter((h) => h.enabled).length > 0 && (
              <span className="ml-1.5 px-1 rounded-full bg-[#04AA6D]/20 text-[9px]">
                {headers.filter((h) => h.enabled).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className={`h-44 border-b overflow-y-auto p-3 shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        {/* PARAMS */}
        {activeTab === 'params' && (
          <div className="space-y-1.5">
            {params.map((param, i) => (
              <div key={param.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={param.enabled}
                  onChange={(e) =>
                    setParams(params.map((p, idx) => (idx === i ? { ...p, enabled: e.target.checked } : p)))
                  }
                  className="rounded accent-[#04AA6D] cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) =>
                    setParams(params.map((p, idx) => (idx === i ? { ...p, key: e.target.value } : p)))
                  }
                  className={`flex-1 px-2 py-1 rounded font-mono text-[11px] focus:outline-none focus:border-[#04AA6D] border ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) =>
                    setParams(params.map((p, idx) => (idx === i ? { ...p, value: e.target.value } : p)))
                  }
                  className={`flex-1 px-2 py-1 rounded font-mono text-[11px] focus:outline-none focus:border-[#04AA6D] border ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  onClick={() => setParams(params.filter((_, idx) => idx !== i))}
                  className="p-1 hover:text-rose-500 text-slate-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setParams([...params, { id: Date.now().toString(), key: '', value: '', enabled: true }])
              }
              className={`mt-1 px-2.5 py-1 rounded border border-dashed flex items-center gap-1 transition text-[11px] cursor-pointer ${
                isDark ? 'border-slate-700 hover:border-[#04AA6D] text-slate-400 hover:text-[#04AA6D]' : 'border-slate-300 hover:border-[#04AA6D] text-slate-600 hover:text-[#04AA6D]'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>Add Query Parameter</span>
            </button>
          </div>
        )}

        {/* HEADERS */}
        {activeTab === 'headers' && (
          <div className="space-y-1.5">
            {headers.map((header, i) => (
              <div key={header.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) =>
                    setHeaders(headers.map((h, idx) => (idx === i ? { ...h, enabled: e.target.checked } : h)))
                  }
                  className="rounded accent-[#04AA6D] cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Header Name"
                  value={header.key}
                  onChange={(e) =>
                    setHeaders(headers.map((h, idx) => (idx === i ? { ...h, key: e.target.value } : h)))
                  }
                  className={`flex-1 px-2 py-1 rounded font-mono text-[11px] focus:outline-none focus:border-[#04AA6D] border ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) =>
                    setHeaders(headers.map((h, idx) => (idx === i ? { ...h, value: e.target.value } : h)))
                  }
                  className={`flex-1 px-2 py-1 rounded font-mono text-[11px] focus:outline-none focus:border-[#04AA6D] border ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                  className="p-1 hover:text-rose-500 text-slate-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setHeaders([...headers, { id: Date.now().toString(), key: '', value: '', enabled: true }])
              }
              className={`mt-1 px-2.5 py-1 rounded border border-dashed flex items-center gap-1 transition text-[11px] cursor-pointer ${
                isDark ? 'border-slate-700 hover:border-[#04AA6D] text-slate-400 hover:text-[#04AA6D]' : 'border-slate-300 hover:border-[#04AA6D] text-slate-600 hover:text-[#04AA6D]'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>Add Header</span>
            </button>
          </div>
        )}

        {/* BODY */}
        {activeTab === 'body' && (
          <div className="h-full flex flex-col">
            <div className={`flex items-center justify-between pb-1 text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              <span>JSON Payload</span>
              <button
                onClick={() => {
                  try {
                    setBodyContent(JSON.stringify(JSON.parse(bodyContent), null, 2));
                  } catch {}
                }}
                className="text-[#04AA6D] hover:underline cursor-pointer"
              >
                Beautify JSON
              </button>
            </div>
            <textarea
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className={`flex-1 w-full p-2 rounded font-mono text-xs focus:outline-none focus:border-[#04AA6D] resize-none border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              placeholder='{ "key": "value" }'
            />
          </div>
        )}

        {/* AUTH */}
        {activeTab === 'auth' && (
          <div className="space-y-3">
            <div>
              <label className={`block text-[11px] mb-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bearer Token</label>
              <input
                type="password"
                placeholder="eyJh..."
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded font-mono text-xs focus:outline-none focus:border-[#04AA6D] border ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Bearer token is automatically added to the Authorization request header.
            </p>
          </div>
        )}
      </div>

      {/* Response Area */}
      <div className={`flex-1 flex flex-col min-h-0 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {/* Response Metrics & Status Bar */}
        <div className={`p-2.5 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <span className={`font-semibold text-xs ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`}>Response:</span>
            {response && (
              <span
                className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                  response.status >= 200 && response.status < 300
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : response.status >= 400
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {response.status} {response.statusText}
              </span>
            )}
          </div>

          {response && (
            <div className={`flex items-center gap-3 text-[11px] font-mono ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`}>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#04AA6D]" />
                {response.durationMs} ms
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-[#04AA6D]" />
                {(response.sizeBytes / 1024).toFixed(2)} KB
              </span>
            </div>
          )}
        </div>

        {/* Response Sub-tabs */}
        {response && (
          <div className={`flex items-center justify-between border-b px-3 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-100'}`}>
            <div className="flex gap-2">
              {(['body', 'headers', 'raw'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setResponseTab(tab)}
                  className={`py-1.5 px-2 text-[11px] font-mono uppercase cursor-pointer border-b-2 transition ${
                    responseTab === tab
                      ? 'border-[#04AA6D] text-[#04AA6D] font-bold'
                      : isDark
                      ? 'border-transparent text-[#71717a] hover:text-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                copyToClipboard(
                  typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : String(response.data),
                  'response'
                )
              }
              className={`px-2 py-0.5 rounded flex items-center gap-1 text-[11px] transition cursor-pointer ${
                isDark ? 'hover:bg-white/5 text-[#a1a1aa] hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {copiedSnippet === 'response' ? (
                <Check className="w-3 h-3 text-[#04AA6D]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>Copy</span>
            </button>
          </div>
        )}

        {/* Response Content View */}
        <div className="flex-1 p-3 overflow-auto font-mono text-[11px]">
          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-[#71717a] space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#04AA6D]" />
              <span>Sending HTTP request...</span>
            </div>
          )}

          {!isLoading && !response && (
            <div className="h-full flex flex-col items-center justify-center text-[#71717a] space-y-2">
              <Globe className="w-8 h-8 stroke-[1.2] text-[#3f3f46]" />
              <p>Enter an endpoint URL and hit Send to test your API.</p>
            </div>
          )}

          {!isLoading && response && (
            <>
              {response.error && (
                <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  <div className="font-bold mb-1">Request Failed:</div>
                  <div>{response.error}</div>
                </div>
              )}

              {responseTab === 'body' && !response.error && (
                <pre className="text-[#a1a1aa] whitespace-pre-wrap leading-relaxed select-text">
                  {typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data}
                </pre>
              )}

              {responseTab === 'headers' && (
                <div className="space-y-1 select-text">
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-[#04AA6D]">{k}:</span>
                      <span className="text-[#d4d4d8]">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {responseTab === 'raw' && (
                <pre className="text-[#71717a] whitespace-pre-wrap select-text">
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
