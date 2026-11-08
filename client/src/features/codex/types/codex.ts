export type WorkspaceRole = 'owner' | 'member';

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'file' | 'folder';
  language: string;
  isFolder?: boolean;
  isOpen?: boolean;
  isModified?: boolean;
}

export interface WorkspaceMember {
  userId: string;
  fullName: string;
  avatar: string;
  role: WorkspaceRole;
  isOnline: boolean;
  color: string;
  cursor?: {
    row: number;
    col: number;
    filePath: string;
  };
}

export type TerminalTabType = 'problems' | 'output' | 'debug' | 'terminal' | 'ports';
export type ShellType = 'powershell' | 'bash' | 'node' | 'cmd';

export interface TerminalEntry {
  id: string;
  type: 'stdin' | 'stdout' | 'stderr' | 'system' | 'info';
  text: string;
  prompt?: string;
  command?: string;
  timestamp: string;
}

export interface TerminalInstance {
  id: string;
  name: string;
  shell: ShellType;
  cwd: string;
  history: TerminalEntry[];
  commandHistory: string[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: string;
}

export interface GitCommit {
  hash: string;
  author: string;
  message: string;
  date: string;
  branch: string;
  filesChanged: number;
}
