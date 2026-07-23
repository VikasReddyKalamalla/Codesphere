import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { setSelectedPlanForCheckout, setCheckoutModalOpen, selectCurrency, selectSelectedBillingCycle } from '../redux';

export const PlanCard = ({ plan, currentPlanName }) => {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);
  const cycle = useSelector(selectSelectedBillingCycle);

  const isCurrent = currentPlanName?.toLowerCase() === plan.name.toLowerCase();

  const getPrice = () => {
    if (currency === 'USD') {
      if (cycle === 'yearly') return `$${plan.usdYearlyPrice || Math.round((plan.usdMonthlyPrice || 10) * 9.5)}/yr`;
      return `$${plan.usdMonthlyPrice || 10}/mo`;
    }
    if (currency === 'EUR') {
      if (cycle === 'yearly') return `€${Math.round((plan.usdYearlyPrice || 10) * 0.92)}/yr`;
      return `€${Math.round((plan.usdMonthlyPrice || 10) * 0.92)}/mo`;
    }
    // INR default
    if (cycle === 'yearly') return `₹${(plan.yearlyPrice || plan.monthlyPrice * 10).toLocaleString('en-IN')}/yr`;
    if (cycle === 'quarterly') return `₹${(plan.quarterlyPrice || plan.monthlyPrice * 2.7).toLocaleString('en-IN')}/qtr`;
    return `₹${(plan.monthlyPrice || 0).toLocaleString('en-IN')}/mo`;
  };

  const featureItems = [
    plan.limits?.sandboxMinutes === -1 ? 'Unlimited Sandbox Minutes' : `${plan.limits?.sandboxMinutes || 60} Mins Sandbox / month`,
    plan.limits?.aiCredits === -1 ? 'Unlimited AI Credits' : `${plan.limits?.aiCredits || 50} AI Credits / month`,
    plan.limits?.storageGB === -1 ? 'Unlimited Cloud Storage' : `${plan.limits?.storageGB || 1} GB Storage`,
    plan.features?.learningPaths === -1 ? 'Unlimited Learning Paths' : `${plan.features?.learningPaths || 3} Learning Tracks`,
    plan.features?.codexAccess && 'Full Codex Workspace',
    plan.features?.privateCodex && 'Private Codex Repositories',
    plan.features?.prioritySupport && '24/7 Priority Support',
    plan.features?.apiAccess && 'REST API & Webhook Access',
    plan.features?.customBranding && 'Custom Organization Branding',
    plan.features?.ssoSupport && 'Okta & Enterprise SSO',
  ].filter(Boolean);

  return (
    <div
      className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
        plan.isFeatured
          ? 'bg-gradient-to-b from-emerald-900/10 via-white to-emerald-900/10 dark:from-emerald-950/60 dark:via-slate-900/90 dark:to-slate-950/90 border-2 border-emerald-500/60 shadow-xl dark:shadow-2xl dark:shadow-emerald-950/80 scale-[1.02]'
          : 'bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-slate-900/90 shadow-sm dark:shadow-xl'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#04AA6D] to-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/30">
          {plan.badge}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{plan.displayName}</h3>
          {plan.isFeatured && <Sparkles className="w-5 h-5 text-amber-500" />}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 min-h-[36px] line-clamp-2 leading-relaxed">{plan.tagline || plan.description}</p>

        <div className="mb-6">
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{getPrice()}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Billed {cycle} • Cancel anytime</div>
        </div>

        <div className="w-full h-px bg-slate-200 dark:bg-slate-800/80 mb-6" />

        <div className="space-y-3 mb-8">
          {featureItems.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-0.5 rounded-full bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 mt-0.5 shrink-0 border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        disabled={isCurrent}
        onClick={() => {
          dispatch(setSelectedPlanForCheckout(plan));
          dispatch(setCheckoutModalOpen(true));
        }}
        className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isCurrent
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            : plan.isFeatured
            ? 'bg-gradient-to-r from-[#04AA6D] via-teal-600 to-[#04AA6D] text-white shadow-xl shadow-emerald-500/25 hover:brightness-110'
            : 'bg-slate-200 dark:bg-slate-800 hover:bg-[#04AA6D] hover:text-white text-slate-900 dark:text-white border border-slate-300 dark:border-emerald-500/30'
        }`}
      >
        {isCurrent ? (
          'Current Active Plan'
        ) : (
          <>
            Subscribe Now <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
