import React from 'react';
import { MapPin, CalendarDays, User } from 'lucide-react';
import { useParkEase } from '../../context/ParkEaseContext';

export const SeekerBottomNav: React.FC = () => {
  const { seekerScreen, setSeekerScreen } = useParkEase();

  // Hidden on Splash, Location, Details, and Confirmation screens
  const isHidden =
    seekerScreen === 'splash' ||
    seekerScreen === 'location' ||
    seekerScreen === 'details' ||
    seekerScreen === 'confirmation';

  if (isHidden) {
    return null;
  }

  const isHome = seekerScreen === 'map';
  const isBookings = seekerScreen === 'bookings';
  const isProfile = seekerScreen === 'profile';

  return (
    <nav
      aria-label="Seeker navigation"
      className="absolute bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-6 flex items-center justify-around shadow-lg"
    >
      {/* Home / Map Tab */}
      <button
        type="button"
        onClick={() => setSeekerScreen('map')}
        className={`flex flex-col items-center gap-1 transition ${
          isHome ? 'text-[#1E6B43]' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <MapPin className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[11px] font-semibold">Home</span>
      </button>

      {/* Bookings Tab */}
      <button
        type="button"
        onClick={() => setSeekerScreen('bookings')}
        className={`flex flex-col items-center gap-1 transition ${
          isBookings ? 'text-[#1E6B43]' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <CalendarDays className={`w-5 h-5 ${isBookings ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[11px] font-semibold">Bookings</span>
      </button>

      {/* Profile Tab */}
      <button
        type="button"
        onClick={() => setSeekerScreen('profile')}
        className={`flex flex-col items-center gap-1 transition ${
          isProfile ? 'text-[#1E6B43]' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className={`w-5 h-5 ${isProfile ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[11px] font-semibold">Profile</span>
      </button>
    </nav>
  );
};
