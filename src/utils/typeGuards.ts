import type {
  ParkingSpace,
  Booking,
  VehicleType,
  BookingStatus,
  Coordinates,
  ParkingDimensionsFt,
  ParkEaseStoreState,
  ProviderStats,
} from '../types/parkease';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isVehicleType(value: unknown): value is VehicleType {
  return value === 'Car' || value === 'Scooty' || value === 'Bike';
}

export function isBookingStatus(value: unknown): value is BookingStatus {
  return (
    value === 'Pending' ||
    value === 'Confirmed' ||
    value === 'Rejected' ||
    value === 'Cancelled' ||
    value === 'Completed'
  );
}

export function isCoordinates(value: unknown): value is Coordinates {
  if (!isRecord(value)) return false;
  return typeof value['lat'] === 'number' && typeof value['lng'] === 'number';
}

export function isParkingDimensionsFt(value: unknown): value is ParkingDimensionsFt {
  if (!isRecord(value)) return false;
  return typeof value['length'] === 'number' && typeof value['width'] === 'number';
}

export function isParkingSpace(value: unknown): value is ParkingSpace {
  if (!isRecord(value)) return false;

  const {
    id,
    title,
    address,
    coordinates,
    distanceMeters,
    walkMinutes,
    dimensionsFt,
    supportedVehicles,
    hourlyRateInr,
    rating,
    reviewCount,
    imageUrl,
    availabilityWindow,
    isActive,
  } = value;

  return (
    typeof id === 'string' &&
    typeof title === 'string' &&
    typeof address === 'string' &&
    isCoordinates(coordinates) &&
    typeof distanceMeters === 'number' &&
    typeof walkMinutes === 'number' &&
    isParkingDimensionsFt(dimensionsFt) &&
    Array.isArray(supportedVehicles) &&
    supportedVehicles.every(isVehicleType) &&
    typeof hourlyRateInr === 'number' &&
    typeof rating === 'number' &&
    typeof reviewCount === 'number' &&
    typeof imageUrl === 'string' &&
    typeof availabilityWindow === 'string' &&
    typeof isActive === 'boolean'
  );
}

export function isBooking(value: unknown): value is Booking {
  if (!isRecord(value)) return false;

  const {
    id,
    spaceId,
    spaceTitle,
    vehicleType,
    durationHours,
    totalPriceInr,
    scheduleLabel,
    requestedAtLabel,
    status,
  } = value;

  return (
    typeof id === 'string' &&
    typeof spaceId === 'string' &&
    typeof spaceTitle === 'string' &&
    isVehicleType(vehicleType) &&
    typeof durationHours === 'number' &&
    typeof totalPriceInr === 'number' &&
    typeof scheduleLabel === 'string' &&
    typeof requestedAtLabel === 'string' &&
    isBookingStatus(status)
  );
}

export function isProviderStats(value: unknown): value is ProviderStats {
  if (!isRecord(value)) return false;
  const { totalBookings, totalEarningsInr, upcomingCount, growthBadge } = value;
  return (
    typeof totalBookings === 'number' &&
    typeof totalEarningsInr === 'number' &&
    typeof upcomingCount === 'number' &&
    typeof growthBadge === 'string'
  );
}

export function isStoreState(value: unknown): value is ParkEaseStoreState {
  if (!isRecord(value)) return false;

  const {
    spaces,
    bookings,
    seekerBookingIds,
    favoriteSpaceIds,
    providerStats,
    recentActivity,
    monthlyEarnings,
    dailyEarnings,
    bookingCounter,
  } = value;

  return (
    Array.isArray(spaces) &&
    spaces.every(isParkingSpace) &&
    Array.isArray(bookings) &&
    bookings.every(isBooking) &&
    Array.isArray(seekerBookingIds) &&
    seekerBookingIds.every((id) => typeof id === 'string') &&
    Array.isArray(favoriteSpaceIds) &&
    favoriteSpaceIds.every((id) => typeof id === 'string') &&
    isProviderStats(providerStats) &&
    Array.isArray(recentActivity) &&
    Array.isArray(monthlyEarnings) &&
    Array.isArray(dailyEarnings) &&
    typeof bookingCounter === 'number'
  );
}
