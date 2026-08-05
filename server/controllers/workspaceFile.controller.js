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
  <title>Codesphere Live Collaborative App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-950 text-white flex items-center justify-center min-h-screen font-sans">
  <div class="max-w-md w-full bg-slate-900 border border-purple-500/20 rounded-2xl p-8 shadow-2xl text-center space-y-6">
    <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
      <span class="text-2xl font-bold">CS</span>
    </div>
    <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Codex Playpen</h1>
    <p class="text-slate-400 text-sm">Welcome to your real-time collaborative coding space. Edit code to see live hot-reloading preview updates instantly!</p>
    <div class="p-4 bg-slate-950/50 rounded-xl border border-purple-500/10">
      <p id="time-message" class="text-purple-300 font-mono text-xs">Loading script...</p>
    </div>
    <button onclick="changeColor()" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 transition-all rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95">Interactive Button</button>
  </div>
  <script src="main.js"></script>
</body>
</html>`
    },
    {
      name: 'styles.css',
      path: 'styles.css',
      type: 'file',
      content: `/* Clean modern reset styling */
body {
  margin: 0;
  padding: 0;
  transition: background-color 0.3s ease;
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
      content: `console.log("Welcome to CodeSphere Collaborative App execution!");

const timeEl = document.getElementById("time-message");
if (timeEl) {
  timeEl.innerText = "Loaded successfully at " + new Date().toLocaleTimeString();
}

function changeColor() {
  const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
  document.body.style.backgroundColor = randomColor;
  console.log("Changed background color to: " + randomColor);
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

  const newFile = await WorkspaceFile.create({
    workspaceId,
    name,
    path: filePath,
    type,
    content: type === 'file' ? content : '',
    parentId: parentId || null
  });

  const diskRoot = getWorkspaceDiskPath(workspaceId);
  const targetDiskPath = path.join(diskRoot, filePath);

  if (type === 'folder') {
    fs.mkdirSync(targetDiskPath, { recursive: true });
  } else {
    // Ensure parent dir exists physically
    fs.mkdirSync(path.dirname(targetDiskPath), { recursive: true });
    fs.writeFileSync(targetDiskPath, content, 'utf8');
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
