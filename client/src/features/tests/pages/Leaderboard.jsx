import React from 'react';
import { Leaderboard as LeaderBoardWidget } from '../components/Leaderboard.jsx';
import { RankCard } from '../components/RankCard.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const LeaderboardPage = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <BackButton fallbackPath="/tests" className="self-start" />
      <RankCard rank={4} />
      <LeaderBoardWidget list={[{ name: 'Vikas Reddy', score: 2800 }]} />
    </div>
  );
};
