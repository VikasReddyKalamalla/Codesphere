import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, Sparkles } from 'lucide-react';

export const SubscriptionBillingSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Subscription & Billing Shortcut
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">View your active SaaS subscription plan, billing history, and tax invoices</p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Active Membership
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">FREE STARTER PLAN</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upgrade to Professional to unlock unlimited AI credits and cloud sandboxes.</p>
        </div>

        <button
          onClick={() => navigate('/subscription')}
          className="px-5 py-3 rounded-2xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          Open Billing Portal <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
