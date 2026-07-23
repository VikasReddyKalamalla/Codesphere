import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Layers,
  Activity,
  Receipt,
  Users,
  GraduationCap,
  Ticket,
  Share2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { setActiveViewTab, selectActiveViewTab } from '../redux';

export const SubscriptionSidebar = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveViewTab);

  const menuItems = [
    { id: 'overview', label: 'Current Plan & Overview', icon: LayoutDashboard },
    { id: 'plans', label: 'Plans & Pricing', icon: Layers, badge: 'Save 25%' },
    { id: 'usage', label: 'Usage Dashboard', icon: Activity },
    { id: 'invoices', label: 'Invoices & Receipts', icon: Receipt },
    { id: 'team', label: 'Team & Seat Billing', icon: Users },
    { id: 'university', label: 'Campus & University', icon: GraduationCap },
    { id: 'coupons', label: 'Coupons & Offers', icon: Ticket },
    { id: 'referral', label: 'Referral Rewards', icon: Share2, badge: 'Earn ₹250' },
    { id: 'ai_insights', label: 'AI Cost Insights', icon: Sparkles },
    { id: 'admin', label: 'Admin Billing Console', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-[#070a13] border-r border-slate-800/80 p-4 flex flex-col gap-2 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
        Subscription Portal
      </div>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveViewTab(item.id))}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-lg shadow-purple-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
