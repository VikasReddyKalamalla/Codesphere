import React from 'react';
import { CategoryFilter } from '@components/filters/CategoryFilter.jsx';
import { DifficultyFilter } from '@components/filters/DifficultyFilter.jsx';

export const LearningFilters = ({ category, onCategoryChange, difficulty, onDifficultyChange, categories = [] }) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <CategoryFilter value={category} onChange={onCategoryChange} options={categories} />
      <DifficultyFilter value={difficulty} onChange={onDifficultyChange} />
    </div>
  );
};
