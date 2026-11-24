import React from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { Smartphone, LayoutDashboard, MapPin, Gauge, RotateCcw, Zap } from 'lucide-react';
import { BENGALURU_CENTER } from '../../data/seedData';

export const PresenterBar: React.FC = () => {
  const {
    mode,
    setMode,
    setSeekerScreen,
    setUserCoordinates,
    setProviderScreen,
    setIsProviderLoggedIn,
    resetDemoData,
  } = useParkEase();

  // Shortcut: Seeker Map (skips splash/login, sets coordinates, goes directly to map)
  const handleSeekerMapShortcut = () => {
    setMode('seeker');
    setUserCoordinates(BENGALURU_CENTER);
    setSeekerScreen('map');
  };

  // Shortcut: Provider Dashboard (skips login, sets logged-in flag, goes directly to dashboard)
  const handleProviderDashboardShortcut = () => {
    setMode('provider');
    setIsProviderLoggedIn(true);
    setProviderScreen('dashboard');
  };

  return (
    <aside
      aria-label="Presenter control bar"
      className="sticky top-0 inset-x-0 z-50 bg-[#0F172A] text-white border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md select-none text-xs"
    >
      {/* Left: Mode Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          VTU Presenter:
        </span>

        <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700/80">
          <button
            type="button"
            onClick={() => setMode('seeker')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md font-bold transition ${
              mode === 'seeker'
                ? 'bg-[#1E6B43] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Parking Seeker App (Mobile View)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('provider')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md font-bold transition ${
              mode === 'provider'
                ? 'bg-[#1E3A5F] text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Parking Provider Portal (Dashboard View)</span>
          </button>
        </div>
      </div>

      {/* Right: Quick Runbook Shortcuts & Deterministic Reset */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Shortcuts:</span>

        <button
          type="button"
          onClick={handleSeekerMapShortcut}
          title="Skip splash and location dialog to Seeker Map"
          className="flex items-center gap-1 py-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold transition"
        >
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>Seeker Map</span>
        </button>

        <button
          type="button"
          onClick={handleProviderDashboardShortcut}
          title="Skip login directly to Provider Dashboard"
          className="flex items-center gap-1 py-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold transition"
        >
          <Gauge className="w-3 h-3 text-blue-400" />
          <span>Provider Dashboard</span>
        </button>

        <button
          type="button"
          onClick={resetDemoData}
          title="Re-seed all data to pristine initial state (syncs across both windows)"
          className="flex items-center gap-1 py-1 px-2.5 rounded-md bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-[11px] font-extrabold transition active:scale-95"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>

        <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded ml-1">
          <Zap className="w-2.5 h-2.5" />
          <span>Live Sync Active</span>
        </div>
      </div>
    </aside>
  );
};
