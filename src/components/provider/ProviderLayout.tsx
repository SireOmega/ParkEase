import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';
import { ParkEaseLogo } from '../ui/ParkEaseLogo';
import { useParkEase } from '../../context/ParkEaseContext';
import type { ProviderScreen } from '../../types/parkease';

interface ProviderLayoutProps {
  readonly children: React.ReactNode;
}

export const ProviderLayout: React.FC<ProviderLayoutProps> = ({ children }) => {
  const { providerScreen, setProviderScreen, setIsProviderLoggedIn } = useParkEase();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: readonly { readonly id: ProviderScreen; readonly label: string; readonly icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'listings', label: 'My Listings', icon: <Car className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    setIsProviderLoggedIn(false);
    setProviderScreen('login');
  };

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar: #1E3A5F, collapsible on narrow screens */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1E3A5F] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header with ParkEase Branding */}
          <div className="p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <ParkEaseLogo size="sm" />
              <span className="font-extrabold text-lg tracking-tight">
                Park<span className="text-emerald-400">Ease</span>{' '}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 ml-1">
                  Provider
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = providerScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setProviderScreen(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Add Space Shortcut & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => {
              setProviderScreen('wizard');
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Space</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-500/20 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-800 text-sm">Provider Portal</span>
          <div className="w-8" />
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};
