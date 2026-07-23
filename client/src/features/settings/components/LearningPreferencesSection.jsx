import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GraduationCap, Target, Clock, BookOpen, Save } from 'lucide-react';
import { selectLearningSettings, saveSettingsSectionThunk } from '../redux';

export const LearningPreferencesSection = () => {
  const dispatch = useDispatch();
  const learn = useSelector(selectLearningSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      learningGoals: formData.get('learningGoals'),
      dailyStudyTargetMinutes: Number(formData.get('dailyStudyTargetMinutes')),
      weeklyGoalHours: Number(formData.get('weeklyGoalHours')),
      preferredDifficulty: formData.get('preferredDifficulty'),
      preferredStyle: formData.get('preferredStyle'),
    };
    dispatch(saveSettingsSectionThunk('learning', updated));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Learning Preferences & Daily Targets
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Customize daily study targets, preferred learning style, course auto-play, and target tech stack</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Learning Goal</label>
          <input
            type="text"
            name="learningGoals"
            defaultValue={learn.learningGoals}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Study Target (Minutes)</label>
            <input
              type="number"
              name="dailyStudyTargetMinutes"
              defaultValue={learn.dailyStudyTargetMinutes}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Weekly Target (Hours)</label>
            <input
              type="number"
              name="weeklyGoalHours"
              defaultValue={learn.weeklyGoalHours}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Track Difficulty</label>
            <select
              name="preferredDifficulty"
              defaultValue={learn.preferredDifficulty}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="beginner">Beginner Fundamentals</option>
              <option value="intermediate">Intermediate Professional</option>
              <option value="advanced">Advanced Architecture & Deep Tech</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Learning Style</label>
            <select
              name="preferredStyle"
              defaultValue={learn.preferredStyle}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="hands_on">Hands-On Code Sandbox First</option>
              <option value="video">Video Lectures & Workshops</option>
              <option value="text">Interactive Documentation & Articles</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Learning Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
