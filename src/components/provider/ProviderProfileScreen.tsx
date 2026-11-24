import React from 'react';
import { useParkEase } from '../../context/ParkEaseContext';
import { ShieldCheck, Building, CreditCard, Award, LogOut } from 'lucide-react';

export const ProviderProfileScreen: React.FC = () => {
  const { state, setIsProviderLoggedIn, setProviderScreen } = useParkEase();

  const handleLogout = () => {
    setIsProviderLoggedIn(false);
    setProviderScreen('login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Host Profile</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Manage host identity, payout preferences, and platform credentials.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-2xl border-4 border-slate-100 shadow-sm">
          R
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Rohan</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5EE] text-[#1E6B43] border border-[#B7E4C7]">
              <ShieldCheck className="w-3.5 h-3.5" /> Superhost
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-0.5">rohan.blr@parkease.in</p>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900">{state.spaces.length}</span> Listings
            </div>
            <span>•</span>
            <div>
              <span className="font-bold text-slate-900">★ 4.8</span> Rating
            </div>
            <span>•</span>
            <div>
              <span className="font-bold text-slate-900">100%</span> Response Rate
            </div>
          </div>
        </div>
      </div>

      {/* Payout & Bank Info */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Direct Payout Account (Demo)
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">HDFC Bank — Indiranagar Branch</p>
              <p className="text-[11px] text-slate-400 font-mono">A/C: ••••••••••4812 • IFSC: HDFC0000184</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Active
          </span>
        </div>
      </div>

      {/* Host Badges */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Host Accreditations
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-800">VTU Classroom Demo Partner</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-[#1E6B43]" />
            <span className="font-semibold text-slate-800">Instant UPI Payouts</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout of Provider Portal</span>
        </button>
      </div>
    </div>
  );
};
