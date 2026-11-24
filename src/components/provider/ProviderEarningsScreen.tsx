import React, { useState } from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { DailyEarningsBarChart } from '../charts/DailyEarningsBarChart';
import { MonthlyLineChart } from '../charts/MonthlyLineChart';
import { formatInr } from '../../utils/geo';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';

export const ProviderEarningsScreen: React.FC = () => {
  const { state } = useParkEase();
  const { providerStats, dailyEarnings, monthlyEarnings, recentActivity } = state;
  const [selectedFilter, setSelectedFilter] = useState('This Month');

  return (
    <div className="space-y-6">
      {/* Earnings Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Earnings Overview</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Monitor payout history, daily receipts, and revenue growth.
          </p>
        </div>

        {/* Filter Dropdown ("This Month" per spec) */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50"
        >
          <option value="This Month">This Month (Dec 2026)</option>
          <option value="Last Month">Last Month (Nov 2026)</option>
          <option value="All Time">All Time (2026)</option>
        </select>
      </div>

      {/* Main KPI Card: ₹4,800 + "↑ 20%" badge */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Net Earnings
          </span>
          <div className="mt-2 flex items-baseline gap-4">
            <span className="text-4xl sm:text-5xl font-black text-[#1E6B43] tabular-nums tracking-tight">
              {formatInr(providerStats.totalEarningsInr)}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5EE] text-[#1E6B43] border border-[#B7E4C7]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{providerStats.growthBadge} vs last month</span>
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Automated payouts to HDFC Bank A/C ending in ••4812 every Monday.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 min-w-[200px]">
          <div className="flex justify-between text-slate-500">
            <span>Completed Bookings:</span>
            <span className="font-bold text-slate-800">{providerStats.totalBookings}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Average Payout / Day:</span>
            <span className="font-bold text-slate-800">₹160</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Platform Fee:</span>
            <span className="font-bold text-emerald-700">0% (VTU Pilot)</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Daily Vertical Bar Chart & Monthly Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Earnings Vertical Bar Chart (Aug 1 / Aug 15 / Aug 31) */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Earnings Distribution</h2>
              <p className="text-xs text-slate-400">Vertical bars for selected period</p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-[#E8F5EE] px-2.5 py-0.5 rounded-md">
              Daily
            </span>
          </div>

          <DailyEarningsBarChart data={dailyEarnings} height={200} />
        </div>

        {/* Monthly Trend */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">5-Month Trajectory</h2>
              <p className="text-xs text-slate-400">Steady month-over-month growth</p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-[#E8F5EE] px-2.5 py-0.5 rounded-md">
              Aug – Dec
            </span>
          </div>

          <MonthlyLineChart data={monthlyEarnings} height={200} />
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">Recent Transactions & Payouts</h2>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1E6B43] flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{activity.text}</p>
                  <p className="text-[11px] text-slate-400">{activity.timestampLabel}</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                Settled <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
