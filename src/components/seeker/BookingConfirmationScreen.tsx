import React from 'react';
import { CheckCircle2, Navigation, Calendar } from 'lucide-react';
import { useParkEase } from '../../context/ParkEaseContext';

export const BookingConfirmationScreen: React.FC = () => {
  const { confirmedBooking, setSeekerScreen, state } = useParkEase();

  // Reference space coordinates for Get Directions button
  const space = state.spaces.find((s) => s.id === confirmedBooking?.spaceId);
  const targetLat = space?.coordinates.lat ?? 12.9716;
  const targetLng = space?.coordinates.lng ?? 77.5946;

  const bookingId = confirmedBooking?.id ?? '#PE2510247';
  const durationHours = confirmedBooking?.durationHours ?? 2;

  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-white overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
        {/* Large green circle with white checkmark */}
        <div className="w-20 h-20 rounded-full bg-[#1E6B43] flex items-center justify-center text-white shadow-xl shadow-emerald-700/20 mb-6 transform animate-bounce">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Booking Confirmed!
        </h1>

        <p className="mt-2 text-sm text-slate-600 font-medium">
          Your parking space is booked for {durationHours} hour{durationHours > 1 ? 's' : ''}.
        </p>

        {/* Light-gray card with Booking ID */}
        <div className="mt-6 w-full max-w-[280px] p-4 rounded-2xl bg-slate-100/90 border border-slate-200/80">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Booking ID
          </p>
          <p className="mt-1 text-2xl font-black text-[#1E6B43] tracking-wide tabular-nums font-mono">
            {bookingId}
          </p>
          {confirmedBooking && (
            <p className="mt-2 text-xs font-semibold text-slate-700">
              {confirmedBooking.spaceTitle}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Pending provider check-in / live review</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3 pb-2">
        <button
          type="button"
          onClick={() => setSeekerScreen('bookings')}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-base shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          <span>View Booking</span>
        </button>

        <button
          type="button"
          onClick={handleGetDirections}
          className="w-full py-3.5 px-6 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-base transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Navigation className="w-5 h-5 text-[#1E6B43]" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
};
