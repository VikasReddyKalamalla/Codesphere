import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Play, Code2 } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const SandboxCard = ({ sandbox = {}, onRun }) => {
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 rounded-xl border border-emerald-150 dark:border-emerald-900/50">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1">{sandbox.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{sandbox.language} &bull; {sandbox.updatedAt}</p>
          </div>
        </div>
        <IconButton icon={Play} variant="success" size="md" onClick={onRun} aria-label="Launch sandbox playpen" />
      </CardBody>
    </Card>
  );
};
