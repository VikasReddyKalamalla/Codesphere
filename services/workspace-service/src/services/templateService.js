const fs = require('fs');
const path = require('path');

const ROOT_TEMPLATES_DIR = path.resolve(__dirname, '../../../../templates');
const WORKSPACES_DIR = path.resolve(__dirname, '../../../../workspaces');

/**
 * Copies starter template files into student workspace folder
 */
function copyTemplateFiles(studentId, workspaceId, templateType = 'javascript') {
  const targetDir = path.join(WORKSPACES_DIR, String(studentId), String(workspaceId));
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let templateKey = (templateType || 'javascript').toLowerCase();
  if (templateKey.includes('react')) templateKey = 'react-starter';
  else if (templateKey.includes('fastapi')) templateKey = 'fastapi';
  else if (templateKey.includes('dsa')) templateKey = 'dsa-playground';
  else if (templateKey.includes('python')) templateKey = 'python';
  else if (templateKey.includes('java')) templateKey = 'java';

  const templateSrc = path.join(ROOT_TEMPLATES_DIR, templateKey);

  if (fs.existsSync(templateSrc)) {
    copyRecursive(templateSrc, targetDir);
  } else {
    // Default fallback README
    const defaultReadme = `# Practice Workspace\n\nWelcome to your ${templateType} workspace on CodeSphere!`;
    fs.writeFileSync(path.join(targetDir, 'README.md'), defaultReadme, 'utf-8');
  }

  return targetDir;
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

module.exports = {
  copyTemplateFiles,
  WORKSPACES_DIR
};
