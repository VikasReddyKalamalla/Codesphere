import { WorkspaceFile, TerminalEntry, ShellType } from '../types/codex';
import { executeCode } from './codeRunner';

export interface CommandContext {
  cwd: string;
  baseCwd: string;
  username: string;
  files: WorkspaceFile[];
  shell: ShellType;
  inNodeRepl: boolean;
  onFileCreate: (name: string, isFolder: boolean) => void;
  onFileDelete: (fileId: string) => void;
  onFileUpdate: (fileId: string, content: string) => void;
}

export interface CommandResponse {
  output?: string;
  error?: string;
  newCwd?: string;
  clear?: boolean;
  enterNodeRepl?: boolean;
  exitNodeRepl?: boolean;
}

export async function processTerminalCommand(
  rawInput: string,
  context: CommandContext
): Promise<CommandResponse> {
  const input = rawInput.trim();
  if (!input) return {};

  // Handle Node.js REPL mode
  if (context.inNodeRepl) {
    if (input === '.exit' || input === 'exit' || input === 'exit()') {
      return { output: 'Exiting Node.js REPL.', exitNodeRepl: true };
    }
    if (input === '.clear') {
      return { clear: true };
    }
    if (input === '.help') {
      return {
        output: `.break    Sometimes you get stuck, this gets you out\n.clear    Break, and also clear the local context\n.editor   Enter editor mode\n.exit     Exit the REPL\n.help     Print this list of special commands\n.load     Load JS from a file into the REPL session\n.save     Save all evaluated commands in this REPL session to a file`,
      };
    }

    // Evaluate JavaScript expression in isolated REPL worker with hard timeout
    return evaluateReplWorker(input);
  }

  // Shell command parsing
  const tokens = splitArguments(input);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  // Clear
  if (cmd === 'clear' || cmd === 'cls') {
    return { clear: true };
  }

  // Node REPL trigger
  if (cmd === 'node' && args.length === 0) {
    return {
      output: `Welcome to Node.js v20.18.0.\nType ".help" for more information.`,
      enterNodeRepl: true,
    };
  }

  // Help
  if (cmd === 'help') {
    return {
      output: `CodeSphere Codex Terminal commands:
  ls, dir, Get-ChildItem      List files and folders in directory
  cd <dir>                    Change current working directory
  pwd                         Print current directory path
  cat, type, Get-Content      Display file content
  touch <file>                Create an empty file
  mkdir <dir>                 Create a directory
  rm, del, Remove-Item        Delete a file
  echo <text> > <file>        Write text to file
  node <file>                 Run JavaScript file
  python <file>               Run Python script
  npm init / install / test   Manage npm packages
  git status / add / commit   Git version control operations
  whoami                      Display current user
  clear, cls                  Clear terminal buffer`,
    };
  }

  // PWD
  if (cmd === 'pwd') {
    return { output: context.cwd };
  }

  // CD
  if (cmd === 'cd') {
    if (!args[0] || args[0] === '~') {
      return { newCwd: context.baseCwd };
    }
    const target = args[0];
    if (target === '..') {
      const separator = context.cwd.includes('\\') ? '\\' : '/';
      const parts = context.cwd.split(separator);
      if (parts.length > 2) {
        parts.pop();
        return { newCwd: parts.join(separator) };
      }
      return { newCwd: context.baseCwd };
    }
    const targetFolder = context.files.find(
      (f) => (f.isFolder || f.type === 'folder') && f.name.toLowerCase() === target.toLowerCase()
    );
    if (targetFolder) {
      const separator = context.cwd.includes('\\') ? '\\' : '/';
      return { newCwd: `${context.cwd}${separator}${targetFolder.name}` };
    }
    return { error: `Set-Location : Cannot find path '${target}' because it does not exist.` };
  }

  // LS / DIR / Get-ChildItem
  if (cmd === 'ls' || cmd === 'dir' || cmd === 'get-childitem') {
    if (context.files.length === 0) {
      return { output: 'No files or folders in current directory.' };
    }

    const header = [
      `    Directory: ${context.cwd}`,
      '',
      'Mode                 LastWriteTime         Length Name',
      '----                 -------------         ------ ----',
    ];

    const lines = context.files.map((f) => {
      const isDir = Boolean(f.isFolder || f.type === 'folder');
      const mode = isDir ? 'd-----' : '-a----';
      const date = '10/20/2026   4:30 AM';
      const len = isDir ? '      ' : String(f.content.length).padStart(6, ' ');
      return `${mode}        ${date}         ${len} ${f.name}`;
    });

    return { output: [...header, ...lines].join('\n') };
  }

  // CAT / TYPE / Get-Content
  if (cmd === 'cat' || cmd === 'type' || cmd === 'get-content') {
    if (!args[0]) return { error: `${cmd}: Missing file path argument.` };
    const fileName = args[0];
    const file = context.files.find(
      (f) => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase()
    );
    if (file) {
      return { output: file.content || '(empty file)' };
    }
    return { error: `Get-Content : Cannot find path '${fileName}' because it does not exist.` };
  }

  // TOUCH / NEW-ITEM / NI
  if (cmd === 'touch' || cmd === 'new-item' || cmd === 'ni') {
    if (!args[0]) return { error: `${cmd}: Missing item name.` };
    const isDir = args.some(a => a.toLowerCase() === 'directory' || a.toLowerCase() === 'dir' || a.toLowerCase() === '-type');
    const pathArg = args.find(a => !a.startsWith('-') && a.toLowerCase() !== 'directory' && a.toLowerCase() !== 'file') || args[0];
    context.onFileCreate(pathArg, isDir);
    return { output: `Created ${isDir ? 'directory' : 'file'} '${pathArg}'` };
  }

  // MKDIR
  if (cmd === 'mkdir') {
    if (!args[0]) return { error: 'mkdir: Missing directory name.' };
    context.onFileCreate(args[0], true);
    return { output: `Created directory '${args[0]}'` };
  }

  // RM / DEL / Remove-Item
  if (cmd === 'rm' || cmd === 'del' || cmd === 'remove-item') {
    if (!args[0]) return { error: 'rm: Missing file name to remove.' };
    const target = context.files.find(
      (f) => f.name.toLowerCase() === args[0].toLowerCase() || f.path.toLowerCase() === args[0].toLowerCase()
    );
    if (target) {
      context.onFileDelete(target.id);
      return { output: `Removed item '${target.name}'` };
    }
    return { error: `Remove-Item : Cannot find path '${args[0]}' because it does not exist.` };
  }

  // ECHO with redirection: echo "hello" > file.js
  if (cmd === 'echo') {
    const redirectIdx = args.findIndex((a) => a === '>' || a === '>>');
    if (redirectIdx !== -1 && redirectIdx < args.length - 1) {
      const content = args.slice(0, redirectIdx).join(' ').replace(/^["']|["']$/g, '');
      const targetFile = args[redirectIdx + 1];
      const isAppend = args[redirectIdx] === '>>';

      const existing = context.files.find(
        (f) => f.name.toLowerCase() === targetFile.toLowerCase()
      );

      if (existing) {
        const newContent = isAppend ? `${existing.content}\n${content}` : content;
        context.onFileUpdate(existing.id, newContent);
        return { output: `Updated '${targetFile}'` };
      } else {
        context.onFileCreate(targetFile, false);
        return { output: `Created and written to '${targetFile}'` };
      }
    }
    return { output: args.join(' ').replace(/^["']|["']$/g, '') };
  }

  // NODE / BUN / TS-NODE <file> or -e "<code>"
  if (cmd === 'node' || cmd === 'bun' || cmd === 'ts-node' || cmd === 'tsx') {
    if (args.length === 0 && cmd === 'node') {
      return {
        output: `Welcome to Node.js v20.18.0.\nType ".help" for more information.`,
        enterNodeRepl: true,
      };
    }

    // Inline eval: node -e "code"
    const eIdx = args.indexOf('-e');
    if (eIdx !== -1 && eIdx < args.length - 1) {
      const inlineCode = args.slice(eIdx + 1).join(' ').replace(/^["']|["']$/g, '');
      const res = await executeCode('javascript', inlineCode);
      if (res.stderr) return { error: res.stderr };
      return { output: res.stdout };
    }

    const fileName = args[0];
    const file = context.files.find(
      (f) => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase()
    );
    if (file) {
      if (!file.content || !file.content.trim()) {
        return { output: '' };
      }
      const lang = file.language || (file.name.endsWith('.ts') ? 'typescript' : 'javascript');
      const res = await executeCode(lang, file.content);
      if (res.stderr) return { error: res.stderr };
      return { output: res.stdout };
    }

    // Try executing through backend shell
    const backendRes = await tryBackendShell(input);
    if (backendRes) return backendRes;

    return { error: `${cmd}: cannot find module or file '${fileName}'` };
  }

  // PYTHON / PYTHON3 <file> or -c "<code>"
  if (cmd === 'python' || cmd === 'python3' || cmd === 'py') {
    if (args.length === 0) {
      return { output: 'Python 3.11.4 (tags/v3.11.4:d2340ef) [MSC v.1934 64 bit (AMD64)] on win32\nType "help", "copyright", "credits" or "license" for more information.' };
    }

    // Inline eval: python -c "code"
    const cIdx = args.indexOf('-c');
    if (cIdx !== -1 && cIdx < args.length - 1) {
      const inlineCode = args.slice(cIdx + 1).join(' ').replace(/^["']|["']$/g, '');
      if (!inlineCode.trim()) return { output: '' };
      const res = await executeCode('python', inlineCode);
      if (res.stderr) return { error: res.stderr };
      return { output: res.stdout };
    }

    const fileName = args[0];
    const file = context.files.find(
      (f) => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase()
    );
    if (file) {
      if (!file.content || !file.content.trim()) {
        return { output: '' };
      }
      const res = await executeCode('python', file.content);
      if (res.stderr) return { error: res.stderr };
      return { output: res.stdout };
    }

    // Try executing through backend shell
    const backendRes = await tryBackendShell(input);
    if (backendRes) return backendRes;

    return { error: `python: can't open file '${fileName}': [Errno 2] No such file or directory` };
  }

  // C / C++ (gcc, g++, clang, clang++)
  if (cmd === 'gcc' || cmd === 'g++' || cmd === 'clang' || cmd === 'clang++') {
    const fileName = args.find((a) => !a.startsWith('-'));
    if (fileName) {
      const file = context.files.find(
        (f) => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase()
      );
      if (file) {
        if (!file.content || !file.content.trim()) {
          return { output: '' };
        }
        const lang = cmd.includes('++') || file.name.endsWith('.cpp') ? 'cpp' : 'c';
        const res = await executeCode(lang, file.content);
        if (res.stderr) return { error: res.stderr };
        return { output: res.stdout };
      }
    }
    const backendRes = await tryBackendShell(input);
    if (backendRes) return backendRes;
  }

  // JAVA / JAVAC <file>
  if (cmd === 'java' || cmd === 'javac') {
    const fileName = args.find((a) => !a.startsWith('-')) || (context.files.find(f => f.name.toLowerCase().endsWith('.java'))?.name);
    if (fileName) {
      const file = context.files.find(
        (f) => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase()
      );
      if (file) {
        if (!file.content || !file.content.trim()) {
          return { output: '' };
        }
        const res = await executeCode('java', file.content, '', file.name);
        if (res.stderr) return { error: res.stderr };
        return { output: res.stdout || 'Program executed successfully with no output.' };
      }
      return { error: `java: can't find file '${fileName}' in workspace` };
    }
    const backendRes = await tryBackendShell(input);
    if (backendRes) return backendRes;
  }

  // RUN <file> (Automatic language runner)
  if (cmd === 'run' && args.length > 0) {
    const fileName = args[0];
    const file = context.files.find(
      (f) => f.name.toLowerCase() === fileName.toLowerCase() || f.path.toLowerCase() === fileName.toLowerCase()
    );
    if (file) {
      if (!file.content || !file.content.trim()) {
        return { output: '' };
      }
      const lang = file.language || (file.name.endsWith('.py') ? 'python' : file.name.endsWith('.java') ? 'java' : file.name.endsWith('.ts') ? 'typescript' : file.name.endsWith('.cpp') ? 'cpp' : 'javascript');
      const res = await executeCode(lang, file.content, '', file.name);
      if (res.stderr) return { error: res.stderr };
      return { output: res.stdout };
    }
    return { error: `run: cannot find file '${fileName}' in workspace` };
  }

  // GIT
  if (cmd === 'git') {
    const sub = args[0];
    if (sub === 'status') {
      return {
        output: `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\t${context.files.length > 0 ? context.files.map(f => `modified:   ${f.name}`).join('\n\t') : 'nothing to commit, working tree clean'}`,
      };
    }
    if (sub === 'init') {
      return { output: `Initialized empty Git repository in ${context.cwd}\\.git\\` };
    }
    if (sub === 'branch') {
      return { output: `* main` };
    }
    if (sub === 'add') {
      return { output: '' };
    }
    if (sub === 'commit') {
      const msg = args.slice(1).join(' ').replace(/-m\s*/, '').replace(/["']/g, '') || 'Update workspace files';
      const hash = Math.random().toString(16).substring(2, 9);
      return {
        output: `[main ${hash}] ${msg}\n ${context.files.length} files changed, 48 insertions(+)`,
      };
    }
    return { output: `git version 2.44.0.windows.1\nType 'git --help' for command details.` };
  }

  // NPM
  if (cmd === 'npm') {
    const sub = args[0];
    if (sub === 'init' || sub === 'init -y') {
      const pkg = JSON.stringify(
        {
          name: 'codex-project',
          version: '1.0.0',
          description: 'CodeSphere Codex Project',
          main: 'index.js',
          scripts: { start: 'node index.js', test: 'echo "Error: no test specified" && exit 1' },
          keywords: [],
          author: '',
          license: 'ISC',
        },
        null,
        2
      );
      context.onFileCreate('package.json', false);
      return { output: `Wrote to ${context.cwd}\\package.json:\n\n${pkg}` };
    }
    if (sub === 'install' || sub === 'i') {
      const pkgName = args[1] || 'dependencies';
      return {
        output: `added 14 packages, and audited 15 packages in 842ms\n\nfound 0 vulnerabilities`,
      };
    }
    if (sub === 'run' || sub === 'start' || sub === 'test') {
      return {
        output: `> codex-project@1.0.0 ${sub}\n> node index.js\n\nExecution finished with exit code 0.`,
      };
    }
    return { output: 'npm v10.8.2' };
  }

  // WHOAMI
  if (cmd === 'whoami') {
    return { output: `${context.username || 'user'}` };
  }

  // DATE
  if (cmd === 'date') {
    return { output: new Date().toString() };
  }

  // Try backend shell execution for arbitrary system and terminal commands
  const backendRes = await tryBackendShell(input);
  if (backendRes) {
    return backendRes;
  }

  // Unknown command
  return {
    error: `${cmd} : The term '${cmd}' is not recognized as the name of a cmdlet, function, script file, or operable program.\nCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.`,
  };
}

async function tryBackendShell(command: string): Promise<CommandResponse | null> {
  const isTestEnv = typeof process !== 'undefined' && (process.env?.VITEST || process.env?.NODE_ENV === 'test');
  if (isTestEnv || typeof window === 'undefined') return null;

  try {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'bash', code: command }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.stderr && !data.stdout) {
        return { error: data.stderr };
      }
      return {
        output: data.stdout || (data.stderr ? '' : 'Command executed with no output.'),
        error: data.stderr || undefined,
      };
    }
  } catch {}
  return null;
}

async function evaluateReplWorker(input: string): Promise<CommandResponse> {
  const isTestEnv = typeof process !== 'undefined' && (process.env?.VITEST || process.env?.NODE_ENV === 'test');
  if (!isTestEnv && typeof window !== 'undefined' && typeof Worker !== 'undefined') {
    return new Promise((resolve) => {
      try {
        const worker = new Worker(
          new URL('../workers/repl.worker.ts', import.meta.url),
          { type: 'module' }
        );
        const timer = setTimeout(() => {
          worker.terminate();
          resolve({ error: 'Evaluation timed out after 3s.' });
        }, 3000);

        worker.onmessage = (e: MessageEvent) => {
          clearTimeout(timer);
          worker.terminate();
          if (e.data.error) {
            resolve({ error: e.data.error });
          } else {
            resolve({ output: e.data.output });
          }
        };

        worker.onerror = (e) => {
          clearTimeout(timer);
          worker.terminate();
          resolve({ error: e.message || 'REPL evaluation error' });
        };

        worker.postMessage({ id: `repl_${Date.now()}`, input });
        return;
      } catch {
        // Fallback below
      }
    });
  }

  // Safe fallback for testing environments
  try {
    const runner = new Function(`return (${input})`);
    const res = runner();
    return { output: formatReplOutput(res) };
  } catch {
    try {
      const runner = new Function(input);
      const res = runner();
      return { output: res !== undefined ? formatReplOutput(res) : 'undefined' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { error: `Uncaught ${msg}` };
    }
  }
}

function formatReplOutput(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return `'${val}'`;
  if (typeof val === 'function') return `[Function: ${(val as Function).name || 'anonymous'}]`;
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

function splitArguments(line: string): string[] {
  const match = line.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
  return match ? match.map((s) => s.replace(/^["']|["']$/g, '')) : [line];
}
