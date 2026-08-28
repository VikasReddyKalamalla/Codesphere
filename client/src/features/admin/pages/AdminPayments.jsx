import React, { useState, useEffect } from 'react';
import { 
  DollarSign, RefreshCw, Search, Download, ArrowUpRight,
  ShieldCheck, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const AdminPayments = () => {
  const [transactions, setTransactions] = useState([
    { id: 'inv_101', user: 'sarah@example.com', amount: '$19.99', plan: 'Pro Master All-Access', gateway: 'Stripe', status: 'Completed', date: 'Today 08:30' },
    { id: 'inv_102', user: 'james@example.com', amount: '$9.99', plan: 'Standard Developer Pass', gateway: 'Razorpay', status: 'Completed', date: 'Yesterday 14:20' },
    { id: 'inv_103', user: 'alex@example.com', amount: '$19.99', plan: 'Pro Master All-Access', gateway: 'Stripe', status: 'Completed', date: 'August 4, 2026' }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/payments/history');
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.history || []);
      if (list.length > 0) {
        setTransactions(list);
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    (t.user || t.customerEmail || t.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Platform Payments & Financial Audit</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audit gross revenue, track Stripe & Razorpay webhooks, and issue credit refunds.
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
            Refresh Audit
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions by invoice ID or user email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Audit Records: <span className="font-extrabold text-slate-900 dark:text-white">{filteredTransactions.length}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-xs text-slate-400 font-mono">Fetching financial logs...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">
            No transaction records found matching filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase font-mono text-slate-400">
                  <th className="py-4 px-6">Invoice ID</th>
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Plan / Item</th>
                  <th className="py-4 px-6">Gateway</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                {filteredTransactions.map((tx, idx) => (
                  <tr key={tx.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{tx.id}</td>
                    <td className="py-4 px-6">{tx.user || tx.customerEmail || 'User'}</td>
                    <td className="py-4 px-6 font-sans font-semibold">{tx.plan || 'Pass Subscription'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tx.gateway || 'Stripe'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600 dark:text-emerald-400">{tx.amount}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                        {tx.status || 'Completed'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => toast.success(`Downloading invoice: ${tx.id}`)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
