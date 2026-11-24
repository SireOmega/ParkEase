import React from 'react';
import { Shield, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { useParkEase } from '../../context/ParkEaseContext';

export const SeekerProfileScreen: React.FC = () => {
  const { setSeekerScreen } = useParkEase();

  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto pb-16">
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200">
        <h1 className="text-lg font-extrabold text-slate-900">My Profile</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* User Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E8F5EE] text-[#1E6B43] flex items-center justify-center font-bold text-xl border-2 border-[#1E6B43]/20">
            PS
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Priya Sharma</h2>
            <p className="text-xs text-slate-500 font-medium">priya.sharma@example.in</p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Seeker • Bengaluru</span>
            </div>
          </div>
        </div>

        {/* Vehicles Registered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            My Vehicles
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Honda Activa 6G</p>
                <p className="text-[10px] text-slate-400">KA 03 HM 4812 • Scooty</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Primary
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Hyundai i20</p>
                <p className="text-[10px] text-slate-400">KA 01 MG 9204 • Car</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Links */}
        <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100 text-xs font-medium text-slate-700">
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Saved Payment Methods (UPI / Cards)</span>
            </div>
            <span className="text-slate-400">›</span>
          </div>
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & Support / VTU Academic Demo</span>
            </div>
            <span className="text-slate-400">›</span>
          </div>
          <div
            onClick={() => setSeekerScreen('splash')}
            className="p-3.5 flex items-center justify-between hover:bg-red-50 text-red-600 cursor-pointer font-bold"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Switch Account / Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
