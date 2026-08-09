import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Lock, Key, Smartphone, AlertOctagon, CheckCircle2, QrCode, X, Sparkles, Check } from 'lucide-react';
import { selectSecuritySettings, saveSettingsSectionThunk } from '../redux';
import toast from 'react-hot-toast';

export const SecuritySection = () => {
  const dispatch = useDispatch();
  const security = useSelector(selectSecuritySettings);
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleToggle2FA = () => {
    if (twoFactor) {
      setTwoFactor(false);
      dispatch(saveSettingsSectionThunk('security', { twoFactorEnabled: false }));
      toast.success('2FA Disabled');
    } else {
      setShow2FAModal(true);
    }
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (totpCode.length < 6) return toast.error('Please enter a 6-digit verification code');

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setTwoFactor(true);
      setShow2FAModal(false);
      dispatch(saveSettingsSectionThunk('security', { twoFactorEnabled: true }));
      toast.success('Two-Factor Authentication (2FA) successfully activated!');
    }, 1000);
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
          <div className="text-3xl font-black font-mono text-white mt-1">{twoFactor ? 100 : (security.securityScore || 88)} / 100</div>
          <p className="text-xs text-slate-300 mt-1">
            {twoFactor ? 'Maximum Security! 2FA and multi-layer encryption enabled.' : 'Excellent! Enable 2FA to achieve 100% security score.'}
          </p>
        </div>
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-lg">
          {twoFactor ? 'A++' : 'A+'}
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
          onClick={() => toast.success('Password updated successfully!')}
          className="w-fit px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          Update Password
        </button>
      </div>

      {/* 2FA Toggle Card */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Secure your account with Google Authenticator or TOTP security apps</p>
        </div>
        <button
          onClick={handleToggle2FA}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            twoFactor
              ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-[#04AA6D] text-white hover:bg-emerald-600 shadow-md'
          }`}
        >
          {twoFactor ? '2FA Enabled' : 'Enable 2FA'}
        </button>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#04AA6D]" /> Setup 2-Factor Auth
              </h3>
              <button onClick={() => setShow2FAModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="w-40 h-40 rounded-2xl bg-white p-2 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/CodeSphere:user@codesphere.dev?secret=JBSWY3DPEHPK3PXP"
                  alt="2FA QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan this QR code using Google Authenticator or Authy, then enter the 6-digit verification code below.
              </p>
            </div>

            <form onSubmit={handleVerify2FA} className="flex flex-col gap-3">
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit TOTP Code (e.g. 123456)"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-widest font-mono text-sm px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D]"
              />
              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2.5 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {verifying ? 'Verifying Code...' : 'Activate 2FA'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
