import React from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { formatInr } from '../../utils/geo';
import { Plus, Star, MapPin, Maximize2, Clock } from 'lucide-react';

export const ProviderListingsScreen: React.FC = () => {
  const { state, toggleSpaceActive, setProviderScreen } = useParkEase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Parking Spaces</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Manage your registered driveways, bays, and availability across Bengaluru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setProviderScreen('wizard')}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-xs shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.spaces.map((space) => {
          return (
            <div
              key={space.id}
              className={`rounded-2xl border p-5 transition bg-white shadow-xs flex flex-col justify-between ${
                space.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start gap-4">
                  {/* Space Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src={space.imageUrl}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{space.title}</h3>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-slate-700">
                          {space.rating > 0 ? space.rating.toFixed(1) : 'New'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-start gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{space.address}</span>
                    </div>

                    <p className="mt-2 text-xs font-bold text-[#1E6B43] tabular-nums">
                      {formatInr(space.hourlyRateInr)} / hour
                    </p>
                  </div>
                </div>

                {/* Specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {space.dimensionsFt.width} × {space.dimensionsFt.length} ft
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{space.availabilityWindow}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Vehicles & Active Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {space.supportedVehicles.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700"
                    >
                      {v}
                    </span>
                  ))}
                </div>

                {/* Active Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {space.isActive ? 'Active' : 'Paused'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSpaceActive(space.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      space.isActive ? 'bg-[#1E6B43]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        space.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
