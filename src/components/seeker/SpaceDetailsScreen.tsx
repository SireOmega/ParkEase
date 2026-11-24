import React, { useState } from 'react';
import { ArrowLeft, Heart, Star, Clock, Maximize2, ShieldCheck, Check } from 'lucide-react';
import { useParkEase } from '../../context/ParkEaseContext';
import { formatDistance, formatInr } from '../../utils/geo';
import type { VehicleType } from '../../types/parkease';

type DurationChoice = 1 | 2 | 3 | 'custom';

export const SpaceDetailsScreen: React.FC = () => {
  const {
    state,
    selectedSpaceId,
    setSeekerScreen,
    createBooking,
    activeFilter,
    toggleFavorite,
  } = useParkEase();

  // Selected space fallback to first
  const space = state.spaces.find((s) => s.id === selectedSpaceId) ?? state.spaces[0];

  // Favorite status
  const isFavorite = space ? state.favoriteSpaceIds.includes(space.id) : false;

  // Selected vehicle default
  const defaultVehicle: VehicleType =
    space && activeFilter !== 'All' && space.supportedVehicles.includes(activeFilter)
      ? activeFilter
      : space?.supportedVehicles[0] ?? 'Car';

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(defaultVehicle);

  // Duration selection: default is 2 hrs (solid green per spec)
  const [durationChoice, setDurationChoice] = useState<DurationChoice>(2);
  const [customHours, setCustomHours] = useState<number>(4);

  if (!space) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-slate-500">
        Space not found.
      </div>
    );
  }

  const effectiveDuration = durationChoice === 'custom' ? Math.max(1, customHours) : durationChoice;
  const totalPrice = space.hourlyRateInr * effectiveDuration;

  const handleBookNow = () => {
    createBooking({
      space,
      vehicleType: selectedVehicle,
      durationHours: effectiveDuration,
    });
    setSeekerScreen('confirmation');
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-white overflow-y-auto">
      {/* Top Banner Image with Overlay Controls */}
      <div className="relative w-full h-56 bg-slate-900 shrink-0">
        <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/30" />

        {/* Back Arrow & Favorite Heart */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => setSeekerScreen('map')}
            aria-label="Back to map"
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-800 shadow hover:bg-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(space.id)}
            aria-label="Favorite"
            className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition ${
              isFavorite ? 'text-rose-600' : 'text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Floating Tag */}
        <div className="absolute bottom-3 left-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Host
          </span>
        </div>
      </div>

      {/* Space Details Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Rating */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{space.title}</h2>
          <p className="mt-1 text-xs text-slate-500 leading-normal">{space.address}</p>

          <div className="mt-2.5 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{space.rating > 0 ? space.rating.toFixed(1) : 'New'}</span>
              <span className="text-slate-400 font-normal">
                ({space.reviewCount > 0 ? `${space.reviewCount} reviews` : 'Fresh listing'})
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              {formatDistance(space.distanceMeters)} ({space.walkMinutes} min walk)
            </span>
          </div>
        </div>

        {/* Specs Pill Row */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Dimensions</p>
              <p className="font-semibold text-slate-800 tabular-nums">
                {space.dimensionsFt.width} × {space.dimensionsFt.length} ft
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Availability</p>
              <p className="font-semibold text-slate-800 truncate">{space.availabilityWindow}</p>
            </div>
          </div>
        </div>

        {/* Hourly Rate Display */}
        <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Hourly Rate
          </span>
          <span className="text-2xl font-black text-[#1E6B43] tabular-nums">
            {formatInr(space.hourlyRateInr)} <span className="text-xs font-semibold text-slate-500">/ hour</span>
          </span>
        </div>

        {/* Supported Vehicle Selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Select Vehicle
          </label>
          <div className="grid grid-cols-3 gap-2">
            {space.supportedVehicles.map((v) => {
              const isSelected = selectedVehicle === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedVehicle(v)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-[#1E6B43] bg-[#E8F5EE] text-[#1E6B43]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#1E6B43]" />}
                  <span>{v}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Selection (Default 2 hrs is solid green) */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Parking Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {([1, 2, 3] as const).map((hours) => {
              const isSelected = durationChoice === hours;
              return (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setDurationChoice(hours)}
                  className={`py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                    isSelected
                      ? 'bg-[#1E6B43] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {hours} hr{hours > 1 ? 's' : ''}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setDurationChoice('custom')}
              className={`py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                durationChoice === 'custom'
                  ? 'bg-[#1E6B43] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Hours Numeric Input */}
          {durationChoice === 'custom' && (
            <div className="mt-2.5 flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Hours (1–24):</span>
              <input
                type="number"
                min={1}
                max={24}
                value={customHours}
                onChange={(e) => setCustomHours(Math.max(1, Math.min(24, Number(e.target.value))))}
                className="w-16 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg text-slate-900 text-center"
              />
            </div>
          )}
        </div>

        {/* Live Total Price & Book Now CTA */}
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-medium text-slate-500">
              Total Price ({effectiveDuration} hr{effectiveDuration > 1 ? 's' : ''}):
            </span>
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {formatInr(totalPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBookNow}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-base shadow-lg transition active:scale-[0.98]"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
