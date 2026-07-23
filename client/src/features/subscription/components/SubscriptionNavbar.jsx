import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Crown, Sparkles } from 'lucide-react';
import { setCurrency, selectCurrency, selectCurrentSubscription } from '../redux';

export const SubscriptionNavbar = () => {
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);
  const currentSub = useSelector(selectCurrentSubscription);

  const planName = currentSub?.planName?.toUpperCase() || 'FREE STARTER';
  const isPaid = planName !== 'FREE' && planName !== 'FREE STARTER';

  return (
    <header className="w-full h-16 bg-[#070a13]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/40">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-black text-white flex items-center gap-2 tracking-tight">
            CodeSphere Billing & Subscription
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Enterprise Ready
            </span>
          </h1>
          <p className="text-xs text-slate-400">SaaS Licensing, Team Seats, Payments & Usage Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Active Plan Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <Sparkles className={`w-4 h-4 ${isPaid ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className="text-xs text-slate-400">Plan:</span>
          <span className={`text-xs font-bold font-mono ${isPaid ? 'text-purple-400' : 'text-slate-300'}`}>
            {planName}
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800">
          {['INR', 'USD', 'EUR'].map((c) => (
            <button
              key={c}
              onClick={() => dispatch(setCurrency(c))}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currency === c
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
