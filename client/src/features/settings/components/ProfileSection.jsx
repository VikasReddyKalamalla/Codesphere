import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Eye, Upload, Save, Link2, Award, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { selectProfileSettings, saveSettingsSectionThunk, updateSectionState } from '../redux';
import { uploadAvatarAPI } from '@features/profile/services/profileAPI.js';
import { updateUser } from '@features/auth/redux/authSlice.js';

export const ProfileSection = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfileSettings);
  const { user } = useSelector((s) => s.auth);
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading('Uploading avatar...');
    try {
      const res = await uploadAvatarAPI(file);
      const updatedUser = res?.data || res;
      dispatch(updateSectionState({ section: 'profile', data: { avatarUrl: updatedUser.avatar } }));
      dispatch(updateUser({ avatar: updatedUser.avatar }));
      toast.success('Avatar updated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar', { id: loadingToast });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = Object.fromEntries(formData.entries());
    dispatch(saveSettingsSectionThunk('profile', updated));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Profile & Brand Settings
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Customize avatar, portfolio links, resume, skills tags, and public showcase visibility</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
        {/* Cover & Avatar Header */}
        <div className="relative rounded-2xl h-36 bg-gradient-to-r from-emerald-600 to-teal-700 overflow-hidden border border-slate-200 dark:border-slate-800">
          <img src={profile.coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />
          <div className="absolute bottom-3 left-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden shadow-lg bg-slate-800 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-white uppercase">{(user?.fullName || 'U').slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Avatar
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Portfolio URL</label>
            <input
              type="text"
              name="portfolioUrl"
              defaultValue={profile.portfolioUrl}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Resume Link</label>
            <input
              type="text"
              name="resumeUrl"
              defaultValue={profile.resumeUrl}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Public Visibility</label>
            <select
              name="visibility"
              defaultValue={profile.visibility}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
            >
              <option value="public">Public - Visible to everyone on CodeSphere</option>
              <option value="friends">Connections Only - Visible to approved followers</option>
              <option value="private">Private - Only visible to me</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => alert('Opening public profile preview...')}
            className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Preview Public Profile
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
};
