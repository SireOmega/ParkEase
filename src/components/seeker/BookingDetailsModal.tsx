import React, { useRef, useEffect } from 'react';
import type { Booking } from '../../types/parkease';
import { formatInr } from '../../utils/geo';
import { X, Calendar, Clock, Car, MapPin } from 'lucide-react';
import { useParkEase } from '../../context/ParkEaseContext';

interface BookingDetailsModalProps {
  readonly booking: Booking;
  readonly onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { state } = useParkEase();
  const space = state.spaces.find((s) => s.id === booking.spaceId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleClose = () => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="booking-detail-title"
      className="w-[90%] max-w-[340px] rounded-3xl bg-white p-5 shadow-2xl border border-slate-200/80 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm m-auto text-left"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 id="booking-detail-title" className="text-base font-extrabold text-slate-900">
          Booking Details
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-xs">
        {/* Booking ID & Status */}
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-sm text-[#1E6B43]">{booking.id}</span>
          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
            {booking.status}
          </span>
        </div>

        {/* Space Title & Address */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="font-bold text-slate-900">{booking.spaceTitle}</p>
          {space && (
            <div className="mt-1 flex items-start gap-1 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{space.address}</span>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{booking.scheduleLabel}</span>
        </div>

        {/* Vehicle & Duration */}
        <div className="flex items-center justify-between py-2 border-y border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Car className="w-4 h-4 text-slate-400" />
            <span className="font-semibold">{booking.vehicleType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-semibold">{booking.durationHours} hr(s)</span>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-medium text-slate-500">Amount Paid / Due:</span>
          <span className="text-base font-black text-slate-900 tabular-nums">
            {formatInr(booking.totalPriceInr)}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};
