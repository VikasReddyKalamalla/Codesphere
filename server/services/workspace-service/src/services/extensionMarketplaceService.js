const APPROVED_EXTENSIONS = [
  {
    extensionId: 'esbenp.prettier-vscode',
    name: 'Prettier - Code formatter',
    description: 'Code formatter using Prettier',
    category: 'Formatting',
    installedByDefault: true
  },
  {
    extensionId: 'dbaeumer.vscode-eslint',
    name: 'ESLint',
    description: 'Integrates ESLint JavaScript into VS Code',
    category: 'Linters',
    installedByDefault: true
  },
  {
    extensionId: 'ms-python.python',
    name: 'Python Extension',
    description: 'Rich support for Python with Pyright LSP',
    category: 'Languages',
    installedByDefault: false
  },
  {
    extensionId: 'redhat.java',
    name: 'Language Support for Java',
    description: 'Java Linting, Intellisense & Formatting',
    category: 'Languages',
    installedByDefault: false
  },
  {
    extensionId: 'ms-vscode.cpptools',
    name: 'C/C++ Intellisense',
    description: 'C/C++ debugging and clangd support',
    category: 'Languages',
    installedByDefault: false
  },
  {
    extensionId: 'pkief.material-icon-theme',
    name: 'Material Icon Theme',
    description: 'Material Design Icons for VS Code',
    category: 'Themes',
    installedByDefault: true
  },
  {
    extensionId: 'eamodio.gitlens',
    name: 'GitLens — Git supercharged',
    description: 'Visualize code authorship at a glance',
    category: 'Git',
    installedByDefault: false
  }
];

function getApprovedExtensions() {
  return APPROVED_EXTENSIONS;
}

module.exports = {
  getApprovedExtensions
};
