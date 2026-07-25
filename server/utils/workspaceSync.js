const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const SandboxProgress = require('../models/SandboxProgress');
const SandboxProject = require('../models/SandboxProject');

const getWorkspacePath = (projectId, userId) => {
  return path.join(__dirname, '..', 'uploads', 'workspaces', `${projectId}_${userId}`);
};

/**
 * Generate project-specific starter code files based on project title, category, and tech stack.
 */
const getProjectStarterFiles = (project) => {
  if (!project) return { 'index.html': '', 'styles.css': '', 'script.js': '' };
  const title = (project.title || '').toLowerCase();
  const stack = (project.technologyStack || []).map(x => x.toLowerCase());

  if (title.includes('rest api') || title.includes('node') || title.includes('express') || stack.includes('node.js')) {
    return {
      'server.js': `const express = require('express');\nconst mongoose = require('mongoose');\nrequire('dotenv').config();\n\nconst app = express();\napp.use(express.json());\n\n// Connect to MongoDB\nmongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapi')\n  .then(() => console.log('MongoDB connected'))\n  .catch(err => console.error(err));\n\n// Basic health route\napp.get('/health', (req, res) => res.json({ status: 'ok', service: '${project.title}' }));\n\n// Routes\napp.use('/api/auth', require('./routes/auth'));\n\nconst PORT = process.env.PORT || 5000;\napp.listen(PORT, () => console.log('Server running on port ' + PORT));\n`,
      '.env': `PORT=5000\nMONGO_URI=mongodb://localhost:27017/myapi\nJWT_SECRET=your_secret_key\nJWT_EXPIRES_IN=7d\n`,
      'routes/auth.js': `const express = require('express');\nconst router = express.Router();\n\n// POST /api/auth/register\nrouter.post('/register', async (req, res) => {\n  const { name, email, password } = req.body;\n  res.status(201).json({ message: 'User registered successfully', user: { name, email } });\n});\n\n// POST /api/auth/login\nrouter.post('/login', async (req, res) => {\n  const { email, password } = req.body;\n  res.json({ token: 'mock-jwt-token-xyz', user: { email } });\n});\n\nmodule.exports = router;\n`,
      'package.json': `{\n  "name": "node-express-api",\n  "version": "1.0.0",\n  "main": "server.js",\n  "dependencies": {\n    "express": "^4.18.2",\n    "mongoose": "^7.5.0",\n    "dotenv": "^16.3.1",\n    "jsonwebtoken": "^9.0.2",\n    "bcryptjs": "^2.4.3"\n  }\n}\n`
    };
  }

  if (title.includes('react') || title.includes('dashboard') || title.includes('chart') || stack.includes('react')) {
    return {
      'App.jsx': `import React from 'react';\nimport Dashboard from './components/Dashboard';\nimport './index.css';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-900 text-white font-sans">\n      <Dashboard />\n    </div>\n  );\n}\n`,
      'components/Dashboard.jsx': `import React from 'react';\nimport StatCard from './StatCard';\n\nconst stats = [\n  { label: 'Total Sales',  value: '$42,500', trend: '+12%' },\n  { label: 'New Users',    value: '1,284',   trend: '+8%'  },\n  { label: 'Revenue',      value: '$18,900', trend: '+5%'  },\n  { label: 'Orders',       value: '326',     trend: '-2%'  },\n];\n\nexport default function Dashboard() {\n  return (\n    <div className="p-6 max-w-6xl mx-auto">\n      <h1 className="text-2xl font-bold mb-6 text-emerald-400">Analytics Dashboard</h1>\n      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">\n        {stats.map(s => <StatCard key={s.label} {...s} />)}\n      </div>\n    </div>\n  );\n}\n`,
      'components/StatCard.jsx': `import React from 'react';\n\nexport default function StatCard({ label, value, trend }) {\n  const isPos = trend.startsWith('+');\n  return (\n    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">\n      <p className="text-xs text-slate-400 font-mono uppercase">{label}</p>\n      <p className="text-2xl font-black text-white mt-1">{value}</p>\n      <p className={\`text-xs font-bold mt-2 \${isPos ? 'text-emerald-400' : 'text-rose-400'}\`}>{trend}</p>\n    </div>\n  );\n}\n`,
      'index.css': `@import "tailwindcss";\nbody { margin: 0; background: #0B0F17; color: #e2e8f0; }\n`,
      'package.json': `{\n  "name": "react-dashboard",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "lucide-react": "^0.263.1"\n  }\n}\n`
    };
  }

  if (title.includes('python') || title.includes('pandas') || title.includes('data') || stack.includes('python')) {
    return {
      'pipeline.py': `import pandas as pd\nimport numpy as np\n\ndef run_pipeline():\n    print("Step 1: Ingesting dataset...")\n    data = {\n        'product': ['Laptop', 'Headphones', 'Keyboard', 'Mouse', 'Monitor'],\n        'category': ['Electronics', 'Accessories', 'Accessories', 'Accessories', 'Electronics'],\n        'price': [999, 199, 79, 49, 299],\n        'sales': [45, 120, 85, 210, 60]\n    }\n    df = pd.DataFrame(data)\n    print("Shape:", df.shape)\n    print(df.head())\n\n    print("\\nStep 2: Processing totals...")\n    df['total_revenue'] = df['price'] * df['sales']\n    print(df[['product', 'total_revenue']])\n\n    print("\\nStep 3: Aggregating by category...")\n    category_summary = df.groupby('category')['total_revenue'].sum()\n    print(category_summary)\n    print("\\nData Pipeline Execution Completed Successfully!")\n\nif __name__ == '__main__':\n    run_pipeline()\n`,
      'requirements.txt': `pandas>=2.0.0\nnumpy>=1.24.0\nmatplotlib>=3.7.0\n`,
      'README.md': `# ${project.title}\n\nRun the data cleaning and analytics pipeline:\n\`\`\`bash\npython pipeline.py\n\`\`\`\n`
    };
  }

  // E-Commerce Cart default
  return {
    'index.html': `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${project.title}</title>\n  <link rel="stylesheet" href="styles.css"/>\n</head>\n<body>\n  <div id="app">\n    <h1>${project.title}</h1>\n    <div id="cart"></div>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>\n`,
    'styles.css': `body {\n  font-family: system-ui, sans-serif;\n  background: #0B0F17;\n  color: #E2E8F0;\n  padding: 2rem;\n}\n.cart-item {\n  display: flex;\n  justify-content: space-between;\n  padding: 1rem;\n  border-bottom: 1px solid #1E293B;\n}\n`,
    'script.js': `// Dynamic Cart Script\nconst cart = [\n  { id: 'laptop', name: 'Laptop', price: 999, quantity: 2 },\n  { id: 'headphones', name: 'Headphones', price: 199, quantity: 1 },\n  { id: 'keyboard', name: 'Keyboard', price: 79, quantity: 1 }\n];\n\nfunction calculateTotal() {\n  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n}\n\nconsole.log("Cart Total: $" + calculateTotal());\n`
  };
};

// ─── Extension recommendation map ────────────────────────────────────────────
// Maps detected tech stack / title keywords → VS Code extension IDs.
// Only well-known, stable extensions are listed — nothing experimental.
const EXTENSION_MAP = [
  // JavaScript / TypeScript (always included as a baseline)
  {
    match: () => true,
    extensions: [
      'dbaeumer.vscode-eslint',
      'esbenp.prettier-vscode',
      'christian-kohler.path-intellisense',
    ],
  },
  // HTML / CSS / Frontend
  {
    match: (t, s) =>
      t.includes('html') || t.includes('css') || t.includes('frontend') ||
      s.includes('html') || s.includes('css') || s.includes('tailwind') ||
      s.includes('bootstrap') || t.includes('cart') || t.includes('ecommerce'),
    extensions: [
      'formulahendry.auto-rename-tag',
      'bradlc.vscode-tailwindcss',
      'pranaygp.vscode-css-peek',
      'zignd.html-css-class-completion',
      'ecmel.vscode-html-css',
    ],
  },
  // React / JSX
  {
    match: (t, s) =>
      t.includes('react') || t.includes('jsx') || s.includes('react') || s.includes('next'),
    extensions: [
      'dsznajder.es7-react-js-snippets',
      'styled-components.vscode-styled-components',
    ],
  },
  // Node.js / Express / REST API
  {
    match: (t, s) =>
      t.includes('node') || t.includes('express') || t.includes('rest api') ||
      s.includes('node.js') || s.includes('express'),
    extensions: [
      'mongodb.mongodb-vscode',
      'humao.rest-client',
      'mikestead.dotenv',
    ],
  },
  // Python
  {
    match: (t, s) =>
      t.includes('python') || t.includes('pandas') || t.includes('data') ||
      s.includes('python') || s.includes('flask') || s.includes('django'),
    extensions: [
      'ms-python.python',
      'ms-python.vscode-pylance',
      'ms-toolsai.jupyter',
      'njpwerner.autodocstring',
    ],
  },
  // TypeScript
  {
    match: (t, s) =>
      t.includes('typescript') || s.includes('typescript') || s.includes('ts'),
    extensions: [
      'ms-vscode.vscode-typescript-next',
    ],
  },
  // Go
  {
    match: (t, s) => t.includes('go') || s.includes('go') || s.includes('golang'),
    extensions: ['golang.go'],
  },
  // Rust
  {
    match: (t, s) => t.includes('rust') || s.includes('rust'),
    extensions: ['rust-lang.rust-analyzer'],
  },
  // Java
  {
    match: (t, s) => t.includes('java') || s.includes('java') || s.includes('spring'),
    extensions: [
      'redhat.java',
      'vscjava.vscode-java-debug',
      'vscjava.vscode-maven',
    ],
  },
  // Docker / DevOps
  {
    match: (t, s) =>
      t.includes('docker') || t.includes('devops') || s.includes('docker') ||
      s.includes('kubernetes') || s.includes('ci/cd'),
    extensions: [
      'ms-azuretools.vscode-docker',
      'redhat.vscode-yaml',
    ],
  },
  // SQL / Database
  {
    match: (t, s) =>
      t.includes('sql') || t.includes('database') || s.includes('sql') ||
      s.includes('postgresql') || s.includes('mysql'),
    extensions: [
      'mtxr.sqltools',
      'formulahendry.code-runner',
    ],
  },
  // Markdown / docs
  {
    match: (t, s) => t.includes('markdown') || t.includes('docs') || s.includes('markdown'),
    extensions: [
      'yzhang.markdown-all-in-one',
      'davidanson.vscode-markdownlint',
    ],
  },
];

/**
 * Returns a deduplicated list of VS Code extension IDs recommended for a project.
 * @param {object} project  Mongoose SandboxProject document
 * @returns {string[]}      Array of extension IDs
 */
const getExtensionsForProject = (project) => {
  if (!project) return [];

  const title = (project.title || '').toLowerCase();
  const stack = (project.technologyStack || []).map(x => x.toLowerCase());
  const category = (project.category || '').toLowerCase();

  const ids = new Set();

  for (const rule of EXTENSION_MAP) {
    if (rule.match(title + ' ' + category, stack)) {
      rule.extensions.forEach(id => ids.add(id));
    }
  }

  return Array.from(ids);
};

/**
 * Returns a basic VS Code launch.json configuration for the given project's stack.
 * Returns null for stacks where a generic launch config would add no value.
 * @param {object|null} project
 * @returns {object|null}
 */
const buildLaunchConfig = (project) => {
  if (!project) return null;

  const title = (project.title || '').toLowerCase();
  const stack = (project.technologyStack || []).map(x => x.toLowerCase());

  // Node.js / Express
  if (title.includes('node') || title.includes('express') || title.includes('rest api') || stack.includes('node.js')) {
    return {
      version: '0.2.0',
      configurations: [
        {
          type: 'node',
          request: 'launch',
          name: 'Start Server',
          program: '${workspaceFolder}/server.js',
          envFile: '${workspaceFolder}/.env',
          console: 'integratedTerminal',
          restart: true,
          runtimeArgs: ['--inspect'],
          skipFiles: ['<node_internals>/**']
        }
      ]
    };
  }

  // Python
  if (title.includes('python') || title.includes('pandas') || title.includes('data') || stack.includes('python')) {
    return {
      version: '0.2.0',
      configurations: [
        {
          type: 'debugpy',
          request: 'launch',
          name: 'Run Pipeline',
          program: '${workspaceFolder}/pipeline.py',
          console: 'integratedTerminal',
          justMyCode: true
        }
      ]
    };
  }

  // Generic JS (HTML/CSS/JS projects — open with simple node or browser)
  return {
    version: '0.2.0',
    configurations: [
      {
        type: 'chrome',
        request: 'launch',
        name: 'Open in Browser',
        file: '${workspaceFolder}/index.html'
      }
    ]
  };
};

/**
 * Write files from DB progress to disk.
 */
const syncDbToDisk = async (projectId, userId) => {
  const workspacePath = getWorkspacePath(projectId, userId);
  const existsOnDisk = fs.existsSync(workspacePath);

  await fsPromises.mkdir(workspacePath, { recursive: true });

  // If workspace folder exists and has files, sync disk -> DB first so user disk edits aren't lost!
  if (existsOnDisk) {
    try {
      const existingEntries = await fsPromises.readdir(workspacePath);
      const nonSettingsFiles = existingEntries.filter(e => e !== '.vscode' && e !== 'node_modules' && e !== '.git');
      if (nonSettingsFiles.length > 0) {
        await syncDiskToDb(projectId, userId);
      }
    } catch (e) {
      console.warn('Pre-sync disk to DB warning:', e.message);
    }
  }

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

  let codeFiles = progress.codeFiles;
  if (!codeFiles || Object.keys(codeFiles).length === 0) {
    const project = await SandboxProject.findById(projectId);
    codeFiles = getProjectStarterFiles(project);
    progress.codeFiles = codeFiles;
    progress.markModified('codeFiles');
    await progress.save();
  }

  // Write files to disk
  for (const [filepath, content] of Object.entries(codeFiles || {})) {
    if (typeof content !== 'string') continue;
    const fullPath = path.join(workspacePath, filepath);
    await fsPromises.mkdir(path.dirname(fullPath), { recursive: true });
    await fsPromises.writeFile(fullPath, content, 'utf8');
  }

  // Write VS Code workspace config files (.vscode/)
  const settingsDir = path.join(workspacePath, '.vscode');
  await fsPromises.mkdir(settingsDir, { recursive: true });

  // settings.json — editor appearance tuned for CodeSphere dark theme
  const settingsContent = {
    "workbench.colorTheme": "Default Dark Modern",
    "editor.fontSize": 13,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.wordWrap": "on",
    "editor.minimap.enabled": false,
    "editor.smoothScrolling": true,
    "editor.cursorBlinking": "smooth",
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": true,
    "workbench.colorCustomizations": {
      "editor.background": "#0B0F17",
      "editor.foreground": "#e2e8f0",
      "sideBar.background": "#0d1117",
      "sideBarSectionHeader.background": "#0d1117",
      "activityBar.background": "#0d1117",
      "activityBar.foreground": "#04AA6D",
      "activityBar.inactiveForeground": "#64748b",
      "titleBar.activeBackground": "#0B0F17",
      "titleBar.activeForeground": "#e2e8f0",
      "statusBar.background": "#04AA6D",
      "statusBar.foreground": "#ffffff",
      "terminal.background": "#0B0F17",
      "terminal.foreground": "#e2e8f0",
      "editorGroupHeader.tabsBackground": "#0d1117",
      "tab.activeBackground": "#0B0F17",
      "tab.inactiveBackground": "#0d1117",
      "tab.activeForeground": "#04AA6D",
      "editorCursor.foreground": "#04AA6D"
    },
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 2000,
    "terminal.integrated.fontSize": 12,
    "terminal.integrated.defaultProfile.linux": "bash",
    "explorer.confirmDelete": false
  };
  await fsPromises.writeFile(
    path.join(settingsDir, 'settings.json'),
    JSON.stringify(settingsContent, null, 2),
    'utf8'
  );

  // extensions.json — workspace extension recommendations matched to project tech stack
  const projectDoc = await SandboxProject.findById(projectId).lean();
  const recommendedExtensions = getExtensionsForProject(projectDoc);
  const extensionsContent = {
    // Shown in VS Code's "Recommended Extensions" filter
    "recommendations": recommendedExtensions,
    // Empty — no extensions are actively blocked
    "unwantedRecommendations": []
  };
  await fsPromises.writeFile(
    path.join(settingsDir, 'extensions.json'),
    JSON.stringify(extensionsContent, null, 2),
    'utf8'
  );

  // launch.json — basic debug configuration per stack
  const launchContent = buildLaunchConfig(projectDoc);
  if (launchContent) {
    await fsPromises.writeFile(
      path.join(settingsDir, 'launch.json'),
      JSON.stringify(launchContent, null, 2),
      'utf8'
    );
  }

  return workspacePath;
};

/**
 * Read files from disk to DB progress.
 */
const syncDiskToDb = async (projectId, userId) => {
  const workspacePath = getWorkspacePath(projectId, userId);
  if (!fs.existsSync(workspacePath)) return null;

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

  const readDir = async (dir, baseDir = '') => {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true });
    let files = {};
    for (const entry of entries) {
      const relPath = baseDir ? `${baseDir}/${entry.name}` : entry.name;
      const fullPath = path.join(dir, entry.name);

      // Skip special folders
      if (entry.name === '.vscode' || entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.DS_Store') {
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
  if (Object.keys(codeFiles).length > 0) {
    progress.codeFiles = codeFiles;
    progress.markModified('codeFiles');
    await progress.save();
  }
  return progress;
};

module.exports = {
  getWorkspacePath,
  getProjectStarterFiles,
  getExtensionsForProject,
  buildLaunchConfig,
  syncDbToDisk,
  syncDiskToDb
};
