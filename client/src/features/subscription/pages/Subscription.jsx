import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreditCard, Sparkles, Layers, Activity, Receipt, Users,
  GraduationCap, Ticket, Share2, ShieldCheck, Zap, Check, Pause, Play, Trash2, ArrowRight
} from 'lucide-react';

import { PlanCard } from '../components/PlanCard';
import { CheckoutModal } from '../components/CheckoutModal';
import { UsageDashboardView } from '../components/UsageDashboardView';
import { InvoiceManagerView } from '../components/InvoiceManagerView';
import { TeamManagementView } from '../components/TeamManagementView';
import { UniversityLicenseView } from '../components/UniversityLicenseView';
import { ReferralProgramView } from '../components/ReferralProgramView';
import { AIBillingInsightsView } from '../components/AIBillingInsightsView';
import { AdminBillingDashboardView } from '../components/AdminBillingDashboardView';
import { RightSidebarWidget } from '../components/RightSidebarWidget';

import {
  loadSubscriptionDashboardThunk,
  selectActiveViewTab,
  setActiveViewTab,
  selectPlans,
  selectCurrentSubscription,
  selectSelectedBillingCycle,
  setSelectedBillingCycle,
  selectCurrency,
  setCurrency,
  pauseSubscriptionThunk,
  resumeSubscriptionThunk,
  cancelSubscriptionThunk,
} from '../redux';

export const Subscription = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveViewTab);
  const plans = useSelector(selectPlans);
  const currentSub = useSelector(selectCurrentSubscription);
  const cycle = useSelector(selectSelectedBillingCycle);
  const currency = useSelector(selectCurrency);

  useEffect(() => {
    dispatch(loadSubscriptionDashboardThunk());
  }, [dispatch]);

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: CreditCard },
    { id: 'plans', label: 'Plans & Pricing', icon: Layers, badge: 'Save 25%' },
    { id: 'usage', label: 'Usage Metering', icon: Activity },
    { id: 'invoices', label: 'Invoices & Tax', icon: Receipt },
    { id: 'team', label: 'Team Seats', icon: Users },
    { id: 'university', label: 'Campus License', icon: GraduationCap },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'referral', label: 'Referral Rewards', icon: Share2, badge: 'Earn ₹250' },
    { id: 'ai_insights', label: 'AI Cost Insights', icon: Sparkles },
    { id: 'admin', label: 'Admin Console', icon: ShieldCheck },
  ];

  const planName = currentSub?.planName?.toUpperCase() || 'FREE STARTER';
  const isPaid = planName !== 'FREE' && planName !== 'FREE STARTER';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plans':
        return (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose Your Plan</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Upgrade or downgrade anytime. Pro-rated billing applied automatically.</p>
              </div>

              {/* Billing Cycle Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-800">
                {['monthly', 'quarterly', 'yearly'].map((c) => (
                  <button
                    key={c}
                    onClick={() => dispatch(setSelectedBillingCycle(c))}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                      cycle === c
                        ? 'bg-gradient-to-r from-[#04AA6D] to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {c} {c === 'yearly' && <span className="text-[10px] text-amber-500 font-extrabold ml-1">25% OFF</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((p) => (
                <PlanCard key={p._id || p.name} plan={p} currentPlanName={currentSub?.planName} />
              ))}
            </div>
          </div>
        );

      case 'usage':
        return <UsageDashboardView />;
      case 'invoices':
        return <InvoiceManagerView />;
      case 'team':
        return <TeamManagementView />;
      case 'university':
        return <UniversityLicenseView />;
      case 'coupons':
        return (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Coupons & Special Offers</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Active promo codes and seasonal promotional discounts</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <span className="text-sm font-bold text-[#04AA6D] dark:text-emerald-400 font-mono">STUDENTPRO50</span>
                <p className="text-xs text-slate-600 dark:text-slate-300">Flat 50% Off on Student Pro annual subscription</p>
                <div className="text-[10px] text-slate-400">Valid until Dec 31, 2026</div>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">CODESPHERE2026</span>
                <p className="text-xs text-slate-600 dark:text-slate-300">Save ₹1,000 on Team Professional subscription</p>
                <div className="text-[10px] text-slate-400">Valid for first 500 team accounts</div>
              </div>
            </div>
          </div>
        );
      case 'referral':
        return <ReferralProgramView />;
      case 'ai_insights':
        return <AIBillingInsightsView />;
      case 'admin':
        return <AdminBillingDashboardView />;

      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left 2 Columns: Main Overview Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Active Subscription Overview Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/10 via-slate-50 to-teal-900/10 dark:from-emerald-950/70 dark:via-slate-900/90 dark:to-teal-950/70 border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-[#04AA6D]" /> Active Membership
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {currentSub?.planId?.displayName || currentSub?.planName?.toUpperCase() || 'FREE STARTER'}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 flex items-center gap-3">
                      <span>Cycle: <strong className="capitalize text-slate-900 dark:text-white">{currentSub?.billingCycle || 'Monthly'}</strong></span>
                      <span>•</span>
                      <span>Status: <strong className="text-[#04AA6D] dark:text-emerald-400 uppercase">{currentSub?.status || 'Active'}</strong></span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {currentSub?.status === 'paused' ? (
                      <button
                        onClick={() => dispatch(resumeSubscriptionThunk())}
                        className="px-4 py-2.5 rounded-2xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4" /> Resume Subscription
                      </button>
                    ) : (
                      <button
                        onClick={() => dispatch(pauseSubscriptionThunk())}
                        className="px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-amber-300 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Pause className="w-4 h-4" /> Pause Billing
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel your subscription?')) {
                          dispatch(cancelSubscriptionThunk('User requested cancellation'));
                        }
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Cancel Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Sandbox Compute', desc: 'High-speed cloud runner instances & environments', icon: Zap },
                  { title: 'AI Mentor & Codex', desc: 'Unlimited Codex auto-complete & architectural chat', icon: ShieldCheck },
                  { title: 'Pro Certifications', desc: 'Verified course, test & skill badges', icon: Check },
                  { title: 'Live Sessions', desc: '1-on-1 mentor architectural reviews & live workshops', icon: Check },
                ].map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                      <div className="p-2 w-fit rounded-xl bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{h.title}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">{h.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Sidebar Widget */}
            <RightSidebarWidget />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 pb-16 animate-fade-in">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-[#04AA6D] dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
              Subscription & Billing Portal
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            SaaS Licensing, Team Seats, Usage Metering, Tax Invoices, and AI Cost Optimization.
          </p>
        </div>

        {/* Currency Switcher & Active Plan Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Current Plan:</span>
            <span className={`font-bold font-mono ${isPaid ? 'text-[#04AA6D] dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
              {planName}
            </span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 border border-slate-200 dark:border-slate-800">
            {['INR', 'USD', 'EUR'].map((c) => (
              <button
                key={c}
                onClick={() => dispatch(setCurrency(c))}
                className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  currency === c
                    ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : '€ EUR'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-200 dark:border-slate-800/80 z-10">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => dispatch(setActiveViewTab(t.id))}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#04AA6D] to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#04AA6D] dark:text-emerald-400'}`} />
              <span>{t.label}</span>
              {t.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main View Body */}
      <div className="z-10 w-full">
        {renderTabContent()}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal />
    </div>
  );
};
