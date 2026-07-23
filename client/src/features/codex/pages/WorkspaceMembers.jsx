import React from 'react';
import { WorkspaceMembers as MembersList } from '../components/WorkspaceMembers.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const WorkspaceMembersPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/codex" className="self-start" />
      <MembersList list={[]} />
    </div>
  );
};
