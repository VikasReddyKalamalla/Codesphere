import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, RefreshCw, CheckCircle2, Shield,
  DollarSign, Zap, Edit3, Trash2, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([
    { id: 'free', name: 'Free Starter Plan', price: '$0.00', period: 'Forever', features: ['0.5 CPU / 512MB RAM Sandbox', 'Public Community Forums', 'Standard DSA Problems'], active: true },
    { id: 'standard', name: 'Standard Developer Pass', price: '$9.99', period: 'Monthly', features: ['1.0 CPU / 1GB RAM Sandbox', 'VS Code Web IDE Integration', 'All 446 Striver DSA Questions', 'Standard Certificates'], active: true },
    { id: 'premium', name: 'Pro Master All-Access', price: '$19.99', period: 'Monthly', features: ['2.0 CPU / 2GB RAM Dedicated Container', 'Multiplayer Codex Rooms', 'Live WebRTC Masterclasses', 'Priority Judge0 Execution', 'Verified PDF Certificates'], active: true }
  ]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/subscriptions/plans');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setPlans(res.data.data);
      }
    } catch {
      // Keep defaults if custom plans not fetched
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Subscriptions & Pricing Tiers</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure student membership tiers, container resource allocations, and feature entitlements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Tiers
          </button>
          <button 
            onClick={() => toast.success('Tier creation window opened')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            Create Custom Plan
          </button>
        </div>
      </div>

      {/* Plans Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, idx) => (
          <div 
            key={plan.id || idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  {plan.name}
                </span>
                <span className="text-xs font-mono text-emerald-500 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>

              <div className="my-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono"> / {plan.period || 'month'}</span>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Included Entitlements</span>
                {plan.features?.map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button 
                onClick={() => toast.success(`Editing pricing tier: ${plan.name}`)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl font-mono transition-colors"
              >
                Edit Tier Config
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSubscriptions;
