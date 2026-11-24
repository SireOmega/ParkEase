import React, { useState } from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { formatInr } from '../../utils/geo';
import { Check, X, Calendar, Clock } from 'lucide-react';
import type { BookingStatus } from '../../types/parkease';

type FilterTab = 'All' | BookingStatus;

export const ManageBookingsScreen: React.FC = () => {
  const { state, acceptBooking, rejectBooking } = useParkEase();
  const [filterTab, setFilterTab] = useState<FilterTab>('All');

  const filteredBookings = state.bookings.filter((b) => {
    if (filterTab === 'All') return true;
    return b.status === filterTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Bookings</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Review and respond to parking requests from seekers across Bengaluru.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-200/70 rounded-xl self-start sm:self-auto">
          {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'] as const).map(
            (tab) => {
              const count =
                tab === 'All'
                  ? state.bookings.length
                  : state.bookings.filter((b) => b.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    filterTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 stroke-1 mb-2" />
            <p className="text-xs font-semibold">No bookings found for &quot;{filterTab}&quot;</p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isPending = b.status === 'Pending';
            const isConfirmed = b.status === 'Confirmed';

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                      {b.vehicleType}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{b.spaceTitle}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isPending
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 font-medium">
                    {b.durationHours} hr{b.durationHours > 1 ? 's' : ''} •{' '}
                    <span className="font-bold text-[#1E6B43] tabular-nums">
                      {formatInr(b.totalPriceInr)}
                    </span>{' '}
                    • <span className="text-slate-500">Requested: {b.requestedAtLabel}</span>
                  </p>

                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>{b.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3" /> {b.scheduleLabel}
                    </span>
                  </div>
                </div>

                {/* Actions: Accept/Reject when Pending */}
                {isPending && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => acceptBooking(b.id)}
                      className="py-2 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rejectBooking(b.id)}
                      className="py-2 px-3 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs transition active:scale-95 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
