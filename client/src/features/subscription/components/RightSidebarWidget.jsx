import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { selectCurrentSubscription, setActiveViewTab, setCheckoutModalOpen, setSelectedPlanForCheckout } from '../redux';

export const RightSidebarWidget = () => {
  const dispatch = useDispatch();
  const currentSub = useSelector(selectCurrentSubscription);

  const daysRemaining = Math.max(
    0,
    Math.ceil(((currentSub?.endDate ? new Date(currentSub.endDate) : new Date(Date.now() + 14 * 86400000)) - new Date()) / 86400000)
  );

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Renewal Countdown Card */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3.5 shadow-sm dark:shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" /> Billing Cycle Status
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono font-bold uppercase">
            {currentSub?.status || 'Active'}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{daysRemaining} Days</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Remaining until next renewal</div>
          </div>
          <button
            onClick={() => dispatch(setActiveViewTab('plans'))}
            className="px-3.5 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Recommendation Widget */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3.5 relative overflow-hidden shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500" /> AI Upgrade Suggestion
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Based on your high sandbox activity, upgrading to <span className="text-[#04AA6D] dark:text-emerald-300 font-semibold">Professional</span> will give you unlimited AI credits and 50GB storage.
        </p>
        <button
          onClick={() => {
            dispatch(setSelectedPlanForCheckout({ name: 'professional', displayName: 'Professional', monthlyPrice: 799 }));
            dispatch(setCheckoutModalOpen(true));
          }}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#04AA6D] to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Upgrade for ₹799/mo <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Promos & Offers */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3.5 shadow-sm dark:shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5 text-[#04AA6D] dark:text-emerald-400">
            <Tag className="w-4 h-4" /> Active Offers & Coupons
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold font-mono text-[#04AA6D] dark:text-emerald-300">STUDENTPRO50</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Flat 50% Off for Verified Students</div>
            </div>
            <button
              onClick={() => dispatch(setActiveViewTab('coupons'))}
              className="px-2.5 py-1 bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-300 text-[10px] font-bold rounded-lg hover:bg-emerald-500/20 cursor-pointer"
            >
              Apply
            </button>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold font-mono text-teal-600 dark:text-teal-300">ANNUAL25</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Save 25% on Yearly Subscriptions</div>
            </div>
            <button
              onClick={() => dispatch(setActiveViewTab('plans'))}
              className="px-2.5 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-300 text-[10px] font-bold rounded-lg hover:bg-teal-500/20 cursor-pointer"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
