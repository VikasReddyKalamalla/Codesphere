import React, { useState, useEffect, useRef } from 'react';
import { ActivityTab } from './ActivityBar';

interface MenuBarProps {
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenFolder?: () => void;
  onCloneRepo?: () => void;
  onSaveFile: () => void;
  onCloseActiveFile: () => void;
  onClearWorkspace: () => void;
  onRunCode: () => void;
  onToggleTerminal: () => void;
  onOpenQuickOpen: () => void;
  onToggleWordWrap: () => void;
  onFormatDocument: () => void;
  onTriggerMonacoAction: (actionId: string) => void;
  onOpenWelcome: () => void;
  onSelectActivityTab?: (tab: ActivityTab) => void;
  onOpenShortcuts?: () => void;
  isDark: boolean;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNewFile,
  onNewFolder,
  onOpenFolder,
  onCloneRepo,
  onSaveFile,
  onCloseActiveFile,
  onClearWorkspace,
  onRunCode,
  onToggleTerminal,
  onOpenQuickOpen,
  onToggleWordWrap,
  onFormatDocument,
  onTriggerMonacoAction,
  onOpenWelcome,
  onSelectActivityTab,
  onOpenShortcuts,
  isDark,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus = [
    {
      name: 'File',
      items: [
        { label: 'New File', shortcut: 'Ctrl+Alt+N', action: onNewFile },
        { label: 'New Folder', action: onNewFolder },
        { separator: true },
        ...(onOpenFolder ? [{ label: 'Open Folder...', shortcut: 'Ctrl+O', action: onOpenFolder }] : []),
        ...(onCloneRepo ? [{ label: 'Clone Repository...', action: onCloneRepo }] : []),
        { separator: true },
        { label: 'Save', shortcut: 'Ctrl+S', action: onSaveFile },
        { label: 'Close Tab', shortcut: 'Ctrl+W', action: onCloseActiveFile },
        { separator: true },
        { label: 'Clear Workspace', action: onClearWorkspace, danger: true },
      ],
    },
    {
      name: 'Edit',
      items: [
        {
          label: 'Undo',
          shortcut: 'Ctrl+Z',
          action: () => onTriggerMonacoAction('undo'),
        },
        {
          label: 'Redo',
          shortcut: 'Ctrl+Y',
          action: () => onTriggerMonacoAction('redo'),
        },
        { separator: true },
        {
          label: 'Find',
          shortcut: 'Ctrl+F',
          action: () => onTriggerMonacoAction('actions.find'),
        },
        {
          label: 'Replace',
          shortcut: 'Ctrl+H',
          action: () => onTriggerMonacoAction('editor.action.startFindReplaceAction'),
        },
        { separator: true },
        {
          label: 'Format Document',
          shortcut: 'Shift+Alt+F',
          action: onFormatDocument,
        },
      ],
    },
    {
      name: 'Selection',
      items: [
        {
          label: 'Select All',
          shortcut: 'Ctrl+A',
          action: () => onTriggerMonacoAction('editor.action.selectAll'),
        },
        {
          label: 'Expand Selection',
          shortcut: 'Shift+Alt+Right',
          action: () => onTriggerMonacoAction('editor.action.smartSelect.expand'),
        },
        {
          label: 'Shrink Selection',
          shortcut: 'Shift+Alt+Left',
          action: () => onTriggerMonacoAction('editor.action.smartSelect.shrink'),
        },
        {
          label: 'Copy Line Down',
          shortcut: 'Shift+Alt+Down',
          action: () => onTriggerMonacoAction('editor.action.copyLinesDownAction'),
        },
      ],
    },
    {
      name: 'View',
      items: [
        { label: 'Command Palette...', shortcut: 'Ctrl+P', action: onOpenQuickOpen },
        { label: 'Toggle Terminal', shortcut: 'Ctrl+`', action: onToggleTerminal },
        { label: 'Toggle Word Wrap', shortcut: 'Alt+Z', action: onToggleWordWrap },
        { separator: true },
        {
          label: 'Codex AI Copilot',
          shortcut: 'Ctrl+Shift+I',
          action: () => onSelectActivityTab?.('copilot'),
        },
        {
          label: 'REST API Tester',
          shortcut: 'Ctrl+Shift+A',
          action: () => onSelectActivityTab?.('api'),
        },
        {
          label: 'Sprint Kanban Board',
          shortcut: 'Ctrl+Shift+K',
          action: () => onSelectActivityTab?.('kanban'),
        },
        {
          label: 'Google Meet & Live Call',
          shortcut: 'Ctrl+Shift+V',
          action: () => onSelectActivityTab?.('voice'),
        },
        { separator: true },
        {
          label: 'Explorer',
          shortcut: 'Ctrl+Shift+E',
          action: () => onSelectActivityTab?.('explorer'),
        },
        {
          label: 'Search',
          shortcut: 'Ctrl+Shift+F',
          action: () => onSelectActivityTab?.('search'),
        },
        {
          label: 'Source Control (Git)',
          shortcut: 'Ctrl+Shift+G',
          action: () => onSelectActivityTab?.('git'),
        },
        {
          label: 'Run and Debug',
          shortcut: 'Ctrl+Shift+D',
          action: () => onSelectActivityTab?.('debug'),
        },
        {
          label: 'Extensions',
          shortcut: 'Ctrl+Shift+X',
          action: () => onSelectActivityTab?.('extensions'),
        },
      ],
    },
    {
      name: 'Go',
      items: [
        { label: 'Go to File...', shortcut: 'Ctrl+P', action: onOpenQuickOpen },
        {
          label: 'Go to Line...',
          shortcut: 'Ctrl+G',
          action: () => onTriggerMonacoAction('editor.action.gotoLine'),
        },
      ],
    },
    {
      name: 'Run',
      items: [
        { label: 'Run Active Code', shortcut: 'Ctrl+Enter', action: onRunCode },
        {
          label: 'Run in Terminal',
          action: () => {
            onToggleTerminal();
            onRunCode();
          },
        },
        {
          label: 'Open Debug Console',
          shortcut: 'Ctrl+Shift+Y',
          action: () => onSelectActivityTab?.('debug'),
        },
      ],
    },
    {
      name: 'Terminal',
      items: [
        { label: 'Toggle Terminal', shortcut: 'Ctrl+`', action: onToggleTerminal },
        {
          label: 'Run Code in Terminal',
          shortcut: 'Ctrl+Enter',
          action: () => {
            onToggleTerminal();
            onRunCode();
          },
        },
      ],
    },
    {
      name: 'Help',
      items: [
        { label: 'Welcome / Getting Started', action: onOpenWelcome },
        { separator: true },
        {
          label: 'Keyboard Shortcuts Reference',
          shortcut: 'Ctrl+Shift+?',
          action: onOpenShortcuts || onOpenWelcome,
        },
        {
          label: 'About CodeSphere Codex',
          action: onOpenWelcome,
        },
      ],
    },
  ];

  return (
    <div ref={menuRef} className="flex items-center text-[12px] font-sans select-none relative">
      {menus.map((menu) => {
        const isOpen = openMenu === menu.name;
        return (
          <div key={menu.name} className="relative">
            <button
              onClick={() => setOpenMenu(isOpen ? null : menu.name)}
              onMouseEnter={() => {
                if (openMenu !== null) setOpenMenu(menu.name);
              }}
              className={`px-2 py-0.5 rounded transition cursor-pointer text-inherit ${
                isOpen
                  ? isDark
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-slate-900'
                  : isDark
                  ? 'hover:bg-slate-800/80 hover:text-white text-slate-300'
                  : 'hover:bg-slate-100 hover:text-slate-900 text-slate-700'
              }`}
            >
              {menu.name}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className={`absolute left-0 top-full mt-0.5 w-60 rounded-xl border shadow-xl py-1 z-50 text-[12px] ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                {menu.items.map((item, idx) => {
                  if (item.separator) {
                    return (
                      <div
                        key={idx}
                        className={`my-1 border-t ${
                          isDark ? 'border-slate-800' : 'border-slate-100'
                        }`}
                      />
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action?.();
                        setOpenMenu(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition cursor-pointer ${
                        item.danger
                          ? 'hover:bg-[#ef4444]/20 text-[#ef4444]'
                          : isDark
                          ? 'hover:bg-[#04AA6D]/20 hover:text-[#04AA6D]'
                          : 'hover:bg-[#04AA6D]/15 hover:text-[#04AA6D]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-[10px] font-mono opacity-60 ml-3">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
