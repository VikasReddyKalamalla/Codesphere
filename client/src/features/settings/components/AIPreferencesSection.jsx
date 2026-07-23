import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, Bot, Save } from 'lucide-react';
import { selectAISettings, saveSettingsSectionThunk } from '../redux';

export const AIPreferencesSection = () => {
  const dispatch = useDispatch();
  const ai = useSelector(selectAISettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      aiPersonality: formData.get('aiPersonality'),
      responseStyle: formData.get('responseStyle'),
      creativityLevel: Number(formData.get('creativityLevel')),
      dailyLimitCredits: Number(formData.get('dailyLimitCredits')),
    };
    dispatch(saveSettingsSectionThunk('ai', updated));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> AI Mentor & Assistant Preferences
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Configure AI personality, response style, creativity temperature, and automated code reviews</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Personality Persona</label>
            <select
              name="aiPersonality"
              defaultValue={ai.aiPersonality}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="expert_architect">Expert System Architect & Senior Tech Lead</option>
              <option value="strict_mentor">Strict Mentor (Focus on Clean Code & Testing)</option>
              <option value="encouraging">Encouraging Tutor (Beginner Friendly)</option>
              <option value="concise">Concise & Direct (No Fluff)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Response Style Format</label>
            <select
              name="responseStyle"
              defaultValue={ai.responseStyle}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="code_first">Code-First with Inline Explanations</option>
              <option value="detailed">Detailed Step-by-Step Architectural Guide</option>
              <option value="bullet_points">Bullet Points Summary</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Creativity Temperature (0.0 - 1.0)</label>
            <input
              type="number"
              step="0.1"
              name="creativityLevel"
              defaultValue={ai.creativityLevel}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily AI Credits Limit</label>
            <input
              type="number"
              name="dailyLimitCredits"
              defaultValue={ai.dailyLimitCredits}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save AI Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
