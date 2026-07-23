import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardHeader } from '@components/common/CardHeader.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Bookmark, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedResources = ({ resources = [] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-850 dark:text-white">
          <Bookmark className="w-4 h-4 text-indigo-505" />
          <span>Bookmarked Resources</span>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {resources.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No bookmarked items. Explore PDF catalogs.</p>
        ) : (
          resources.map((item, idx) => (
            <Link key={idx} to={`/resources/${item.id}`} className="flex items-center gap-2.5 hover:opacity-85 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))
        )}
      </CardBody>
    </Card>
  );
};
