import React, { useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useParkEase } from '../../context/ParkEaseContext';
import { BENGALURU_CENTER } from '../../data/seedData';
import { isWithinBengaluru } from '../../utils/geo';

export const LocationPromptDialog: React.FC = () => {
  const { setSeekerScreen, setUserCoordinates } = useParkEase();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const handleAllow = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // Bounding box check: if outside Bengaluru, fallback to Central Bengaluru center
          if (isWithinBengaluru(userPos)) {
            setUserCoordinates(userPos);
          } else {
            setUserCoordinates(BENGALURU_CENTER);
          }
          proceedToMap();
        },
        () => {
          // Denied or timed out -> Fallback to Central Bengaluru
          setUserCoordinates(BENGALURU_CENTER);
          proceedToMap();
        },
        { timeout: 5000, enableHighAccuracy: false },
      );
    } else {
      setUserCoordinates(BENGALURU_CENTER);
      proceedToMap();
    }
  };

  const handleDeny = () => {
    setUserCoordinates(BENGALURU_CENTER);
    proceedToMap();
  };

  const proceedToMap = () => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
    setSeekerScreen('map');
  };

  return (
    <div className="relative flex-1 w-full h-full bg-slate-900 flex items-center justify-center">
      {/* Darkened Street Map Background Preview */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#1E6B43_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Accessible native modal dialog per Modern Web Guidance */}
      <dialog
        ref={dialogRef}
        aria-labelledby="location-dialog-title"
        className="w-[90%] max-w-[340px] rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm m-auto"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] text-[#1E6B43] flex items-center justify-center mb-4">
            <Navigation className="w-7 h-7" />
          </div>

          <h2 id="location-dialog-title" className="text-lg font-bold text-slate-900">
            Allow Location Access?
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Allow ParkEase to access your location? This helps us show you nearby parking spaces.
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Bengaluru (Central)</span>
          </div>

          <div className="mt-6 w-full flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAllow}
              autoFocus
              className="w-full py-3 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white font-semibold text-sm shadow transition active:scale-[0.98]"
            >
              Allow
            </button>
            <button
              type="button"
              onClick={handleDeny}
              className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-medium text-sm transition"
            >
              Do Not Allow
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
