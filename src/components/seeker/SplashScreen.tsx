import React from 'react';
import { ParkEaseLogo } from '../ui/ParkEaseLogo';
import { useParkEase } from '../../context/ParkEaseContext';
import { ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setSeekerScreen } = useParkEase();

  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30">
      {/* Center Branding Block */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6 transform transition hover:scale-105 duration-300">
          <ParkEaseLogo size="xl" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
          Park<span className="text-[#1E6B43]">Ease</span>
        </h1>

        <p className="mt-3 text-sm font-medium text-[#64748B] max-w-[260px] leading-relaxed">
          Find a space. Park with ease. Earn from your space.
        </p>

        {/* Bengaluru City Badge */}
        <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5EE] border border-[#B7E4C7] text-xs font-semibold text-[#1E6B43]">
          <span className="w-2 h-2 rounded-full bg-[#1E6B43] animate-pulse" />
          Bengaluru, India
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full flex flex-col gap-3 pb-4">
        <button
          type="button"
          onClick={() => setSeekerScreen('location')}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1E6B43] hover:bg-[#165634] text-white font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => setSeekerScreen('location')}
          className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#1E6B43] text-[#1E6B43] hover:bg-[#E8F5EE] font-semibold text-base transition-colors active:scale-[0.98]"
        >
          Login
        </button>
      </div>
    </div>
  );
};
