import React, { useState } from 'react';
import { Settings, DollarSign, Bell, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorSettings = () => {
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [payoutDetail, setPayoutDetail] = useState('instructor@upi');
  const [autoMeeting, setAutoMeeting] = useState(true);
  const [notifySubmissions, setNotifySubmissions] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Instructor preferences saved successfully!');
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Instructor Portal Preferences</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure payout withdrawal methods (70% revenue share), live meeting links, and notification alerts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6 max-w-2xl">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Payout Withdrawal Method
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500">Method</label>
              <select 
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1"
              >
                <option value="UPI">UPI ID (India)</option>
                <option value="Stripe">Stripe Connect Account</option>
                <option value="Bank">Direct Bank Wire</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Account / VPA Details</label>
              <input 
                type="text"
                value={payoutDetail}
                onChange={(e) => setPayoutDetail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-500" /> Automation & Notifications
          </h3>
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
            <input 
              type="checkbox" 
              checked={autoMeeting}
              onChange={(e) => setAutoMeeting(e.target.checked)}
              className="rounded text-indigo-600" 
            />
            Auto-generate WebRTC Live Session meeting rooms
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
            <input 
              type="checkbox" 
              checked={notifySubmissions}
              onChange={(e) => setNotifySubmissions(e.target.checked)}
              className="rounded text-indigo-600" 
            />
            Send push notification when students submit assignment solutions
          </label>
        </div>

        <button 
          type="submit"
          className="self-start px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </form>
    </div>
  );
};

export default InstructorSettings;
