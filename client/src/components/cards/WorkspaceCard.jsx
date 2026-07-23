import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { FolderGit2 } from 'lucide-react';
import { Avatar } from '../common/Avatar.jsx';

export const WorkspaceCard = ({ workspace = {} }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/50">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{workspace.language}</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1">{workspace.name}</h4>
          <p className="text-xs text-slate-505 dark:text-slate-400 mt-0.5 line-clamp-1">{workspace.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2 border-t border-slate-100 dark:border-slate-855 pt-3">
          <div className="flex items-center -space-x-2">
            {(workspace.collaborators || []).slice(0, 3).map((col, idx) => (
              <Avatar key={idx} src={col.avatar} alt={col.name} size="xs" />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">Owner: {workspace.owner}</span>
        </div>
      </CardBody>
    </Card>
  );
};
