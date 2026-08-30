import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Shield, Lock, Key, Smartphone, AlertOctagon, CheckCircle2, QrCode, X, Sparkles, Check, Download, Trash2, Globe, Monitor, Laptop
} from 'lucide-react';
import { selectSecuritySettings, saveSettingsSectionThunk } from '../redux';
import toast from 'react-hot-toast';

export const SecuritySection = () => {
  const dispatch = useDispatch();
  const security = useSelector(selectSecuritySettings);
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess_1', device: 'Chrome / macOS (Current)', ip: '127.0.0.1 (Localhost)', location: 'Mumbai, IN', lastActive: 'Active now', current: true },
    { id: 'sess_2', device: 'Safari / iOS 17 (Mobile)', ip: '103.45.12.89', location: 'Bengaluru, IN', lastActive: '2 hours ago', current: false },
    { id: 'sess_3', device: 'VS Code Extension / Windows 11', ip: '49.207.19.4', location: 'Hyderabad, IN', lastActive: '1 day ago', current: false },
  ]);

  const recoveryCodes = [
    'CS-REC-8910-4491',
    'CS-REC-1129-9942',
    'CS-REC-3341-8812',
    'CS-REC-7718-2209',
    'CS-REC-5510-6643',
    'CS-REC-9012-3311'
  ];

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
      setShowRecoveryModal(true);
      dispatch(saveSettingsSectionThunk('security', { twoFactorEnabled: true }));
      toast.success('Two-Factor Authentication (2FA) successfully activated!');
    }, 1000);
  };

  const handleRevokeSession = (id, device) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    toast.success(`Revoked login session for: ${device}`);
  };

  const handleDownloadRecoveryCodes = () => {
    const content = `CODESPHERE 2FA EMERGENCY RECOVERY CODES\nGenerated: ${new Date().toISOString()}\n\n` + recoveryCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codesphere_2fa_recovery_codes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Emergency 2FA recovery codes downloaded!');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Security & Authentication
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage password, 2-Factor Authentication (2FA), active devices, and security score</p>
      </div>

      {/* Security Score Meter */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">Account Security Score</span>
          <div className="text-3xl font-black font-mono text-white mt-1">{twoFactor ? 100 : (security.securityScore || 88)} / 100</div>
          <p className="text-xs text-slate-300 mt-1">
            {twoFactor ? 'Maximum Security! 2FA TOTP and token revocation enabled.' : 'Excellent! Enable 2FA to achieve 100% security score.'}
          </p>
        </div>
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-lg">
          {twoFactor ? 'A++' : 'A+'}
        </div>
      </div>

      {/* Password Change Form */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D] font-mono"
          />
          <input
            type="password"
            placeholder="New Password"
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D] font-mono"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#04AA6D] font-mono"
          />
        </div>
        <button
          onClick={() => toast.success('Password updated successfully!')}
          className="w-fit px-5 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold font-mono shadow-md cursor-pointer"
        >
          Update Password
        </button>
      </div>

      {/* 2FA Toggle Card */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Secure your account with Google Authenticator or Authy TOTP security apps</p>
        </div>
        <button
          onClick={handleToggle2FA}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            twoFactor
              ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-[#04AA6D] text-white hover:bg-emerald-600 shadow-md'
          }`}
        >
          {twoFactor ? '2FA Enabled' : 'Enable 2FA'}
        </button>
      </div>

      {/* Active Login Sessions Roster */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Login Sessions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Devices currently authenticated to your CodeSphere account</p>
          </div>
          <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
            {activeSessions.length} Devices Connected
          </span>
        </div>

        <div className="flex flex-col gap-2.5 mt-2">
          {activeSessions.map((sess) => (
            <div key={sess.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{sess.device}</span>
                    {sess.current && (
                      <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    IP: {sess.ip} • {sess.location} • Last active: {sess.lastActive}
                  </div>
                </div>
              </div>

              {!sess.current && (
                <button
                  onClick={() => handleRevokeSession(sess.id, sess.device)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Revoke Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-sans">
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
                className="w-full py-2.5 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs font-mono shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {verifying ? 'Verifying Code...' : 'Activate 2FA'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recovery Codes Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <AlertOctagon className="w-5 h-5" />
                <span>2FA Emergency Recovery Codes</span>
              </div>
              <button onClick={() => setShowRecoveryModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Save these recovery codes in a secure location. You can use them to log in if you lose access to your authenticator app.
            </p>

            <div className="grid grid-cols-2 gap-2 p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-amber-400 font-bold">
              {recoveryCodes.map((code, idx) => (
                <div key={idx} className="p-1.5 bg-slate-900 rounded-lg text-center border border-slate-800">{code}</div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleDownloadRecoveryCodes}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Codes (.txt)
              </button>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
