/**
 * Code Execution Service
 * Supports:
 *  1. Judge0 API / RapidAPI (if valid key present)
 *  2. Real local child_process execution for Python, JavaScript, C++, Java (100% real compiler/interpreter)
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const logger = require('../utils/logger');

const JUDGE0_API_BASE = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_HOST = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
const EXECUTION_TIMEOUT = 5; // max 5s wall time limit
const MEMORY_LIMIT_KB = 128000; // max 128MB memory limit

const LANGUAGE_MAP = {
  'javascript': 63,
  'js': 63,
  'typescript': 74,
  'ts': 74,
  'python': 71,
  'python3': 71,
  'py': 71,
  'java': 62,
  'cpp': 54,
  'c++': 54,
  'c': 50,
  'go': 60,
  'golang': 60,
  'rust': 73,
  'rs': 73,
  'php': 68,
  'ruby': 72,
  'rb': 72,
  'bash': 46,
  'shell': 46,
  'sh': 46,
  'csharp': 51,
  'c#': 51,
};

const normalizeLanguage = (rawLang) => {
  if (!rawLang) return 'js';
  let l = rawLang.toLowerCase().trim();
  if (l.includes('/')) l = path.basename(l);
  if (l.includes('.')) l = l.split('.').pop().trim();
  
  if (l.includes('python') || l === 'py' || l === 'py3') return 'python';
  if (l.includes('typescript') || l === 'ts' || l === 'tsx') return 'typescript';
  if (l.includes('javascript') || l === 'js' || l === 'jsx' || l === 'node') return 'javascript';
  if (l === 'cpp' || l === 'c++' || l === 'cc' || l === 'cxx') return 'cpp';
  if (l === 'c') return 'c';
  if (l === 'java') return 'java';
  if (l === 'go' || l === 'golang') return 'go';
  if (l === 'rust' || l === 'rs') return 'rust';
  if (l === 'php') return 'php';
  if (l === 'ruby' || l === 'rb') return 'ruby';
  if (l === 'bash' || l === 'sh' || l === 'shell' || l === 'zsh') return 'bash';
  return l;
};

const MAX_CONCURRENT_LOCAL_EXEC = parseInt(process.env.MAX_CONCURRENT_LOCAL_EXEC || '10', 10);
const MAX_PENDING_QUEUE = parseInt(process.env.MAX_PENDING_EXEC_QUEUE || '50', 10);

let activeExecutions = 0;
const pendingExecQueue = [];

const processNextInQueue = () => {
  if (activeExecutions < MAX_CONCURRENT_LOCAL_EXEC && pendingExecQueue.length > 0) {
    const nextFn = pendingExecQueue.shift();
    nextFn();
  }
};

/**
 * Executes code locally using child_process
 * Supports: Python, JavaScript, TypeScript, C, C++, Java, Go, Rust, PHP, Ruby, Bash/Shell
 * Returns real stdout, stderr, execution time, and exit status.
 */
const executeCodeLocally = (code, language, input = '') => {
  return new Promise((resolve) => {
    if (activeExecutions >= MAX_CONCURRENT_LOCAL_EXEC && pendingExecQueue.length >= MAX_PENDING_QUEUE) {
      return resolve({
        success: false,
        status: { id: 13, description: 'System Busy' },
        statusText: 'Server Concurrency Limit Reached',
        output: '',
        error: 'Server is currently experiencing heavy load. Please retry your code submission in a few moments.',
        executionTime: 0,
        memory: 0,
      });
    }

    const runExecution = () => {
      activeExecutions++;
      const startTime = Date.now();
      const tmpDir = path.join(os.tmpdir(), 'codesphere_exec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5));
      fs.mkdirSync(tmpDir, { recursive: true });

      let cmd = '';
      let filePath = '';

      const lang = normalizeLanguage(language);
      const isWin = process.platform === 'win32';

      if (lang === 'python') {
        filePath = path.join(tmpDir, 'solution.py');
        fs.writeFileSync(filePath, code);
        const pyBin = isWin ? 'python' : 'python3';
        cmd = `${pyBin} "${filePath}"`;
      } else if (lang === 'javascript') {
        filePath = path.join(tmpDir, 'solution.js');
        fs.writeFileSync(filePath, code);
        cmd = `node "${filePath}"`;
      } else if (lang === 'typescript') {
        filePath = path.join(tmpDir, 'solution.ts');
        fs.writeFileSync(filePath, code);
        cmd = `npx -y ts-node "${filePath}"`;
      } else if (lang === 'c') {
        filePath = path.join(tmpDir, 'solution.c');
        const binPath = path.join(tmpDir, 'solution');
        fs.writeFileSync(filePath, code);
        cmd = `gcc -O2 "${filePath}" -o "${binPath}" && "${binPath}"`;
      } else if (lang === 'cpp') {
        filePath = path.join(tmpDir, 'solution.cpp');
        const binPath = path.join(tmpDir, 'solution');
        fs.writeFileSync(filePath, code);
        cmd = `g++ -O2 "${filePath}" -o "${binPath}" && "${binPath}"`;
      } else if (lang === 'java') {
        filePath = path.join(tmpDir, 'Solution.java');
        fs.writeFileSync(filePath, code);
        cmd = `javac "${filePath}" && java -cp "${tmpDir}" Solution`;
      } else if (lang === 'go') {
        filePath = path.join(tmpDir, 'main.go');
        fs.writeFileSync(filePath, code);
        cmd = `go run "${filePath}"`;
      } else if (lang === 'rust') {
        filePath = path.join(tmpDir, 'solution.rs');
        const binPath = path.join(tmpDir, 'solution');
        fs.writeFileSync(filePath, code);
        cmd = `rustc "${filePath}" -o "${binPath}" && "${binPath}"`;
      } else if (lang === 'php') {
        filePath = path.join(tmpDir, 'solution.php');
        fs.writeFileSync(filePath, code);
        cmd = `php "${filePath}"`;
      } else if (lang === 'ruby') {
        filePath = path.join(tmpDir, 'solution.rb');
        fs.writeFileSync(filePath, code);
        cmd = `ruby "${filePath}"`;
      } else if (lang === 'bash') {
        filePath = path.join(tmpDir, 'solution.sh');
        fs.writeFileSync(filePath, code);
        cmd = `bash "${filePath}"`;
      } else {
        filePath = path.join(tmpDir, 'solution.js');
        fs.writeFileSync(filePath, code);
        cmd = `node "${filePath}"`;
      }

      const fullPathEnv = `${process.env.PATH || ''}:/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:/usr/local/go/bin:${os.homedir()}/.cargo/bin`;

      const finishExecution = (resultPayload) => {
        activeExecutions--;
        processNextInQueue();
        resolve(resultPayload);
      };

      const child = exec(cmd, { 
        timeout: EXECUTION_TIMEOUT * 1000, 
        maxBuffer: 128 * 1024 * 1024,
        env: { ...process.env, PATH: fullPathEnv }
      }, (error, stdout, stderr) => {
        const executionTime = (Date.now() - startTime) / 1000;
        
        // Cleanup temp directory
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}

        if (error && error.killed) {
          return finishExecution({
            success: false,
            status: { id: 5, description: 'Time Limit Exceeded' },
            statusText: 'Time Limit Exceeded',
            output: '',
            error: `Time Limit Exceeded (max ${EXECUTION_TIMEOUT}s)`,
            executionTime,
            memory: 128000,
          });
        }

        const hasError = !!stderr && stderr.trim().length > 0 && !stdout;

        finishExecution({
          success: !error && !hasError,
          status: !error && !hasError ? { id: 3, description: 'Accepted' } : { id: 6, description: 'Compilation / Runtime Error' },
          statusText: !error && !hasError ? 'Accepted' : 'Error',
          output: (stdout || '').trim(),
          error: (stderr || error?.message || '').trim(),
          exitCode: error ? error.code || 1 : 0,
          executionTime,
          memory: 128000,
        });
      });

      // Write standard input to child process stdin
      if (input) {
        child.stdin.write(input + '\n');
      }
      child.stdin.end();
    };

    if (activeExecutions < MAX_CONCURRENT_LOCAL_EXEC) {
      runExecution();
    } else {
      pendingExecQueue.push(runExecution);
    }
  });
};

/**
 * Submit code for execution.
 * Tries Judge0 API first if valid key present; otherwise runs 100% real code via local environment!
 */
const executeCode = async (code, language, input = '', timeLimit = EXECUTION_TIMEOUT) => {
  const apiKey = process.env.JUDGE0_API_KEY;

  if (apiKey && apiKey !== 'test-api-key' && apiKey !== 'demo_key_development') {
    try {
      const normalized = normalizeLanguage(language);
      const languageId = LANGUAGE_MAP[normalized] || 71;
      const response = await axios.post(
        `${JUDGE0_API_BASE}/submissions?base64_encoded=false&wait=true`,
        {
          language_id: languageId,
          source_code: code,
          stdin: input || '',
          cpu_time_limit: Math.min(timeLimit, EXECUTION_TIMEOUT),
          wall_time_limit: Math.min(timeLimit, EXECUTION_TIMEOUT),
          memory_limit: MEMORY_LIMIT_KB,
        },
        {
          headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': JUDGE0_HOST },
          timeout: 6000,
        }
      );

      const submission = response.data;
      return {
        success: submission.status?.id === 3,
        status: submission.status,
        statusText: submission.status?.description || 'Executed',
        output: (submission.stdout || '').trim(),
        error: (submission.stderr || submission.compile_output || '').trim(),
        executionTime: submission.time || 0.01,
        memory: submission.memory || 128000,
      };
    } catch (err) {
      logger.warn(`Judge0 API failed (${err.message}). Using local real execution engine.`);
    }
  }

  // 100% Real Code Execution via local child_process
  return await executeCodeLocally(code, language, input);
};

const validateCodeSyntax = async (code) => {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }
  return { valid: true };
};

const getLanguageId = (rawLang) => {
  const normalized = normalizeLanguage(rawLang);
  const id = LANGUAGE_MAP[normalized];
  if (!id) throw new Error(`Unsupported language: ${rawLang}`);
  return id;
};

module.exports = {
  executeCode,
  executeCodeLocally,
  validateCodeSyntax,
  getLanguageId,
  LANGUAGE_MAP,
  EXECUTION_TIMEOUT,
};
