import React, { useState } from 'react';
import { Send, Plus, Trash2, Code2, Clock, CheckCircle, AlertCircle, Copy, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export const APITester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('http://127.0.0.1:5000/api/health');
  const [activeTab, setActiveTab] = useState('headers'); // 'headers' | 'params' | 'body' | 'auth'
  
  // Headers state
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'Authorization', value: `Bearer ${localStorage.getItem('codesphere_token') || ''}`, enabled: true }
  ]);

  // Params state
  const [queryParams, setQueryParams] = useState([
    { key: 'format', value: 'json', enabled: true }
  ]);

  // Body state
  const [requestBody, setRequestBody] = useState('{\n  "name": "CodeSphere Tester",\n  "status": "active"\n}');

  // Auth state
  const [authType, setAuthType] = useState('bearer'); // 'none' | 'bearer' | 'apikey'
  const [bearerToken, setBearerToken] = useState(localStorage.getItem('codesphere_token') || '');
  const [apiKeyHeader, setApiKeyHeader] = useState('x-api-key');
  const [apiKeyValue, setApiKeyValue] = useState('');

  // Response state
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState({});

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleAddParam = () => {
    setQueryParams([...queryParams, { key: '', value: '', enabled: true }]);
  };

  const handleRemoveParam = (index) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const handleSendRequest = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid request URL');
      return;
    }

    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    const startTime = performance.now();

    try {
      // Build query params string
      const activeParams = queryParams.filter(p => p.enabled && p.key.trim());
      let finalUrl = url.trim();
      if (activeParams.length > 0) {
        const searchParams = new URLSearchParams();
        activeParams.forEach(p => searchParams.append(p.key.trim(), p.value.trim()));
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + searchParams.toString();
      }

      // Build Headers object
      const reqHeaders = {};
      headers.forEach(h => {
        if (h.enabled && h.key.trim()) {
          reqHeaders[h.key.trim()] = h.value;
        }
      });

      if (authType === 'bearer' && bearerToken) {
        reqHeaders['Authorization'] = `Bearer ${bearerToken}`;
      } else if (authType === 'apikey' && apiKeyHeader && apiKeyValue) {
        reqHeaders[apiKeyHeader] = apiKeyValue;
      }

      const options = {
        method,
        headers: reqHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(finalUrl, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus({ code: res.status, text: res.statusText, ok: res.ok });

      // Extract response headers
      const resHdrs = {};
      res.headers.forEach((v, k) => { resHdrs[k] = v; });
      setResponseHeaders(resHdrs);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponse(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponse(text);
      }
      toast.success(`Response: ${res.status} ${res.statusText} (${Math.round(endTime - startTime)}ms)`);
    } catch (err) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus({ code: 0, text: 'Network Error', ok: false });
      setResponse(`Error: ${err.message}\nMake sure CORS is allowed or target server is running.`);
      toast.error(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      toast.success('Response copied to clipboard!');
    }
  };

  const methodColors = {
    GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    PATCH: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden font-sans select-none">
      
      {/* ── Top URL & Method Bar ── */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-black border uppercase tracking-wider outline-none cursor-pointer ${methodColors[method]}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter request URL (e.g. http://127.0.0.1:5000/api/health)..."
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-[#04AA6D]"
        />

        <button
          onClick={handleSendRequest}
          disabled={loading}
          className="px-4 py-1.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send size={13} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      {/* ── Request Configuration Tabs ── */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
        {[
          { id: 'headers', label: `Headers (${headers.length})` },
          { id: 'params', label: `Params (${queryParams.length})` },
          { id: 'body', label: 'Body (JSON)' },
          { id: 'auth', label: 'Auth & API Key' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-[#04AA6D] shadow-xs border border-slate-200 dark:border-slate-700/50'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Request Config Tab Panels ── */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto text-xs">
        
        {/* Headers Tab */}
        {activeTab === 'headers' && (
          <div className="space-y-2">
            {headers.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={h.enabled}
                  onChange={(e) => {
                    const next = [...headers];
                    next[i].enabled = e.target.checked;
                    setHeaders(next);
                  }}
                  className="rounded border-slate-300 dark:border-slate-700 text-[#04AA6D]"
                />
                <input
                  type="text"
                  placeholder="Key (e.g. Authorization)"
                  value={h.key}
                  onChange={(e) => {
                    const next = [...headers];
                    next[i].key = e.target.value;
                    setHeaders(next);
                  }}
                  className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-mono text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={h.value}
                  onChange={(e) => {
                    const next = [...headers];
                    next[i].value = e.target.value;
                    setHeaders(next);
                  }}
                  className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-mono text-[11px]"
                />
                <button onClick={() => handleRemoveHeader(i)} className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={handleAddHeader} className="flex items-center gap-1 text-[11px] font-bold text-[#04AA6D] hover:underline font-mono">
              <Plus size={12} /> Add Header
            </button>
          </div>
        )}

        {/* Params Tab */}
        {activeTab === 'params' && (
          <div className="space-y-2">
            {queryParams.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={(e) => {
                    const next = [...queryParams];
                    next[i].enabled = e.target.checked;
                    setQueryParams(next);
                  }}
                  className="rounded border-slate-300 dark:border-slate-700 text-[#04AA6D]"
                />
                <input
                  type="text"
                  placeholder="Param Key"
                  value={p.key}
                  onChange={(e) => {
                    const next = [...queryParams];
                    next[i].key = e.target.value;
                    setQueryParams(next);
                  }}
                  className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-mono text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={p.value}
                  onChange={(e) => {
                    const next = [...queryParams];
                    next[i].value = e.target.value;
                    setQueryParams(next);
                  }}
                  className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 font-mono text-[11px]"
                />
                <button onClick={() => handleRemoveParam(i)} className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={handleAddParam} className="flex items-center gap-1 text-[11px] font-bold text-[#04AA6D] hover:underline font-mono">
              <Plus size={12} /> Add Query Parameter
            </button>
          </div>
        )}

        {/* Body Tab */}
        {activeTab === 'body' && (
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            rows={5}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 font-mono text-[11px] outline-none text-slate-800 dark:text-slate-200 focus:border-[#04AA6D]"
            placeholder="JSON Request Payload..."
          />
        )}

        {/* Auth Tab */}
        {activeTab === 'auth' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="auth" checked={authType === 'bearer'} onChange={() => setAuthType('bearer')} />
                <span>Bearer Token</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="auth" checked={authType === 'apikey'} onChange={() => setAuthType('apikey')} />
                <span>API Key Header</span>
              </label>
            </div>

            {authType === 'bearer' && (
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold">Bearer Token</label>
                <input
                  type="text"
                  value={bearerToken}
                  onChange={(e) => setBearerToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1Ni..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 font-mono text-[11px]"
                />
              </div>
            )}

            {authType === 'apikey' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Header Name</label>
                  <input
                    type="text"
                    value={apiKeyHeader}
                    onChange={(e) => setApiKeyHeader(e.target.value)}
                    placeholder="x-api-key"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">API Key Value</label>
                  <input
                    type="text"
                    value={apiKeyValue}
                    onChange={(e) => setApiKeyValue(e.target.value)}
                    placeholder="sk_test_..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 font-mono text-[11px]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Response Output View ── */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950 p-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Response Body</span>
            {responseStatus && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                responseStatus.ok ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              }`}>
                {responseStatus.code} {responseStatus.text}
              </span>
            )}
            {responseTime && (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock size={11} /> {responseTime}ms
              </span>
            )}
          </div>

          {response && (
            <button onClick={copyResponse} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-mono">
              <Copy size={12} /> Copy
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mt-2 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {response ? (
            response
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2">
              <Code2 size={24} />
              <span className="text-[11px]">Enter a URL and click Send to test HTTP / REST APIs.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default APITester;
