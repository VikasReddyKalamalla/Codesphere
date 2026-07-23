import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { FileText, Download } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const ResourceCard = ({ resource = {} }) => {
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 border border-indigo-100 dark:border-indigo-900/50 rounded-xl shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-1">{resource.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{resource.size} &bull; {resource.type}</p>
          </div>
        </div>
        <a href={resource.downloadUrl} download>
          <IconButton icon={Download} variant="secondary" size="md" aria-label="Download resource" />
        </a>
      </CardBody>
    </Card>
  );
};
