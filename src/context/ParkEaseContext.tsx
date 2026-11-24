import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  ParkingSpace,
  Booking,
  VehicleType,
  Coordinates,
  AppMode,
  SeekerScreen,
  ProviderScreen,
  VehicleFilter,
  ParkEaseStoreState,
} from '../types/parkease';
import { INITIAL_STORE_STATE, BENGALURU_CENTER } from '../data/seedData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { isStoreState } from '../utils/typeGuards';
import { haversineDistanceMeters, calculateWalkMinutes } from '../utils/geo';

const STORAGE_KEY = 'parkease:v1:state';

export interface CreateBookingParams {
  readonly space: ParkingSpace;
  readonly vehicleType: VehicleType;
  readonly durationHours: number;
}

export interface PublishSpaceParams {
  readonly title: string;
  readonly address: string;
  readonly coordinates: Coordinates;
  readonly dimensionsFt: { readonly length: number; readonly width: number };
  readonly supportedVehicles: readonly VehicleType[];
  readonly hourlyRateInr: number;
  readonly availabilityWindow: string;
  readonly imageUrl: string;
}

export interface ParkEaseContextType {
  // Shared persistent store state
  readonly state: ParkEaseStoreState;

  // Seeker actions
  readonly createBooking: (params: CreateBookingParams) => Booking;
  readonly cancelBooking: (bookingId: string) => void;
  readonly toggleFavorite: (spaceId: string) => void;

  // Provider actions
  readonly acceptBooking: (bookingId: string) => void;
  readonly rejectBooking: (bookingId: string) => void;
  readonly publishSpace: (params: PublishSpaceParams) => ParkingSpace;
  readonly toggleSpaceActive: (spaceId: string) => void;

  // Global / Presenter actions
  readonly resetDemoData: () => void;

  // Local per-tab UI navigation state (not synced across windows, allowing split side-by-side)
  readonly mode: AppMode;
  readonly setMode: (mode: AppMode) => void;
  readonly seekerScreen: SeekerScreen;
  readonly setSeekerScreen: (screen: SeekerScreen) => void;
  readonly providerScreen: ProviderScreen;
  readonly setProviderScreen: (screen: ProviderScreen) => void;
  readonly selectedSpaceId: string | null;
  readonly setSelectedSpaceId: (id: string | null) => void;
  readonly activeFilter: VehicleFilter;
  readonly setActiveFilter: (filter: VehicleFilter) => void;
  readonly confirmedBooking: Booking | null;
  readonly setConfirmedBooking: (b: Booking | null) => void;
  readonly userCoordinates: Coordinates;
  readonly setUserCoordinates: (coords: Coordinates) => void;
  readonly isProviderLoggedIn: boolean;
  readonly setIsProviderLoggedIn: (loggedIn: boolean) => void;
}

const ParkEaseContext = createContext<ParkEaseContextType | null>(null);

export const ParkEaseProvider: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useLocalStorage<ParkEaseStoreState>(
    STORAGE_KEY,
    INITIAL_STORE_STATE,
    isStoreState,
  );

  // Local per-tab UI navigation state
  const [mode, setMode] = useState<AppMode>('seeker');
  const [seekerScreen, setSeekerScreen] = useState<SeekerScreen>('splash');
  const [providerScreen, setProviderScreen] = useState<ProviderScreen>('login');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>('s1');
  const [activeFilter, setActiveFilter] = useState<VehicleFilter>('All');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<Coordinates>(BENGALURU_CENTER);
  const [isProviderLoggedIn, setIsProviderLoggedIn] = useState<boolean>(false);

  // Helper to format schedule times (e.g. "Today, 4:00 PM – 6:00 PM")
  const generateScheduleLabel = useCallback((durationHours: number): string => {
    const now = new Date();
    // Start at next round hour or current
    const startHour = (now.getHours() + 1) % 24;
    const endHour = (startHour + durationHours) % 24;

    const formatHour = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 || 12;
      return `${displayH}:00 ${ampm}`;
    };

    return `Today, ${formatHour(startHour)} – ${formatHour(endHour)}`;
  }, []);

  const createBooking = useCallback(
    ({ space, vehicleType, durationHours }: CreateBookingParams): Booking => {
      const currentCounter = state.bookingCounter;
      const nextCounter = currentCounter + 1;
      const bookingId = `#PE${currentCounter}`;
      const totalPrice = space.hourlyRateInr * durationHours;

      const now = new Date();
      const currentAmPm = now.getHours() >= 12 ? 'PM' : 'AM';
      const hours12 = now.getHours() % 12 || 12;
      const mins = String(now.getMinutes()).padStart(2, '0');
      const requestedAt = `${hours12}:${mins} ${currentAmPm}`;

      const newBooking: Booking = {
        id: bookingId,
        spaceId: space.id,
        spaceTitle: space.title,
        vehicleType,
        durationHours,
        totalPriceInr: totalPrice,
        scheduleLabel: generateScheduleLabel(durationHours),
        requestedAtLabel: requestedAt,
        status: 'Pending',
      };

      setState((prev) => ({
        ...prev,
        bookings: [newBooking, ...prev.bookings],
        seekerBookingIds: [bookingId, ...prev.seekerBookingIds],
        bookingCounter: nextCounter,
      }));

      setConfirmedBooking(newBooking);
      return newBooking;
    },
    [state.bookingCounter, generateScheduleLabel, setState],
  );

  const acceptBooking = useCallback(
    (bookingId: string) => {
      setState((prev) => {
        const target = prev.bookings.find((b) => b.id === bookingId);
        if (!target || target.status !== 'Pending') {
          return prev;
        }

        const updatedBookings = prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'Confirmed' as const } : b,
        );

        const newEarnings = prev.providerStats.totalEarningsInr + target.totalPriceInr;
        const newTotalBookings = prev.providerStats.totalBookings + 1;
        const newUpcoming = prev.providerStats.upcomingCount + 1;

        const newActivity = [
          {
            id: `act-${Date.now()}`,
            text: `+ ₹${target.totalPriceInr} • just now`,
            timestampLabel: 'just now',
          },
          ...prev.recentActivity,
        ];

        return {
          ...prev,
          bookings: updatedBookings,
          providerStats: {
            ...prev.providerStats,
            totalEarningsInr: newEarnings,
            totalBookings: newTotalBookings,
            upcomingCount: newUpcoming,
          },
          recentActivity: newActivity,
        };
      });
    },
    [setState],
  );

  const rejectBooking = useCallback(
    (bookingId: string) => {
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'Rejected' as const } : b,
        ),
      }));
    },
    [setState],
  );

  const cancelBooking = useCallback(
    (bookingId: string) => {
      setState((prev) => {
        const target = prev.bookings.find((b) => b.id === bookingId);
        if (!target) return prev;

        const wasConfirmed = target.status === 'Confirmed';
        const updatedBookings = prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b,
        );

        let nextStats = prev.providerStats;
        let nextActivity = prev.recentActivity;

        if (wasConfirmed) {
          nextStats = {
            ...prev.providerStats,
            totalEarningsInr: Math.max(0, prev.providerStats.totalEarningsInr - target.totalPriceInr),
            upcomingCount: Math.max(0, prev.providerStats.upcomingCount - 1),
          };
          nextActivity = [
            {
              id: `act-${Date.now()}`,
              text: `- ₹${target.totalPriceInr} • Cancelled`,
              timestampLabel: 'just now',
            },
            ...prev.recentActivity,
          ];
        }

        return {
          ...prev,
          bookings: updatedBookings,
          providerStats: nextStats,
          recentActivity: nextActivity,
        };
      });
    },
    [setState],
  );

  const publishSpace = useCallback(
    (params: PublishSpaceParams): ParkingSpace => {
      const distance = haversineDistanceMeters(userCoordinates, params.coordinates);
      const walk = calculateWalkMinutes(distance);

      const newId = `s${state.spaces.length + 1}`;
      const newSpace: ParkingSpace = {
        id: newId,
        title: params.title,
        address: params.address,
        coordinates: params.coordinates,
        distanceMeters: distance,
        walkMinutes: walk,
        dimensionsFt: params.dimensionsFt,
        supportedVehicles: params.supportedVehicles,
        hourlyRateInr: params.hourlyRateInr,
        rating: 0,
        reviewCount: 0,
        imageUrl: params.imageUrl,
        availabilityWindow: params.availabilityWindow,
        isActive: true,
      };

      setState((prev) => ({
        ...prev,
        spaces: [newSpace, ...prev.spaces],
      }));

      return newSpace;
    },
    [userCoordinates, state.spaces.length, setState],
  );

  const toggleSpaceActive = useCallback(
    (spaceId: string) => {
      setState((prev) => ({
        ...prev,
        spaces: prev.spaces.map((s) => (s.id === spaceId ? { ...s, isActive: !s.isActive } : s)),
      }));
    },
    [setState],
  );

  const toggleFavorite = useCallback(
    (spaceId: string) => {
      setState((prev) => {
        const exists = prev.favoriteSpaceIds.includes(spaceId);
        return {
          ...prev,
          favoriteSpaceIds: exists
            ? prev.favoriteSpaceIds.filter((id) => id !== spaceId)
            : [...prev.favoriteSpaceIds, spaceId],
        };
      });
    },
    [setState],
  );

  const resetDemoData = useCallback(() => {
    setState(INITIAL_STORE_STATE);
    setConfirmedBooking(null);
    setSelectedSpaceId('s1');
    setActiveFilter('All');
    // Return current tab to start of its mode
    if (mode === 'seeker') {
      setSeekerScreen('splash');
    } else {
      setProviderScreen('login');
      setIsProviderLoggedIn(false);
    }
  }, [setState, mode]);

  const contextValue = useMemo<ParkEaseContextType>(
    () => ({
      state,
      createBooking,
      cancelBooking,
      toggleFavorite,
      acceptBooking,
      rejectBooking,
      publishSpace,
      toggleSpaceActive,
      resetDemoData,
      mode,
      setMode,
      seekerScreen,
      setSeekerScreen,
      providerScreen,
      setProviderScreen,
      selectedSpaceId,
      setSelectedSpaceId,
      activeFilter,
      setActiveFilter,
      confirmedBooking,
      setConfirmedBooking,
      userCoordinates,
      setUserCoordinates,
      isProviderLoggedIn,
      setIsProviderLoggedIn,
    }),
    [
      state,
      createBooking,
      cancelBooking,
      toggleFavorite,
      acceptBooking,
      rejectBooking,
      publishSpace,
      toggleSpaceActive,
      resetDemoData,
      mode,
      seekerScreen,
      providerScreen,
      selectedSpaceId,
      activeFilter,
      confirmedBooking,
      userCoordinates,
      isProviderLoggedIn,
    ],
  );

  return <ParkEaseContext.Provider value={contextValue}>{children}</ParkEaseContext.Provider>;
};

export function useParkEase(): ParkEaseContextType {
  const context = useContext(ParkEaseContext);
  if (!context) {
    throw new Error('useParkEase must be used within a ParkEaseProvider');
  }
  return context;
}
