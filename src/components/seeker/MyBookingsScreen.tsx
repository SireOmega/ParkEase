import React, { useState } from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { formatInr, formatDistance } from '../../utils/geo';
import { Clock, Calendar } from 'lucide-react';
import type { Booking } from '../../types/parkease';
import { BookingDetailsModal } from './BookingDetailsModal';

type BookingTab = 'Current' | 'Past';

export const MyBookingsScreen: React.FC = () => {
  const { state, cancelBooking } = useParkEase();
  const [activeTab, setActiveTab] = useState<BookingTab>('Current');
  const [inspectedBooking, setInspectedBooking] = useState<Booking | null>(null);

  // Filter bookings belonging to seeker
  const seekerBookings = state.bookings.filter((b) => state.seekerBookingIds.includes(b.id));

  const currentBookings = seekerBookings.filter(
    (b) => b.status === 'Pending' || b.status === 'Confirmed',
  );

  const pastBookings = seekerBookings.filter(
    (b) => b.status === 'Completed' || b.status === 'Cancelled' || b.status === 'Rejected',
  );

  const displayedList = activeTab === 'Current' ? currentBookings : pastBookings;

  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden pb-16">
      {/* Screen Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200">
        <h1 className="text-lg font-extrabold text-slate-900">My Bookings</h1>

        {/* Segmented Tabs Current | Past */}
        <div className="mt-3 grid grid-cols-2 p-1 rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('Current')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'Current'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Current ({currentBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Past')}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'Past'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 mt-12">
            <Calendar className="w-12 h-12 text-slate-300 stroke-1 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No {activeTab.toLowerCase()} bookings</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'Current'
                ? 'Search and reserve nearby parking spots on the map.'
                : 'Your completed or cancelled bookings will appear here.'}
            </p>
          </div>
        ) : (
          displayedList.map((booking) => {
            const space = state.spaces.find((s) => s.id === booking.spaceId);
            const isConfirmed = booking.status === 'Confirmed';
            const isPending = booking.status === 'Pending';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  {/* Space Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80">
                    <img
                      src={space?.imageUrl ?? ''}
                      alt={booking.spaceTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {booking.spaceTitle}
                      </h3>
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isConfirmed
                            ? 'bg-[#E8F5EE] text-[#1E6B43] border border-[#A7F3D0]'
                            : isPending
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {space ? `${formatDistance(space.distanceMeters)} • ` : ''}
                      <span className="font-bold text-[#1E6B43] tabular-nums">
                        {formatInr(booking.totalPriceInr)}
                      </span>{' '}
                      ({booking.vehicleType})
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.scheduleLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    {booking.id}
                  </span>

                  <div className="flex items-center gap-2">
                    {activeTab === 'Current' && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setInspectedBooking(booking)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Details Modal */}
      {inspectedBooking && (
        <BookingDetailsModal
          booking={inspectedBooking}
          onClose={() => setInspectedBooking(null)}
        />
      )}
    </div>
  );
};
