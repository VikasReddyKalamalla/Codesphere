import git from 'isomorphic-git';
import FS from '@isomorphic-git/lightning-fs';
import { WorkspaceFile, GitCommit } from '../types/codex';

const fs = new FS('codesphere_git_fs');
const dir = '/repo';

export class CodexGitService {
  private initialized = false;

  public async initRepository(files: WorkspaceFile[], authorName = 'Developer', authorEmail = 'developer@codesphere.io'): Promise<void> {
    try {
      await fs.promises.mkdir(dir).catch(() => {});
      await git.init({ fs, dir });

      // Sync workspace files to LightningFS
      await this.syncFilesToFs(files);

      // Initial commit if empty
      const statusMatrix = await git.statusMatrix({ fs, dir });
      for (const [filepath] of statusMatrix) {
        await git.add({ fs, dir, filepath });
      }

      await git.commit({
        fs,
        dir,
        message: 'Initial commit — CodeSphere project setup',
        author: { name: authorName, email: authorEmail },
      });

      this.initialized = true;
    } catch (e) {
      console.warn('Git init warning:', e);
      this.initialized = true;
    }
  }

  public async syncFilesToFs(files: WorkspaceFile[]): Promise<void> {
    for (const f of files) {
      if (f.type !== 'folder' && !f.isFolder) {
        const cleanPath = `${dir}/${f.path.replace(/^\/+/, '')}`;
        const parent = cleanPath.substring(0, cleanPath.lastIndexOf('/'));
        await fs.promises.mkdir(parent).catch(() => {});
        await fs.promises.writeFile(cleanPath, f.content, 'utf8');
      }
    }
  }

  public async stageFile(filepath: string): Promise<void> {
    await git.add({ fs, dir, filepath: filepath.replace(/^\/+/, '') });
  }

  public async createCommit(message: string, authorName = 'Developer', authorEmail = 'developer@codesphere.io'): Promise<string> {
    return await git.commit({
      fs,
      dir,
      message,
      author: { name: authorName, email: authorEmail },
    });
  }

  public async getLog(depth = 10): Promise<GitCommit[]> {
    try {
      const commits = await git.log({ fs, dir, depth });
      return commits.map((c) => ({
        hash: c.oid.substring(0, 7),
        author: c.commit.author.name,
        message: c.commit.message,
        date: new Date(c.commit.author.timestamp * 1000).toLocaleDateString(),
        branch: 'main',
        filesChanged: 1,
      }));
    } catch {
      return [];
    }
  }

  public async getCurrentBranch(): Promise<string> {
    try {
      const branch = await git.currentBranch({ fs, dir, fullname: false });
      return branch || 'main';
    } catch {
      return 'main';
    }
  }

  public async pushToRemote(remoteUrl: string, token: string, branch = 'main'): Promise<{ ok: boolean; message: string }> {
    try {
      const http = (await import('isomorphic-git/http/web')).default;
      await git.push({
        fs,
        http,
        dir,
        url: remoteUrl,
        ref: branch,
        corsProxy: 'https://cors.isomorphic-git.org',
        onAuth: () => ({ username: token }),
      });
      return { ok: true, message: 'Successfully pushed commits to remote GitHub repository!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, message: `Push failed: ${msg}` };
    }
  }
}

export const codexGit = new CodexGitService();
