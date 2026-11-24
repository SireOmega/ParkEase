import React, { useState } from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { ParkEaseLogo } from '../ui/ParkEaseLogo';
import { DRIVEWAY_PRESETS } from '../../data/seedData';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const ProviderLoginScreen: React.FC = () => {
  const { setIsProviderLoggedIn, setProviderScreen } = useParkEase();
  const [email, setEmail] = useState('rohan.blr@parkease.in');
  const [password, setPassword] = useState('demo-password-2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProviderLoggedIn(true);
    setProviderScreen('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4 bg-slate-100">
      {/* Split Card: Driveway photo left, Login form right */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Driveway Illustration & Value Proposition */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] text-white">
          <div>
            <div className="flex items-center gap-2">
              <ParkEaseLogo size="sm" />
              <span className="font-extrabold text-lg tracking-tight">
                Park<span className="text-emerald-400">Ease</span>
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-black leading-snug">
              Monetize your empty driveway or porch in Bengaluru.
            </h2>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              Accept verified parking requests from nearby commuters, track your earnings in real
              time, and manage spaces with total ease.
            </p>
          </div>

          {/* Driveway Illustration Container */}
          <div className="my-6 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-slate-800">
            <img
              src={DRIVEWAY_PRESETS[0].dataUri}
              alt="Driveway illustration"
              className="w-full h-44 object-cover"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/60">
            <span>VTU Academic Demonstration</span>
            <span>Bengaluru, India</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <div className="md:hidden mb-4">
              <ParkEaseLogo size="md" showWordmark />
            </div>
            <h1 className="text-2xl font-black text-slate-900">ParkEase Provider Login</h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Demo credentials pre-filled. Click Login to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan.blr@parkease.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E6B43]/50 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#1E6B43] hover:bg-[#165634] text-white font-bold text-sm shadow-lg shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Demo Account: Rohan</span>
            <span>Pre-filled & Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
