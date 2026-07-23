import React from 'react';
import { Avatar } from '@components/common/Avatar.jsx';

export const FollowingList = ({ list = [] }) => {
  return (
    <div className="flex flex-col gap-3">
      {list.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">Not following anyone yet.</p>
      ) : (
        list.map((u, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <Avatar src={u.avatar} size="sm" />
            <span className="text-xs text-slate-705 dark:text-slate-205 font-bold">{u.name}</span>
          </div>
        ))
      )}
    </div>
  );
};
