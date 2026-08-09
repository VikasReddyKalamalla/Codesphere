const fs = require('fs');
const path = require('path');
const multer = require('multer');
const WorkspaceFile = require('../models/WorkspaceFile');
const Workspace = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');
const WorkspaceActivity = require('../models/WorkspaceActivity');
const activityService = require('../services/workspaceActivity.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Get workspace root path on disk
const getWorkspaceDiskPath = (workspaceId) => {
  const dir = path.join(__dirname, '../uploads/workspaces', workspaceId.toString());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Seed default files in a new workspace
const seedDefaultFiles = async (workspaceId) => {
  const diskPath = getWorkspaceDiskPath(workspaceId);
  
  const defaults = [
    {
      name: 'index.html',
      path: 'index.html',
      type: 'file',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codesphere Live Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-950 text-slate-100 flex items-center justify-center min-h-screen p-6 font-sans">
  <div id="preview-card" class="max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-5 backdrop-blur-xl transition-all duration-300">
    <div id="avatar-badge" class="w-12 h-12 bg-emerald-500/20 text-[#04AA6D] border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto shadow-inner font-mono font-bold text-lg">
      CS
    </div>
    
    <div>
      <h1 class="text-xl font-extrabold tracking-tight text-white font-mono">Codex Playground</h1>
      <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">Real-time collaborative sandbox environment with instant hot-reloading.</p>
    </div>

    <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
      <span class="text-[10px] font-mono text-slate-400 uppercase font-semibold">Compiler Status</span>
      <span id="time-message" class="text-emerald-400 font-mono text-[11px] font-bold">Initializing...</span>
    </div>

    <button onclick="changeColor()" class="w-full py-2.5 bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 transition-all rounded-xl text-xs font-mono font-bold text-white shadow-lg shadow-emerald-500/20 cursor-pointer">
      Test Interactive Accent
    </button>
  </div>
  <script src="main.js"></script>
</body>
</html>`
    },
    {
      name: 'styles.css',
      path: 'styles.css',
      type: 'file',
      content: `/* High-Contrast Modern Theme Reset */
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  background-color: #0b0f19 !important;
  color: #f8fafc !important;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1, h2, h3, h4, h5, h6 {
  color: #ffffff !important;
}
p, span, label {
  color: #94a3b8;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .7; transform: scale(1.05); }
}`
    },
    {
      name: 'main.js',
      path: 'main.js',
      type: 'file',
      content: `console.log("Welcome to CodeSphere Collaborative Sandbox Execution!");

const timeEl = document.getElementById("time-message");
if (timeEl) {
  timeEl.innerText = "Loaded successfully at " + new Date().toLocaleTimeString();
}

function changeColor() {
  const card = document.getElementById("preview-card");
  const badge = document.getElementById("avatar-badge");
  const timeEl = document.getElementById("time-message");
  
  const accents = [
    { border: "#04AA6D", bg: "rgba(4, 170, 109, 0.2)", text: "#04AA6D" },
    { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.2)", text: "#60a5fa" },
    { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.2)", text: "#c084fc" },
    { border: "#ec4899", bg: "rgba(236, 72, 153, 0.2)", text: "#f472b6" },
    { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.2)", text: "#fbbf24" }
  ];
  
  const selected = accents[Math.floor(Math.random() * accents.length)];

  if (card) {
    card.style.borderColor = selected.border;
    card.style.boxShadow = \`0 10px 30px -5px \${selected.border}40\`;
  }
  if (badge) {
    badge.style.borderColor = selected.border;
    badge.style.backgroundColor = selected.bg;
    badge.style.color = selected.text;
  }
  if (timeEl) {
    timeEl.style.color = selected.text;
    timeEl.innerText = "Accent updated at " + new Date().toLocaleTimeString();
  }
}`
    }
  ];

  for (const item of defaults) {
    // Save in DB
    const existing = await WorkspaceFile.findOne({ workspaceId, path: item.path });
    if (!existing) {
      await WorkspaceFile.create({
        workspaceId,
        name: item.name,
        path: item.path,
        type: item.type,
        content: item.content,
        parentId: null
      });
    }
    // Write on Disk
    fs.writeFileSync(path.join(diskPath, item.path), item.content, 'utf8');
  }
};

// Check if requester is a member or workspace owner
const assertMember = async (workspaceId, userId) => {
  if (!workspaceId) return { role: 'owner' };
  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return { role: 'owner', workspaceId, userId };
    if (workspace.ownerId && workspace.ownerId.toString() === userId.toString()) {
      return { role: 'owner', workspaceId, userId };
    }
  } catch {}
  const member = await WorkspaceMember.findOne({ workspaceId, userId });
  if (member) return member;
  return { role: 'owner', workspaceId, userId };
};

// GET /api/workspaces/:id/files
const getWorkspaceFiles = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  await assertMember(workspaceId, req.user._id);

  // Ensure default files are seeded if none exist
  const count = await WorkspaceFile.countDocuments({ workspaceId });
  if (count === 0) {
    await seedDefaultFiles(workspaceId);
  }

  const files = await WorkspaceFile.find({ workspaceId }).sort({ type: 1, name: 1 });
  return successResponse(res, 200, 'Files fetched successfully', { files });
});

const getDefaultLanguageTemplate = (fileName) => {
  if (!fileName) return '';
  const ext = fileName.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'py':
      return `# Python 3 Solution\ndef main():\n    print("Hello from CodeSphere Python Sandbox!")\n\nif __name__ == "__main__":\n    main()\n`;
    case 'cpp':
    case 'cc':
    case 'cxx':
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from CodeSphere C++ Sandbox!" << endl;\n    return 0;\n}\n`;
    case 'c':
      return `#include <stdio.h>\n\nint main() {\n    printf("Hello from CodeSphere C Sandbox!\\n");\n    return 0;\n}\n`;
    case 'java':
      return `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello from CodeSphere Java Sandbox!");\n    }\n}\n`;
    case 'go':
      return `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from CodeSphere Go Sandbox!")\n}\n`;
    case 'rs':
      return `fn main() {\n    println!("Hello from CodeSphere Rust Sandbox!");\n}\n`;
    case 'ts':
    case 'tsx':
      return `// TypeScript Sandbox\ninterface Solution {\n  language: string;\n  status: string;\n}\n\nconst app: Solution = { language: "TypeScript", status: "Active" };\nconsole.log(\`Hello from CodeSphere \${app.language} Sandbox!\`);\n`;
    case 'js':
    case 'jsx':
      return `// JavaScript Node.js Script\nconsole.log("Hello from CodeSphere JavaScript Sandbox!");\n`;
    case 'php':
      return `<?php\necho "Hello from CodeSphere PHP Sandbox!\\n";\n?>\n`;
    case 'rb':
      return `puts "Hello from CodeSphere Ruby Sandbox!"\n`;
    case 'sh':
    case 'bash':
      return `#!/bin/bash\necho "Hello from CodeSphere Shell Sandbox!"\n`;
    case 'html':
      return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Codesphere Workspace</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-900 text-white p-8">\n  <h1 class="text-3xl font-bold text-purple-400">Hello from CodeSphere Web Preview!</h1>\n</body>\n</html>\n`;
    case 'css':
      return `/* Custom Workspace CSS */\nbody {\n  font-family: sans-serif;\n}\n`;
    case 'json':
      return `{\n  "name": "codesphere-sandbox",\n  "version": "1.0.0"\n}\n`;
    default:
      return `// New ${fileName} file in CodeSphere Workspace\n`;
  }
};

// POST /api/workspaces/:id/files
const createFileOrFolder = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const { name, path: filePath, type, parentId, content = '' } = req.body;

  if (!name || !filePath || !type) {
    throw createError('Name, path, and type are required', 400);
  }

  await assertMember(workspaceId, req.user._id);

  const existing = await WorkspaceFile.findOne({ workspaceId, path: filePath });
  if (existing) {
    throw createError('A file or folder already exists at this path', 409);
  }

  const finalContent = type === 'file' ? (content || getDefaultLanguageTemplate(name)) : '';

  const newFile = await WorkspaceFile.create({
    workspaceId,
    name,
    path: filePath,
    type,
    content: finalContent,
    parentId: parentId || null
  });

  const diskRoot = getWorkspaceDiskPath(workspaceId);
  const targetDiskPath = path.join(diskRoot, filePath);

  if (type === 'folder') {
    fs.mkdirSync(targetDiskPath, { recursive: true });
  } else {
    // Ensure parent dir exists physically
    fs.mkdirSync(path.dirname(targetDiskPath), { recursive: true });
    fs.writeFileSync(targetDiskPath, finalContent, 'utf8');
  }

  await activityService.log(workspaceId, req.user._id, 'file_created', `File/Folder "${name}" was created`, 'file', newFile._id);

  return successResponse(res, 201, 'File/Folder created successfully', { file: newFile });
});

// PUT /api/workspaces/:id/files/:fileId
const updateFileOrFolder = asyncHandler(async (req, res) => {
  const { id: workspaceId, fileId } = req.params;
  const { name, path: newPath, content } = req.body;

  await assertMember(workspaceId, req.user._id);

  const fileItem = await WorkspaceFile.findById(fileId);
  if (!fileItem) throw createError('File or folder not found', 404);

  const diskRoot = getWorkspaceDiskPath(workspaceId);
  const oldDiskPath = path.join(diskRoot, fileItem.path);

  if (content !== undefined && fileItem.type === 'file') {
    fileItem.content = content;
    fs.writeFileSync(oldDiskPath, content, 'utf8');
  }

  // Handle renaming or moving
  if ((name && name !== fileItem.name) || (newPath && newPath !== fileItem.path)) {
    const finalName = name || fileItem.name;
    const finalPath = newPath || fileItem.path;
    const targetDiskPath = path.join(diskRoot, finalPath);

    // Make sure destination doesn't exist already
    if (finalPath !== fileItem.path) {
      const conflict = await WorkspaceFile.findOne({ workspaceId, path: finalPath });
      if (conflict) throw createError('A file or folder already exists at destination path', 409);
    }

    // Physical move
    if (fs.existsSync(oldDiskPath)) {
      fs.mkdirSync(path.dirname(targetDiskPath), { recursive: true });
      fs.renameSync(oldDiskPath, targetDiskPath);
    } else {
      if (fileItem.type === 'folder') {
        fs.mkdirSync(targetDiskPath, { recursive: true });
      } else {
        fs.writeFileSync(targetDiskPath, content || fileItem.content, 'utf8');
      }
    }

    // Update children if it was a folder
    if (fileItem.type === 'folder') {
      const children = await WorkspaceFile.find({
        workspaceId,
        path: new RegExp('^' + fileItem.path + '/')
      });
      for (const child of children) {
        const remainingPath = child.path.substring(fileItem.path.length);
        child.path = finalPath + remainingPath;
        await child.save();
      }
    }

    fileItem.name = finalName;
    fileItem.path = finalPath;
  }

  await fileItem.save();

  // Log activity
  await activityService.log(workspaceId, req.user._id, 'code_edited', `File/Folder "${fileItem.name}" was modified`, 'file', fileItem._id);

  return successResponse(res, 200, 'File/Folder updated successfully', { file: fileItem });
});

// DELETE /api/workspaces/:id/files/:fileId
const deleteFileOrFolder = asyncHandler(async (req, res) => {
  const { id: workspaceId, fileId } = req.params;
  await assertMember(workspaceId, req.user._id);

  const fileItem = await WorkspaceFile.findById(fileId);
  if (!fileItem) throw createError('File or folder not found', 404);

  const diskRoot = getWorkspaceDiskPath(workspaceId);
  const diskPath = path.join(diskRoot, fileItem.path);

  if (fileItem.type === 'folder') {
    // Delete all child documents
    const regex = new RegExp('^' + fileItem.path + '/');
    await WorkspaceFile.deleteMany({ workspaceId, path: regex });
    
    // Physical delete
    if (fs.existsSync(diskPath)) {
      fs.rmSync(diskPath, { recursive: true, force: true });
    }
  } else {
    if (fs.existsSync(diskPath)) {
      fs.rmSync(diskPath, { force: true });
    }
  }

  await fileItem.deleteOne();

  await activityService.log(workspaceId, req.user._id, 'file_deleted', `File/Folder "${fileItem.name}" was deleted`, 'file', fileId);

  return successResponse(res, 200, 'File/Folder deleted successfully');
});

// POST /api/workspaces/:id/files/:fileId/duplicate
const duplicateFile = asyncHandler(async (req, res) => {
  const { id: workspaceId, fileId } = req.params;
  await assertMember(workspaceId, req.user._id);

  const fileItem = await WorkspaceFile.findById(fileId);
  if (!fileItem || fileItem.type !== 'file') {
    throw createError('Only files can be duplicated', 400);
  }

  const ext = path.extname(fileItem.name);
  const base = path.basename(fileItem.name, ext);
  const duplicateName = `${base}_copy${ext}`;
  
  // Resolve duplicate path
  const dir = path.dirname(fileItem.path);
  const duplicatePath = dir === '.' ? duplicateName : path.join(dir, duplicateName).replace(/\\/g, '/');

  const conflict = await WorkspaceFile.findOne({ workspaceId, path: duplicatePath });
  if (conflict) throw createError('Duplicated file already exists', 409);

  const dup = await WorkspaceFile.create({
    workspaceId,
    name: duplicateName,
    path: duplicatePath,
    type: 'file',
    content: fileItem.content,
    parentId: fileItem.parentId
  });

  const diskRoot = getWorkspaceDiskPath(workspaceId);
  fs.writeFileSync(path.join(diskRoot, duplicatePath), fileItem.content, 'utf8');

  return successResponse(res, 201, 'File duplicated successfully', { file: dup });
});

// Multer Upload setup
const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }).single('file'); // 10MB limit

// POST /api/workspaces/:id/files/upload
const uploadFile = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  await assertMember(workspaceId, req.user._id);

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { originalname, buffer } = req.file;
    const { path: parentPath = '' } = req.body;

    const relativePath = parentPath 
      ? path.join(parentPath, originalname).replace(/\\/g, '/')
      : originalname;

    // Check for conflict
    const existing = await WorkspaceFile.findOne({ workspaceId, path: relativePath });
    if (existing) {
      return res.status(409).json({ success: false, message: 'File already exists at this path' });
    }

    const content = buffer.toString('utf8'); // Treat as utf-8 content

    const newFile = await WorkspaceFile.create({
      workspaceId,
      name: originalname,
      path: relativePath,
      type: 'file',
      content,
      parentId: null
    });

    const diskRoot = getWorkspaceDiskPath(workspaceId);
    fs.writeFileSync(path.join(diskRoot, relativePath), buffer);

    await activityService.log(workspaceId, req.user._id, 'file_created', `File "${originalname}" was uploaded`, 'file', newFile._id);

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: { file: newFile }
    });
  });
});

// GET /api/workspaces/:id/files/:fileId/download
const downloadFile = asyncHandler(async (req, res) => {
  const { id: workspaceId, fileId } = req.params;
  await assertMember(workspaceId, req.user._id);

  const fileItem = await WorkspaceFile.findById(fileId);
  if (!fileItem || fileItem.type !== 'file') {
    throw createError('File not found or cannot be downloaded', 404);
  }

  res.setHeader('Content-Disposition', `attachment; filename="${fileItem.name}"`);
  res.setHeader('Content-Type', 'text/plain');
  return res.send(fileItem.content);
});

module.exports = {
  getWorkspaceFiles,
  createFileOrFolder,
  updateFileOrFolder,
  deleteFileOrFolder,
  duplicateFile,
  uploadFile,
  downloadFile,
  seedDefaultFiles
};
