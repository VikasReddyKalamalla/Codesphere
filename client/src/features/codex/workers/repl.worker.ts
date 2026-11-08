// REPL Evaluation Worker for non-blocking Node.js shell evaluation
// Runs in isolated Web Worker context

interface ReplWorkerMessage {
  id: string;
  input: string;
}

function formatReplResult(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return `'${val}'`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (Array.isArray(val)) {
    try {
      return JSON.stringify(val);
    } catch {
      return `[Array(${val.length})]`;
    }
  }
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return '[Object]';
    }
  }
  return String(val);
}

self.onmessage = (event: MessageEvent<ReplWorkerMessage>) => {
  const { id, input } = event.data;

  try {
    // Try expression first
    const exprRunner = new Function(`return (${input})`);
    const result = exprRunner();
    self.postMessage({ id, output: formatReplResult(result) });
  } catch {
    try {
      // Fallback for statements like const a = 10;
      const stmtRunner = new Function(input);
      const res = stmtRunner();
      self.postMessage({ id, output: res !== undefined ? formatReplResult(res) : 'undefined' });
    } catch (err2: unknown) {
      const errMsg = err2 instanceof Error ? err2.message : String(err2);
      self.postMessage({ id, error: `Uncaught ${errMsg}` });
    }
  }
};
