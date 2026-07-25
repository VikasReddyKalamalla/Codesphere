const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const SandboxProgress = require('../models/SandboxProgress');
const SandboxProject = require('../models/SandboxProject');

const getWorkspacePath = (projectId, userId) => {
  return path.join(__dirname, '..', 'uploads', 'workspaces', `${projectId}_${userId}`);
};

/**
 * Write files from DB progress to disk.
 */
const syncDbToDisk = async (projectId, userId) => {
  const workspacePath = getWorkspacePath(projectId, userId);
  await fsPromises.mkdir(workspacePath, { recursive: true });

  let progress = await SandboxProgress.findOne({ projectId, userId });
  if (!progress) {
    progress = new SandboxProgress({
      projectId,
      userId,
      currentStep: 1,
      completedSteps: [],
      completionPercent: 0,
      codeFiles: {}
    });
  }

  // Get code files from progress
  let codeFiles = progress.codeFiles;
  if (!codeFiles || Object.keys(codeFiles).length === 0) {
    // If no code files in progress, seed them from project template
    const project = await SandboxProject.findById(projectId);
    if (project) {
      codeFiles = {
        'index.html': `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n  <h1>${project.title}</h1>\n  <script src="script.js"></script>\n</body>\n</html>`,
        'styles.css': `body { font-family: sans-serif; background: #0B0F17; color: white; padding: 20px; }`,
        'script.js': `console.log("Welcome to ${project.title}!");`
      };
      progress.codeFiles = codeFiles;
      progress.markModified('codeFiles');
      await progress.save();
    }
  }

  // Write each file to the disk
  for (const [filepath, content] of Object.entries(codeFiles || {})) {
    const fullPath = path.join(workspacePath, filepath);
    await fsPromises.mkdir(path.dirname(fullPath), { recursive: true });
    await fsPromises.writeFile(fullPath, content, 'utf8');
  }

  // Write VS Code settings to workspace directory to apply Codesphere colors
  const settingsDir = path.join(workspacePath, '.vscode');
  await fsPromises.mkdir(settingsDir, { recursive: true });
  const settingsContent = {
    "workbench.colorTheme": "Default Dark Modern",
    "workbench.colorCustomizations": {
      "editor.background": "#0B0F17",
      "editor.foreground": "#e2e8f0",
      "sideBar.background": "#0d1117",
      "sideBarSectionHeader.background": "#0d1117",
      "activityBar.background": "#0d1117",
      "activityBar.foreground": "#04AA6D",
      "activityBar.inactiveForeground": "#64748b",
      "titleBar.activeBackground": "#0B0F17",
      "statusBar.background": "#04AA6D",
      "statusBar.foreground": "#ffffff",
      "terminal.background": "#0B0F17",
      "editorGroupHeader.tabsBackground": "#0d1117"
    }
  };
  await fsPromises.writeFile(path.join(settingsDir, 'settings.json'), JSON.stringify(settingsContent, null, 2), 'utf8');

  return workspacePath;
};

/**
 * Read files from disk to DB progress.
 */
const syncDiskToDb = async (projectId, userId) => {
  const workspacePath = getWorkspacePath(projectId, userId);
  if (!fs.existsSync(workspacePath)) return null;

  const progress = await SandboxProgress.findOne({ projectId, userId });
  if (!progress) return null;

  const readDir = async (dir, baseDir = '') => {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true });
    let files = {};
    for (const entry of entries) {
      const relPath = baseDir ? `${baseDir}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);

      // Skip special folders
      if (entry.name === '.vscode' || entry.name === 'node_modules' || entry.name === '.git') {
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await readDir(fullPath, relPath);
        Object.assign(files, subFiles);
      } else {
        const content = await fsPromises.readFile(fullPath, 'utf8');
        files[relPath] = content;
      }
    }
    return files;
  };

  const codeFiles = await readDir(workspacePath);
  progress.codeFiles = codeFiles;
  progress.markModified('codeFiles');
  await progress.save();
  return progress;
};

module.exports = {
  getWorkspacePath,
  syncDbToDisk,
  syncDiskToDb
};
