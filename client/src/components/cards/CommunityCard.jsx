import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Users } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const CommunityCard = ({ community = {}, onJoin }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#04AA6D]" />
          <h4 className="text-sm font-semibold text-slate-850 dark:text-white">{community.name}</h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{community.description}</p>
        <div className="flex justify-between items-center mt-2 border-t border-slate-100 dark:border-slate-850 pt-3">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{community.members} Members</span>
          <Button variant="primary" size="sm" onClick={onJoin}>Join</Button>
        </div>
      </CardBody>
    </Card>
  );
};
