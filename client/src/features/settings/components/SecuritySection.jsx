import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Lock, Key, Smartphone, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { selectSecuritySettings, saveSettingsSectionThunk } from '../redux';

export const SecuritySection = () => {
  const dispatch = useDispatch();
  const security = useSelector(selectSecuritySettings);
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled);

  const handleToggle2FA = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    dispatch(saveSettingsSectionThunk('security', { twoFactorEnabled: next }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Security & Authentication
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage password, 2-Factor Authentication (2FA), login alerts, and security score</p>
      </div>

      {/* Security Score Meter */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Account Security Score</span>
          <div className="text-3xl font-black font-mono text-white mt-1">{security.securityScore || 88} / 100</div>
          <p className="text-xs text-slate-300 mt-1">Excellent! Your 2FA and login detection features are active.</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-lg">
          A+
        </div>
      </div>

      {/* Password Change Form */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
          />
          <input
            type="password"
            placeholder="New Password"
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
          />
        </div>
        <button
          onClick={() => alert('Password updated successfully!')}
          className="w-fit px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          Update Password
        </button>
      </div>

      {/* 2FA Toggle Card */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Secure your account with Google Authenticator or SMS security codes</p>
        </div>
        <button
          onClick={handleToggle2FA}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            twoFactor
              ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {twoFactor ? '2FA Enabled' : 'Enable 2FA'}
        </button>
      </div>
    </div>
  );
};
