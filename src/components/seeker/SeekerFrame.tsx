import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface SeekerFrameProps {
  readonly children: React.ReactNode;
}

export const SeekerFrame: React.FC<SeekerFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-44px)] sm:min-h-[calc(100vh-56px)] p-0 sm:p-6 bg-slate-900 sm:bg-slate-100">
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:max-h-[844px] sm:w-[390px] bg-[#F8FAFC] rounded-none sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-hidden flex flex-col">
        {/* Mobile Mock Notch / Dynamic Island & Status Bar (shown only on desktop frame) */}
        <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-slate-800 text-xs font-semibold z-30 select-none bg-transparent">
          <span>9:41</span>
          {/* Subtle Dynamic Island pill */}
          <div className="w-24 h-4 bg-slate-900 rounded-full" />
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Mobile Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Mobile Home Bar Indicator (desktop frame only) */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-transparent z-30 select-none">
          <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
