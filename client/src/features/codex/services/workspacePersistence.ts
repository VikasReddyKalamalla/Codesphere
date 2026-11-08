import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { WorkspaceFile } from '../types/codex';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface WorkspaceMetadata {
  id: string;
  name: string;
  updatedAt: string;
  fileCount: number;
}

const LOCAL_WORKSPACE_LIST_KEY = 'codesphere_workspaces_list';

// Debounced save timer
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const saveWorkspaceFilesDebounced = (
  workspaceId: string,
  files: WorkspaceFile[],
  delayMs: number = 1000
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      try {
        // Always persist to local storage as optimistic/offline cache
        localStorage.setItem(`codesphere_ws_${workspaceId}_files`, JSON.stringify(files));
        localStorage.setItem('codesphere_codex_user_files', JSON.stringify(files));

        if (isSupabaseConfigured) {
          // Sync files to Supabase
          for (const file of files) {
            await supabase.from('workspace_files').upsert({
              workspace_id: workspaceId,
              name: file.name,
              path: file.path,
              content: file.content,
              language: file.language,
              is_folder: Boolean(file.isFolder || file.type === 'folder'),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'workspace_id,path' });
          }
        }
        resolve(true);
      } catch (err) {
        console.warn('Workspace save warning:', err);
        resolve(false);
      }
    }, delayMs);
  });
};

/**
 * Export current workspace files as a ZIP archive
 */
export const exportWorkspaceZip = async (
  workspaceName: string,
  files: WorkspaceFile[]
): Promise<void> => {
  const zip = new JSZip();

  for (const file of files) {
    if (file.type !== 'folder' && !file.isFolder) {
      // Clean path to prevent leading slashes
      const relativePath = file.path.replace(/^\/+/, '');
      zip.file(relativePath, file.content);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `${workspaceName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_export.zip`;
  saveAs(blob, filename);
};

/**
 * Import files from a ZIP archive into WorkspaceFile format
 */
export const importWorkspaceZip = async (zipFile: File): Promise<WorkspaceFile[]> => {
  const zip = await JSZip.loadAsync(zipFile);
  const importedFiles: WorkspaceFile[] = [];

  const entries: { path: string; file: JSZip.JSZipObject }[] = [];
  zip.forEach((relativePath, file) => {
    entries.push({ path: relativePath, file });
  });

  for (const entry of entries) {
    const isFolder = entry.file.dir;
    const cleanPath = entry.path.replace(/\/$/, '');
    const parts = cleanPath.split('/');
    const name = parts[parts.length - 1];

    if (!name) continue;

    let content = '';
    if (!isFolder) {
      content = await entry.file.async('text');
    }

    let lang = 'plaintext';
    if (name.endsWith('.js') || name.endsWith('.jsx')) lang = 'javascript';
    else if (name.endsWith('.ts') || name.endsWith('.tsx')) lang = 'typescript';
    else if (name.endsWith('.py')) lang = 'python';
    else if (name.endsWith('.html')) lang = 'html';
    else if (name.endsWith('.css')) lang = 'css';
    else if (name.endsWith('.json')) lang = 'json';
    else if (name.endsWith('.md')) lang = 'markdown';
    else if (name.endsWith('.cpp') || name.endsWith('.c')) lang = 'cpp';
    else if (name.endsWith('.java')) lang = 'java';

    importedFiles.push({
      id: `f_imp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      path: cleanPath,
      content,
      type: isFolder ? 'folder' : 'file',
      isFolder,
      language: lang,
      isOpen: false,
    });
  }

  return importedFiles;
};

/**
 * Get stored workspace list
 */
export const getSavedWorkspaces = (): WorkspaceMetadata[] => {
  try {
    const raw = localStorage.getItem(LOCAL_WORKSPACE_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'default-workspace',
      name: 'CodeSphere Main',
      updatedAt: new Date().toLocaleDateString(),
      fileCount: 4,
    },
  ];
};

/**
 * Save workspace to list
 */
export const saveWorkspaceMetadata = (meta: WorkspaceMetadata): void => {
  try {
    const list = getSavedWorkspaces().filter((w) => w.id !== meta.id);
    list.unshift(meta);
    localStorage.setItem(LOCAL_WORKSPACE_LIST_KEY, JSON.stringify(list));
  } catch {}
};

/**
 * Delete workspace
 */
export const deleteWorkspaceMetadata = (id: string): void => {
  try {
    const list = getSavedWorkspaces().filter((w) => w.id !== id);
    localStorage.setItem(LOCAL_WORKSPACE_LIST_KEY, JSON.stringify(list));
    localStorage.removeItem(`codesphere_ws_${id}_files`);
  } catch {}
};
