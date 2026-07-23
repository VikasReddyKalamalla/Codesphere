import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Monitor, Smartphone, Globe, LogOut, ShieldCheck } from 'lucide-react';
import { fetchDevicesThunk, revokeDeviceThunk, revokeAllDevicesThunk, selectDevicesList } from '../redux';

export const DeviceManagementSection = () => {
  const dispatch = useDispatch();
  const devices = useSelector(selectDevicesList);

  useEffect(() => {
    dispatch(fetchDevicesThunk());
  }, [dispatch]);

  const sampleDevices = devices.length > 0 ? devices : [
    { _id: 'dev-1', deviceName: 'Chrome on Windows 11', os: 'Windows 11', browser: 'Chrome 126.0', ipAddress: '127.0.0.1', isCurrent: true, isTrusted: true },
    { _id: 'dev-2', deviceName: 'Safari on macOS Sonoma', os: 'macOS', browser: 'Safari 17.4', ipAddress: '192.168.1.45', isCurrent: false, isTrusted: true },
    { _id: 'dev-3', deviceName: 'CodeSphere App on iOS 17', os: 'iOS 17.5', browser: 'Mobile App', ipAddress: '10.0.0.12', isCurrent: false, isTrusted: true },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Device Management
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">View logged-in hardware devices, browser sessions, and revoke access instantly</p>
        </div>

        <button
          onClick={() => dispatch(revokeAllDevicesThunk())}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Logout All Other Devices
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sampleDevices.map((dev) => (
          <div key={dev._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/20">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{dev.deviceName}</h4>
                  {dev.isCurrent && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30 uppercase">
                      Current Device
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-3 font-mono">
                  <span>OS: {dev.os}</span>
                  <span>•</span>
                  <span>IP: {dev.ipAddress}</span>
                </p>
              </div>
            </div>

            {!dev.isCurrent && (
              <button
                onClick={() => dispatch(revokeDeviceThunk(dev._id))}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
