import { realtimeSync, SyncPayload } from './realtimeSync';
import { codexGit } from './gitService';

export interface LineAuthorship {
  lineNumber: number;
  author: string;
  userColor: string;
  commitHash?: string;
  commitMessage?: string;
  timestamp: number;
}

export type BlameDisplayMode = 'active-line' | 'all-lines' | 'off';

class LiveBlameService {
  // Map of filePath -> (Map of lineNumber -> LineAuthorship)
  private authorshipMap = new Map<string, Map<number, LineAuthorship>>();
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      realtimeSync.subscribe((payload: SyncPayload) => {
        if (payload.type === ('LINE_BLAME_UPDATE' as any)) {
          const data = payload.data as {
            filePath: string;
            authorship: LineAuthorship;
          };
          if (data && data.filePath && data.authorship) {
            this.setAuthorshipInternal(data.filePath, data.authorship);
            this.notify();
          }
        } else if (payload.type === 'FILE_CONTENT_CHANGE') {
          // When a remote peer changes content, associate recent changes with them
          const data = payload.data as { path?: string; filePath?: string };
          const p = data.path || data.filePath;
          if (p) {
            // Seed attribution
            this.recordLineEdit(
              p,
              1,
              payload.senderName || 'Collaborator',
              payload.senderColor || '#3b82f6'
            );
          }
        }
      });
    }
  }

  private normalizePath(path: string): string {
    return path.replace(/^[/\\]+/, '').toLowerCase();
  }

  private setAuthorshipInternal(filePath: string, authorship: LineAuthorship) {
    const key = this.normalizePath(filePath);
    if (!this.authorshipMap.has(key)) {
      this.authorshipMap.set(key, new Map());
    }
    this.authorshipMap.get(key)!.set(authorship.lineNumber, authorship);
  }

  public recordLineEdit(
    filePath: string,
    lineNumber: number,
    author: string,
    userColor = '#04AA6D',
    commitHash?: string,
    commitMessage?: string,
    broadcast = true
  ) {
    const authorship: LineAuthorship = {
      lineNumber,
      author,
      userColor,
      commitHash: commitHash || this.getMockCommitHash(author, lineNumber),
      commitMessage: commitMessage || 'Live collaborative update',
      timestamp: Date.now(),
    };

    this.setAuthorshipInternal(filePath, authorship);
    this.notify();

    if (broadcast) {
      try {
        realtimeSync.broadcast('LINE_BLAME_UPDATE' as any, {
          filePath,
          authorship,
        });
      } catch {}
    }
  }

  public getAuthorship(filePath: string, lineNumber: number): LineAuthorship | null {
    const key = this.normalizePath(filePath);
    const fileMap = this.authorshipMap.get(key);
    if (!fileMap) return null;
    return fileMap.get(lineNumber) || null;
  }

  public getFileAuthorship(filePath: string): Map<number, LineAuthorship> {
    const key = this.normalizePath(filePath);
    return this.authorshipMap.get(key) || new Map();
  }

  public formatInlineBlame(authorship: LineAuthorship, language = 'javascript'): string {
    const timeAgo = this.formatTimeAgo(authorship.timestamp);
    const hash = authorship.commitHash ? ` [${authorship.commitHash}]` : '';
    const msg = authorship.commitMessage ? ` • "${authorship.commitMessage}"` : '';

    const lang = language.toLowerCase();
    const commentPrefix =
      lang === 'python' || lang === 'py' || lang === 'ruby' || lang === 'shell' || lang === 'bash'
        ? '#'
        : 'HTML'.toLowerCase() === lang || lang === 'xml'
        ? '<!--'
        : '//';

    const commentSuffix = lang === 'html' || lang === 'xml' ? ' -->' : '';

    return `   ${commentPrefix} 👤 ${authorship.author} • ${timeAgo}${hash}${msg}${commentSuffix}`;
  }

  public generateCommitHeaderComment(
    author: string,
    commitMsg: string,
    hash: string,
    language = 'javascript'
  ): string {
    const dateStr = new Date().toLocaleString();
    const lang = language.toLowerCase();

    if (lang === 'python' || lang === 'py' || lang === 'ruby' || lang === 'shell') {
      return [
        '# ========================================================',
        `# [Git Commit Log] • ${hash}`,
        `# Author: ${author}`,
        `# Date:   ${dateStr}`,
        `# Commit: ${commitMsg}`,
        '# ========================================================',
        '',
      ].join('\n');
    }

    if (lang === 'html' || lang === 'xml') {
      return [
        '<!-- ========================================================',
        `     [Git Commit Log] • ${hash}`,
        `     Author: ${author}`,
        `     Date:   ${dateStr}`,
        `     Commit: ${commitMsg}`,
        '     ======================================================== -->',
        '',
      ].join('\n');
    }

    // Default C / JS / TS / Go / Rust
    return [
      '// ========================================================',
      `// [Git Commit Log] • ${hash}`,
      `// Author: ${author}`,
      `// Date:   ${dateStr}`,
      `// Commit: ${commitMsg}`,
      '// ========================================================',
      '',
    ].join('\n');
  }

  public async seedFromGit(filePath: string, content: string, defaultAuthor = 'Developer') {
    const key = this.normalizePath(filePath);
    if (!this.authorshipMap.has(key)) {
      this.authorshipMap.set(key, new Map());
    }
    const fileMap = this.authorshipMap.get(key)!;

    try {
      const logs = await codexGit.getLog(5);
      const latest = logs[0] || {
        hash: 'c1ef5a2',
        author: defaultAuthor,
        message: 'Initial project commit',
      };

      const lines = content.split('\n');
      lines.forEach((_, idx) => {
        const lineNum = idx + 1;
        if (!fileMap.has(lineNum)) {
          fileMap.set(lineNum, {
            lineNumber: lineNum,
            author: latest.author,
            userColor: '#04AA6D',
            commitHash: latest.hash,
            commitMessage: latest.message,
            timestamp: Date.now() - (lines.length - idx) * 60000,
          });
        }
      });
      this.notify();
    } catch {
      // Fallback seed
      const lines = content.split('\n');
      lines.forEach((_, idx) => {
        const lineNum = idx + 1;
        if (!fileMap.has(lineNum)) {
          fileMap.set(lineNum, {
            lineNumber: lineNum,
            author: defaultAuthor,
            userColor: '#04AA6D',
            commitHash: 'ad7482f',
            commitMessage: 'Initial code implementation',
            timestamp: Date.now() - 120000,
          });
        }
      });
      this.notify();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {}
    });
  }

  private formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  private getMockCommitHash(author: string, line: number): string {
    const hashNum = (author.length * 17 + line * 31 + 42) % 16777215;
    return hashNum.toString(16).padStart(7, '0').substring(0, 7);
  }
}

export const liveBlameService = new LiveBlameService();
