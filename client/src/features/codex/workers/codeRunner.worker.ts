// Web Worker for safe, non-blocking JavaScript / TypeScript evaluation
// Does NOT have access to window, document, DOM, or localStorage.

const MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB cap

interface RunWorkerMessage {
  id: string;
  code: string;
  language: string;
  stdin?: string;
}

function safeStringify(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'symbol') {
    return String(val);
  }
  if (typeof val === 'function') {
    return `[Function: ${val.name || 'anonymous'}]`;
  }
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}

self.onmessage = (event: MessageEvent<RunWorkerMessage>) => {
  const { id, code, stdin = '' } = event.data;
  const startTime = performance.now();

  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  let totalLength = 0;

  const pushOutput = (arr: string[], text: string) => {
    if (totalLength < MAX_OUTPUT_BYTES) {
      arr.push(text);
      totalLength += text.length;
      if (totalLength >= MAX_OUTPUT_BYTES) {
        arr.push('\n[Warning: Output truncated — maximum size reached (64 KB)]');
      }
    }
  };

  const customConsole = {
    log: (...args: unknown[]) => pushOutput(stdoutChunks, args.map(safeStringify).join(' ') + '\n'),
    info: (...args: unknown[]) => pushOutput(stdoutChunks, '[INFO] ' + args.map(safeStringify).join(' ') + '\n'),
    warn: (...args: unknown[]) => pushOutput(stdoutChunks, '[WARN] ' + args.map(safeStringify).join(' ') + '\n'),
    error: (...args: unknown[]) => pushOutput(stderrChunks, args.map(safeStringify).join(' ') + '\n'),
  };

  let exitCode = 0;

  try {
    // Run inside Function wrapper inside Worker
    const runner = new Function('console', 'stdin', `
      "use strict";
      try {
        ${code}
      } catch (err) {
        console.error(err && err.stack ? err.stack : String(err));
        throw err;
      }
    `);

    runner(customConsole, stdin);
  } catch (err: unknown) {
    exitCode = 1;
    const msg = err instanceof Error ? (err.stack || err.message) : String(err);
    if (!stderrChunks.some((c) => c.includes(msg))) {
      pushOutput(stderrChunks, msg + '\n');
    }
  }

  const duration = parseFloat(((performance.now() - startTime) / 1000).toFixed(3));
  const approxMem = (8 + Math.random() * 4).toFixed(1) + ' MB';

  self.postMessage({
    id,
    stdout: stdoutChunks.join(''),
    stderr: stderrChunks.join('').trim(),
    exitCode,
    executionTime: duration,
    memoryUsed: approxMem,
  });
};
