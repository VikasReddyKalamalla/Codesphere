import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, RefreshCw, CheckCircle2, Shield,
  DollarSign, Zap, Edit3, Trash2, Tag, Download, TrendingUp, Users, Award, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([
    { id: 'free', name: 'Free Starter Plan', price: '$0.00', period: 'Forever', features: ['0.5 CPU / 512MB RAM Sandbox', 'Public Community Forums', 'Standard DSA Problems'], active: true, subscribers: 8420 },
    { id: 'standard', name: 'Standard Developer Pass', price: '$9.99', period: 'Monthly', features: ['1.0 CPU / 1GB RAM Sandbox', 'VS Code Web IDE Integration', 'All 446 Striver DSA Questions', 'Standard Certificates'], active: true, subscribers: 890 },
    { id: 'premium', name: 'Pro Master All-Access', price: '$19.99', period: 'Monthly', features: ['2.0 CPU / 2GB RAM Dedicated Container', 'Multiplayer Codex Rooms', 'Live WebRTC Masterclasses', 'Priority Judge0 Execution', 'Verified PDF Certificates'], active: true, subscribers: 358 }
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '$14.99',
    period: 'Monthly',
    cpu: '1.5 CPU',
    ram: '2GB RAM',
    features: 'Multiplayer Codex Rooms, Unlimited Executions, Live Sessions'
  });

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

  const handleExportCSV = () => {
    const headers = ['Plan ID', 'Plan Name', 'Price', 'Billing Period', 'Subscribers', 'Active Status'];
    const rows = plans.map(p => [
      p.id,
      `"${p.name}"`,
      p.price,
      p.period,
      p.subscribers || 0,
      p.active ? 'Active' : 'Inactive'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `codesphere_subscription_tiers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subscription pricing roster exported to CSV!');
  };

  const handleCreatePlanSubmit = (e) => {
    e.preventDefault();
    if (!newPlan.name.trim()) {
      toast.error('Please enter a valid plan name.');
      return;
    }

    const created = {
      id: `plan_${Date.now()}`,
      name: newPlan.name,
      price: newPlan.price,
      period: newPlan.period,
      features: [
        `${newPlan.cpu} / ${newPlan.ram} Resource Quota`,
        ...newPlan.features.split(',').map(f => f.trim()).filter(Boolean)
      ],
      active: true,
      subscribers: 0
    };

    setPlans(prev => [...prev, created]);
    setIsModalOpen(false);
    setNewPlan({ name: '', price: '$14.99', period: 'Monthly', cpu: '1.5 CPU', ram: '2GB RAM', features: '' });
    toast.success(`Created new plan tier: "${created.name}"`);
  };

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
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono rounded-xl border border-emerald-500/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Tiers
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            Create Custom Plan
          </button>
        </div>
      </div>

      {/* Subscription KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Monthly Revenue (MRR)</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">$16,047.42</h3>
            <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% this month
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Active Paid Subscribers</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">1,248</h3>
            <span className="text-[10px] text-slate-400 font-mono">Standard & Pro tiers</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Annual Run Rate (ARR)</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">$192,569</h3>
            <span className="text-[10px] text-emerald-500 font-mono font-bold">99.4% Payment Success</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono uppercase text-slate-400">Top Growth Tier</span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">Pro Master All-Access</h3>
            <span className="text-[10px] text-purple-400 font-mono font-bold">28.6% Conversion</span>
          </div>
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

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-400">
                {plan.subscribers || 0} subscribers
              </span>
              <button 
                onClick={() => toast.success(`Editing pricing tier: ${plan.name}`)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl font-mono transition-colors cursor-pointer"
              >
                Edit Tier Config
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black">Create Custom Subscription Tier</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlanSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="text-xs font-bold font-mono text-slate-400 uppercase">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Enterprise Team Pass"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-400 uppercase">Price</label>
                  <input
                    type="text"
                    placeholder="$29.99"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold font-mono text-slate-400 uppercase">Billing Period</label>
                  <select
                    value={newPlan.period}
                    onChange={(e) => setNewPlan({ ...newPlan, period: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-400 uppercase">CPU Limit</label>
                  <input
                    type="text"
                    placeholder="2.0 CPU"
                    value={newPlan.cpu}
                    onChange={(e) => setNewPlan({ ...newPlan, cpu: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold font-mono text-slate-400 uppercase">RAM Limit</label>
                  <input
                    type="text"
                    placeholder="4GB RAM"
                    value={newPlan.ram}
                    onChange={(e) => setNewPlan({ ...newPlan, ram: e.target.value })}
                    className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold font-mono text-slate-400 uppercase">Features (Comma Separated)</label>
                <textarea
                  rows={2}
                  placeholder="Dedicated VPS Sandbox, Verified PDF Certificates, Priority Queue"
                  value={newPlan.features}
                  onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
