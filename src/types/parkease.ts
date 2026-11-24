export type VehicleType = 'Car' | 'Scooty' | 'Bike';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed';

export interface Coordinates {
  readonly lat: number;
  readonly lng: number;
}

export interface ParkingDimensionsFt {
  readonly length: number;
  readonly width: number;
}

export interface ParkingSpace {
  readonly id: string;
  readonly title: string;
  readonly address: string;
  readonly coordinates: Coordinates;
  readonly distanceMeters: number;
  readonly walkMinutes: number;
  readonly dimensionsFt: ParkingDimensionsFt;
  readonly supportedVehicles: readonly VehicleType[];
  readonly hourlyRateInr: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly imageUrl: string;
  readonly availabilityWindow: string;
  readonly isActive: boolean;
}

export interface Booking {
  readonly id: string;
  readonly spaceId: string;
  readonly spaceTitle: string;
  readonly vehicleType: VehicleType;
  readonly durationHours: number;
  readonly totalPriceInr: number;
  readonly scheduleLabel: string;
  readonly requestedAtLabel: string;
  readonly status: BookingStatus;
}

// Auxiliary types for application navigation and state
export type AppMode = 'seeker' | 'provider';

export type SeekerScreen =
  | 'splash'
  | 'location'
  | 'map'
  | 'details'
  | 'confirmation'
  | 'bookings'
  | 'profile';

export type ProviderScreen =
  | 'login'
  | 'dashboard'
  | 'wizard'
  | 'bookings'
  | 'earnings'
  | 'listings'
  | 'profile';

export type VehicleFilter = 'All' | VehicleType;

export interface MonthlyEarningPoint {
  readonly month: string;
  readonly amount: number;
}

export interface DailyEarningBar {
  readonly label: string;
  readonly amount: number;
}

export interface ActivityItem {
  readonly id: string;
  readonly text: string;
  readonly timestampLabel: string;
}

export interface ProviderStats {
  readonly totalBookings: number;
  readonly totalEarningsInr: number;
  readonly upcomingCount: number;
  readonly growthBadge: string;
}

export interface ParkEaseStoreState {
  readonly spaces: readonly ParkingSpace[];
  readonly bookings: readonly Booking[];
  readonly seekerBookingIds: readonly string[];
  readonly favoriteSpaceIds: readonly string[];
  readonly providerStats: ProviderStats;
  readonly recentActivity: readonly ActivityItem[];
  readonly monthlyEarnings: readonly MonthlyEarningPoint[];
  readonly dailyEarnings: readonly DailyEarningBar[];
  readonly bookingCounter: number;
}
