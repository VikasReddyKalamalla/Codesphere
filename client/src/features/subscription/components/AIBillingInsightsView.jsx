import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { selectUsageData } from '../redux';

export const AIBillingInsightsView = () => {
  const usageData = useSelector(selectUsageData);

  const insights = usageData?.aiInsights || {
    spendingTrend: 'Stable (+4% this month)',
    recommendedPlan: 'Professional',
    costOptimizationTip: 'Switching from monthly to yearly billing will save you ₹2,589 annually (25% instant discount).',
    usagePrediction: 'Your AI Sandbox usage is projected to reach 180 minutes next month.',
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> AI Cost & Spending Insights
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Smart machine-learning predictions and cost optimization recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#04AA6D] dark:text-emerald-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Spending Trend & Forecast
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{insights.spendingTrend}</div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{insights.usagePrediction}</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border border-emerald-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 dark:text-amber-300 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Cost Optimization Tip
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{insights.costOptimizationTip}</p>
        </div>
      </div>
    </div>
  );
};
