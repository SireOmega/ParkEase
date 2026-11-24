import React from 'react';
import { useParkEase } from './context/ParkEaseContext';
import { PresenterBar } from './components/presenter/PresenterBar';
import { SeekerFrame } from './components/seeker/SeekerFrame';
import { SplashScreen } from './components/seeker/SplashScreen';
import { LocationPromptDialog } from './components/seeker/LocationPromptDialog';
import { SeekerMapView } from './components/seeker/SeekerMapView';
import { SpaceDetailsScreen } from './components/seeker/SpaceDetailsScreen';
import { BookingConfirmationScreen } from './components/seeker/BookingConfirmationScreen';
import { MyBookingsScreen } from './components/seeker/MyBookingsScreen';
import { SeekerProfileScreen } from './components/seeker/SeekerProfileScreen';
import { SeekerBottomNav } from './components/seeker/SeekerBottomNav';

import { ProviderLayout } from './components/provider/ProviderLayout';
import { ProviderLoginScreen } from './components/provider/ProviderLoginScreen';
import { ProviderDashboardScreen } from './components/provider/ProviderDashboardScreen';
import { AddSpaceWizardScreen } from './components/provider/AddSpaceWizardScreen';
import { ManageBookingsScreen } from './components/provider/ManageBookingsScreen';
import { ProviderEarningsScreen } from './components/provider/ProviderEarningsScreen';
import { ProviderListingsScreen } from './components/provider/ProviderListingsScreen';
import { ProviderProfileScreen } from './components/provider/ProviderProfileScreen';

export const App: React.FC = () => {
  const { mode, seekerScreen, providerScreen, isProviderLoggedIn } = useParkEase();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 font-sans selection:bg-[#E8F5EE] selection:text-[#1E6B43]">
      {/* Discreet Presenter Control Bar (outside app viewport) */}
      <PresenterBar />

      {/* Main View Area based on active mode */}
      <div className="flex-1 flex flex-col">
        {mode === 'seeker' ? (
          <SeekerFrame>
            {seekerScreen === 'splash' && <SplashScreen />}
            {seekerScreen === 'location' && <LocationPromptDialog />}
            {seekerScreen === 'map' && <SeekerMapView />}
            {seekerScreen === 'details' && <SpaceDetailsScreen />}
            {seekerScreen === 'confirmation' && <BookingConfirmationScreen />}
            {seekerScreen === 'bookings' && <MyBookingsScreen />}
            {seekerScreen === 'profile' && <SeekerProfileScreen />}
            <SeekerBottomNav />
          </SeekerFrame>
        ) : !isProviderLoggedIn && providerScreen === 'login' ? (
          <ProviderLoginScreen />
        ) : (
          <ProviderLayout>
            {providerScreen === 'dashboard' && <ProviderDashboardScreen />}
            {providerScreen === 'wizard' && <AddSpaceWizardScreen />}
            {providerScreen === 'bookings' && <ManageBookingsScreen />}
            {providerScreen === 'earnings' && <ProviderEarningsScreen />}
            {providerScreen === 'listings' && <ProviderListingsScreen />}
            {providerScreen === 'profile' && <ProviderProfileScreen />}
          </ProviderLayout>
        )}
      </div>
    </div>
  );
};
