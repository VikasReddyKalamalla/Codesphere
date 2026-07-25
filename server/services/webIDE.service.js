/**
 * Web IDE Service
 * Complete web-based VS Code-like IDE integration
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const logger = require('../utils/logger');

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || './workspaces';

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Create workspace for user
 */
const createWorkspace = async (userId, projectName) => {
  try {
    const workspacePath = path.join(WORKSPACE_DIR, userId, projectName);

    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true });
    }

    // Create .gitignore
    const gitignore = `node_modules/\n.env\n.DS_Store\n*.log\n`;
    fs.writeFileSync(path.join(workspacePath, '.gitignore'), gitignore);

    // Create package.json template
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: 'Web IDE Project',
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js',
      },
      keywords: [],
      author: '',
      license: 'ISC',
    };
    fs.writeFileSync(
      path.join(workspacePath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create README
    const readme = `# ${projectName}\n\nWeb IDE Project\n`;
    fs.writeFileSync(path.join(workspacePath, 'README.md'), readme);

    logger.info(`Workspace created: ${workspacePath}`);

    return {
      workspacePath,
      projectName,
      userId,
      createdAt: new Date(),
    };
  } catch (error) {
    logger.error(`Workspace creation error: ${error.message}`);
    throw createError('Failed to create workspace', 500);
  }
};

/**
 * Get workspace files structure
 */
const getWorkspaceStructure = async (userId, projectName) => {
  try {
    const workspacePath = path.join(WORKSPACE_DIR, userId, projectName);

    if (!fs.existsSync(workspacePath)) {
      throw createError('Workspace not found', 404);
    }

    const structure = buildFileTree(workspacePath);

    return {
      path: workspacePath,
      structure,
    };
  } catch (error) {
    logger.error(`Get structure error: ${error.message}`);
    throw error;
  }
};

/**
 * Build file tree recursively
 */
const buildFileTree = (dir, maxDepth = 5, currentDepth = 0) => {
  if (currentDepth >= maxDepth) return null;

  try {
    const files = fs.readdirSync(dir);
    const tree = [];

    files.forEach((file) => {
      if (file.startsWith('.')) return;

      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      const relativePath = path.relative(WORKSPACE_DIR, fullPath);

      if (stat.isDirectory()) {
        tree.push({
          name: file,
          type: 'directory',
          path: relativePath,
          children: buildFileTree(fullPath, maxDepth, currentDepth + 1),
        });
      } else {
        tree.push({
          name: file,
          type: 'file',
          path: relativePath,
          size: stat.size,
        });
      }
    });

    return tree;
  } catch (error) {
    logger.error(`Build file tree error: ${error.message}`);
    return null;
  }
};

/**
 * Read file content
 */
const readFile = async (userId, filePath) => {
  try {
    const fullPath = path.join(WORKSPACE_DIR, userId, filePath);

    // Security check: prevent directory traversal
    if (!fullPath.startsWith(path.join(WORKSPACE_DIR, userId))) {
      throw createError('Access denied', 403);
    }

    if (!fs.existsSync(fullPath)) {
      throw createError('File not found', 404);
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      throw createError('Path is a directory', 400);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const language = getLanguageFromExtension(path.extname(fullPath));

    return {
      path: filePath,
      content,
      language,
      size: stat.size,
      modified: stat.mtime,
    };
  } catch (error) {
    logger.error(`Read file error: ${error.message}`);
    throw error;
  }
};

/**
 * Write file content
 */
const writeFile = async (userId, filePath, content) => {
  try {
    const fullPath = path.join(WORKSPACE_DIR, userId, filePath);

    // Security check
    if (!fullPath.startsWith(path.join(WORKSPACE_DIR, userId))) {
      throw createError('Access denied', 403);
    }

    // Create directory if needed
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf-8');

    logger.info(`File written: ${filePath}`);

    return {
      path: filePath,
      size: content.length,
      modified: new Date(),
    };
  } catch (error) {
    logger.error(`Write file error: ${error.message}`);
    throw createError('Failed to write file', 500);
  }
};

/**
 * Delete file or directory
 */
const deleteFileOrDir = async (userId, filePath) => {
  try {
    const fullPath = path.join(WORKSPACE_DIR, userId, filePath);

    if (!fullPath.startsWith(path.join(WORKSPACE_DIR, userId))) {
      throw createError('Access denied', 403);
    }

    if (!fs.existsSync(fullPath)) {
      throw createError('Path not found', 404);
    }

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }

    logger.info(`Deleted: ${filePath}`);

    return {
      path: filePath,
      deleted: true,
    };
  } catch (error) {
    logger.error(`Delete error: ${error.message}`);
    throw error;
  }
};

/**
 * Create new file
 */
const createFile = async (userId, filePath, content = '') => {
  try {
    const fullPath = path.join(WORKSPACE_DIR, userId, filePath);

    if (!fullPath.startsWith(path.join(WORKSPACE_DIR, userId))) {
      throw createError('Access denied', 403);
    }

    if (fs.existsSync(fullPath)) {
      throw createError('File already exists', 409);
    }

    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf-8');

    logger.info(`File created: ${filePath}`);

    return {
      path: filePath,
      created: true,
      size: content.length,
    };
  } catch (error) {
    logger.error(`Create file error: ${error.message}`);
    throw error;
  }
};

/**
 * Create new directory
 */
const createDirectory = async (userId, dirPath) => {
  try {
    const fullPath = path.join(WORKSPACE_DIR, userId, dirPath);

    if (!fullPath.startsWith(path.join(WORKSPACE_DIR, userId))) {
      throw createError('Access denied', 403);
    }

    if (fs.existsSync(fullPath)) {
      throw createError('Directory already exists', 409);
    }

    fs.mkdirSync(fullPath, { recursive: true });

    logger.info(`Directory created: ${dirPath}`);

    return {
      path: dirPath,
      created: true,
    };
  } catch (error) {
    logger.error(`Create directory error: ${error.message}`);
    throw error;
  }
};

/**
 * Search files by name or content
 */
const searchFiles = async (userId, projectName, query, searchContent = false) => {
  try {
    const workspacePath = path.join(WORKSPACE_DIR, userId, projectName);
    const results = [];

    const searchDir = (dir, depth = 0) => {
      if (depth > 10 || results.length > 100) return;

      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        if (file.startsWith('.')) return;

        const fullPath = path.join(dir, fullPath);
        const relativePath = path.relative(workspacePath, fullPath);

        try {
          const stat = fs.statSync(fullPath);

          // Search by filename
          if (file.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              type: stat.isDirectory() ? 'directory' : 'file',
              path: relativePath,
              name: file,
            });
          }

          // Search by content
          if (searchContent && stat.isFile() && isTextFile(file)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.toLowerCase().includes(query.toLowerCase())) {
              results.push({
                type: 'content',
                path: relativePath,
                preview: content.substring(0, 100),
              });
            }
          }

          if (stat.isDirectory()) {
            searchDir(fullPath, depth + 1);
          }
        } catch (e) {
          // Ignore read errors
        }
      });
    };

    searchDir(workspacePath);

    return {
      query,
      results,
      count: results.length,
    };
  } catch (error) {
    logger.error(`Search error: ${error.message}`);
    throw createError('Search failed', 500);
  }
};

/**
 * Get language from file extension
 */
const getLanguageFromExtension = (ext) => {
  const languageMap = {
    '.js': 'javascript',
    '.jsx': 'jsx',
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.php': 'php',
    '.rb': 'ruby',
    '.go': 'go',
    '.rs': 'rust',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.json': 'json',
    '.xml': 'xml',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.md': 'markdown',
    '.sql': 'sql',
    '.sh': 'shell',
    '.dockerfile': 'dockerfile',
  };

  return languageMap[ext.toLowerCase()] || 'plaintext';
};

/**
 * Check if file is text
 */
const isTextFile = (filename) => {
  const textExtensions = [
    'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs',
    'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'md', 'sql', 'sh', 'txt', 'dockerfile',
  ];

  const ext = path.extname(filename).substring(1).toLowerCase();
  return textExtensions.includes(ext);
};

/**
 * Export workspace as ZIP
 */
const exportWorkspace = async (userId, projectName) => {
  try {
    const workspacePath = path.join(WORKSPACE_DIR, userId, projectName);
    const zipPath = path.join(WORKSPACE_DIR, userId, `${projectName}.zip`);

    // In production, use archiver library
    logger.info(`Export initiated for ${projectName}`);

    return {
      projectName,
      zipPath,
      status: 'ready',
    };
  } catch (error) {
    logger.error(`Export error: ${error.message}`);
    throw createError('Export failed', 500);
  }
};

module.exports = {
  createWorkspace,
  getWorkspaceStructure,
  readFile,
  writeFile,
  deleteFileOrDir,
  createFile,
  createDirectory,
  searchFiles,
  exportWorkspace,
  getLanguageFromExtension,
};
