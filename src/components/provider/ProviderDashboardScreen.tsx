import React from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { KpiCard } from '../ui/KpiCard';
import { MonthlyLineChart } from '../charts/MonthlyLineChart';
import { formatInr } from '../../utils/geo';
import { CalendarCheck, DollarSign, Clock, Check, X, ArrowRight, Plus } from 'lucide-react';

export const ProviderDashboardScreen: React.FC = () => {
  const { state, acceptBooking, rejectBooking, setProviderScreen } = useParkEase();
  const { providerStats, recentActivity, monthlyEarnings } = state;

  // Pending requests: seeded requests + any live Seeker requests
  const pendingRequests = state.bookings.filter((b) => b.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, Rohan!
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Here is your overview for today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setProviderScreen('wizard')}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-xs shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Parking Space</span>
        </button>
      </div>

      {/* 3 KPI Cards: Total Bookings (blue), Total Earnings (green mint), Upcoming (amber) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Total Bookings"
          value={providerStats.totalBookings}
          tint="blue"
          icon={<CalendarCheck className="w-5 h-5" />}
        />

        <KpiCard
          title="Total Earnings"
          value={formatInr(providerStats.totalEarningsInr)}
          badge={providerStats.growthBadge}
          tint="green"
          icon={<DollarSign className="w-5 h-5" />}
        />

        <KpiCard
          title="Upcoming"
          value={providerStats.upcomingCount}
          tint="amber"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Monthly Earnings Chart Card */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Monthly Earnings Performance</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#E8F5EE] text-[#1E6B43] border border-[#B7E4C7]">
                {providerStats.growthBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Aug 2026 – Dec 2026 performance trend</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
            Aug – Dec
          </span>
        </div>

        <MonthlyLineChart data={monthlyEarnings} height={200} />
      </div>

      {/* Two Column Grid: Pending Requests & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests Column (2 cols wide) */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Pending Booking Requests</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                {pendingRequests.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setProviderScreen('bookings')}
              className="text-xs font-bold text-[#1E6B43] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {pendingRequests.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-center">
                <Clock className="w-8 h-8 stroke-1 text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No pending requests right now.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  New reservations from the Seeker app will show up here instantly.
                </p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                        {req.vehicleType}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{req.spaceTitle}</h3>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 font-medium">
                      {req.durationHours} hr{req.durationHours > 1 ? 's' : ''} •{' '}
                      <span className="font-bold text-[#1E6B43] tabular-nums">
                        {formatInr(req.totalPriceInr)}
                      </span>{' '}
                      •{' '}
                      <span className="text-slate-500">{req.requestedAtLabel}</span>
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400 font-mono">
                      {req.id} • {req.scheduleLabel}
                    </p>
                  </div>

                  {/* Accept / Reject Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => acceptBooking(req.id)}
                      className="py-2 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rejectBooking(req.id)}
                      className="py-2 px-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs transition active:scale-95 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Column (1 col wide) */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <h2 className="text-base font-bold text-slate-900 mb-4">Recent Activity</h2>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold"
              >
                <span className="text-emerald-700">{activity.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
