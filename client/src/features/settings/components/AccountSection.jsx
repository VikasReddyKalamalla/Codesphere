import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Save, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap } from 'lucide-react';
import { selectAccountSettings, saveSettingsSectionThunk } from '../redux';

export const AccountSection = () => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccountSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = Object.fromEntries(formData.entries());
    dispatch(saveSettingsSectionThunk('account', updated));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Account Settings
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Update your core personal information, contact info, and regional location</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              defaultValue={account.fullName}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Username</label>
            <input
              type="text"
              name="username"
              defaultValue={account.username}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              name="email"
              defaultValue={account.email}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
            <input
              type="text"
              name="phone"
              defaultValue={account.phone}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Professional Headline</label>
            <input
              type="text"
              name="headline"
              defaultValue={account.headline}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Occupation / Role</label>
            <input
              type="text"
              name="occupation"
              defaultValue={account.occupation}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={account.bio}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={account.location}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Timezone</label>
            <input
              type="text"
              name="timezone"
              defaultValue={account.timezone}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Account Changes
          </button>
        </div>
      </form>
    </div>
  );
};
