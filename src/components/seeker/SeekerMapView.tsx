import React, { useState, useMemo } from 'react';
import { Menu, Bell, Search, Star, ArrowRight } from 'lucide-react';
import { ParkEaseLogo } from '../ui/ParkEaseLogo';
import { InteractiveSvgMap } from '../map/InteractiveSvgMap';
import { useParkEase } from '../../context/ParkEaseContext';
import { formatDistance, formatInr } from '../../utils/geo';
import type { VehicleFilter, ParkingSpace } from '../../types/parkease';

const FILTER_OPTIONS: readonly VehicleFilter[] = ['All', 'Car', 'Scooty', 'Bike'];

export const SeekerMapView: React.FC = () => {
  const {
    state,
    selectedSpaceId,
    setSelectedSpaceId,
    activeFilter,
    setActiveFilter,
    setSeekerScreen,
    userCoordinates,
  } = useParkEase();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter spaces based on active filter and search query
  const filteredSpaces = useMemo(() => {
    return state.spaces.filter((space) => {
      if (!space.isActive) return false;

      // Filter by vehicle type
      if (activeFilter !== 'All' && !space.supportedVehicles.includes(activeFilter)) {
        return false;
      }

      // Filter by search query (title or address)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return space.title.toLowerCase().includes(q) || space.address.toLowerCase().includes(q);
      }

      return true;
    });
  }, [state.spaces, activeFilter, searchQuery]);

  // Selected space for floating preview card (defaults to s1 "Green View Parking" if present)
  const activeSpace: ParkingSpace | undefined = useMemo(() => {
    const found = state.spaces.find((s) => s.id === selectedSpaceId);
    if (found) return found;
    return filteredSpaces[0] ?? state.spaces[0];
  }, [state.spaces, selectedSpaceId, filteredSpaces]);

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <button
          type="button"
          aria-label="Menu"
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer">
          <ParkEaseLogo size="sm" showWordmark />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
        </button>
      </header>

      {/* Floating Controls: Search & Vehicle Filter Pills */}
      <div className="absolute top-16 inset-x-0 z-20 px-3.5 flex flex-col gap-2 pointer-events-none">
        {/* Search Input */}
        <div className="relative w-full pointer-events-auto">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-slate-900 text-xs font-medium placeholder-slate-400 shadow-md border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto no-scrollbar">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs border ${
                  isActive
                    ? 'bg-[#E8F5EE] text-[#1E6B43] border-[#A7F3D0] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {filter === 'All' ? 'All Spaces' : filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Engine */}
      <div className="flex-1 w-full h-full relative z-10">
        <InteractiveSvgMap
          spaces={filteredSpaces}
          selectedSpaceId={activeSpace?.id ?? null}
          onSelectSpace={(id) => setSelectedSpaceId(id)}
          userCoordinates={userCoordinates}
        />
      </div>

      {/* Floating Preview Card (Floating above bottom navigation) */}
      {activeSpace && (
        <div className="absolute bottom-16 inset-x-3.5 z-20 pointer-events-auto">
          <div
            onClick={() => {
              setSelectedSpaceId(activeSpace.id);
              setSeekerScreen('details');
            }}
            className="bg-white rounded-2xl p-3 shadow-xl border border-slate-200/90 flex items-center gap-3.5 cursor-pointer hover:border-[#1E6B43] transition-all transform active:scale-[0.99]"
          >
            {/* Space Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
              <img
                src={activeSpace.imageUrl}
                alt={activeSpace.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{activeSpace.title}</h3>
                <div className="flex items-center gap-0.5 text-amber-500 shrink-0 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-slate-800">{activeSpace.rating > 0 ? activeSpace.rating.toFixed(1) : 'New'}</span>
                </div>
              </div>

              <p className="mt-1 text-xs text-slate-500 font-medium">
                {formatDistance(activeSpace.distanceMeters)} •{' '}
                <span className="font-bold text-[#1E6B43] tabular-nums">
                  {formatInr(activeSpace.hourlyRateInr)}/hr
                </span>
              </p>

              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>{activeSpace.dimensionsFt.width}×{activeSpace.dimensionsFt.length} ft</span>
                <span className="text-[#1E6B43] font-semibold inline-flex items-center gap-1 group">
                  Book <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
