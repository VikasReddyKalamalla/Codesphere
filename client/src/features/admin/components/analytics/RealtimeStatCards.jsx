import React from 'react';
import CountUp from 'react-countup';
import { Users, DollarSign, Code, TrendingUp, Server, ArrowUpRight } from 'lucide-react';

const CountUpComp = typeof CountUp === 'function' ? CountUp : (CountUp?.default || null);

const SafeCountUp = ({ end = 0, duration = 1.2, separator = ',' }) => {
  if (CountUpComp) {
    return <CountUpComp end={end} duration={duration} separator={separator} />;
  }
  return <span>{Number(end).toLocaleString()}</span>;
};

export const RealtimeStatCards = ({ metrics = {}, telemetry = {}, onCardClick }) => {
  const cards = [
    {
      id: 'active-users',
      title: 'Active Online Users',
      subtitle: `Total Registered Users: ${(metrics.totalUsers ?? 0).toLocaleString()}`,
      value: metrics.activeUsers ?? 0,
      prefix: '',
      suffix: '',
      trend: 'Live Socket',
      targetTab: 'live-stream',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
      sparklineColor: '#10b981',
      sparklinePoints: '0,18 10,12 20,15 30,8 40,14 50,6 60,10 70,4 80,8 90,2 100,5',
    },
    {
      id: 'revenue-today',
      title: "Today's Revenue",
      subtitle: `Total Platform Revenue: $${(metrics.totalRevenue ?? 0).toLocaleString()}`,
      value: metrics.revenueToday ?? 0,
      prefix: '$',
      suffix: '',
      trend: 'Gross Sales',
      targetTab: 'revenue',
      icon: DollarSign,
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30',
      sparklineColor: '#6366f1',
      sparklinePoints: '0,20 10,16 20,18 30,12 40,10 50,15 60,8 70,12 80,6 90,4 100,2',
    },
    {
      id: 'code-executions',
      title: 'Code Executions Today',
      subtitle: `${metrics.testAttemptsToday ?? 0} Skill Assessments Passed`,
      value: metrics.codeExecutionsToday ?? 0,
      prefix: '',
      suffix: '',
      trend: 'Compiles',
      targetTab: 'engagement',
      icon: Code,
      iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-100 dark:border-cyan-500/20',
      badgeBg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30',
      sparklineColor: '#06b6d4',
      sparklinePoints: '0,22 10,19 20,14 30,16 40,9 50,11 60,7 70,9 80,4 90,5 100,1',
    },
    {
      id: 'system-health',
      title: 'System Health Score',
      subtitle: `CPU: ${telemetry.cpu?.usagePercent ?? 0}% | RAM: ${telemetry.memory?.usagePercent ?? 0}%`,
      value: telemetry.healthScore ?? 100,
      prefix: '',
      suffix: '%',
      trend: `${telemetry.api?.avgLatencyMs ?? 0}ms Latency`,
      targetTab: 'system-health',
      icon: Server,
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      sparklineColor: '#64748b',
      sparklinePoints: '0,10 10,8 20,9 30,7 40,8 50,6 60,7 70,5 80,6 90,4 100,3',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.targetTab)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                {card.title}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                {Icon && <Icon className="w-4 h-4" />}
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {card.prefix}
                <SafeCountUp end={card.value} duration={1.2} separator="," />
                {card.suffix}
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${card.badgeBg} flex items-center gap-1`}>
                <TrendingUp className="w-3 h-3" />
                {card.trend}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="truncate">{card.subtitle}</span>
              
              {/* Mini Sparkline SVG */}
              <svg viewBox="0 0 100 25" className="w-16 h-5 overflow-visible shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <polyline
                  points={card.sparklinePoints}
                  fill="none"
                  stroke={card.sparklineColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
