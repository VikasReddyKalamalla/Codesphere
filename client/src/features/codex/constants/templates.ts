import { WorkspaceMember, GitCommit } from '../types/codex';

export const INITIAL_COLLABORATORS: WorkspaceMember[] = [
  {
    userId: 'u_user',
    fullName: 'You',
    avatar: '',
    role: 'owner',
    isOnline: true,
    color: '#04AA6D',
  }
];

export const INITIAL_GIT_COMMITS: GitCommit[] = [];
