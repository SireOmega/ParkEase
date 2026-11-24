import type { Coordinates } from '../types/parkease';
import { BENGALURU_CENTER } from '../data/seedData';

/**
 * Calculates the great-circle distance between two points in meters using the Haversine formula.
 */
export function haversineDistanceMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const phi1 = toRad(coord1.lat);
  const phi2 = toRad(coord2.lat);
  const deltaPhi = toRad(coord2.lat - coord1.lat);
  const deltaLambda = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Computes walking minutes from distance in meters.
 * Assumes average walking speed ~ 80 meters/minute (approx 4.8 km/h).
 * Matches the spec: 350m -> 5m, 550m -> 7m, 850m -> 11m, 1100m -> 14m.
 */
export function calculateWalkMinutes(distanceMeters: number): number {
  return Math.max(1, Math.ceil(distanceMeters / 80));
}

/**
 * Checks if a given coordinate lies reasonably within the greater Bengaluru metropolitan area.
 */
export function isWithinBengaluru(coord: Coordinates): boolean {
  return (
    coord.lat >= 12.75 &&
    coord.lat <= 13.20 &&
    coord.lng >= 77.40 &&
    coord.lng <= 77.80
  );
}

/**
 * Fallback coordinate locator for wizard-entered locations.
 * Looks up known Bengaluru neighbourhood keywords or applies deterministic offset.
 */
export function deriveCoordinatesForLocation(locationQuery: string): Coordinates {
  const q = locationQuery.toLowerCase();

  if (q.includes('indiranagar')) {
    return { lat: 12.9784, lng: 77.6408 };
  }
  if (q.includes('koramangala')) {
    return { lat: 12.9352, lng: 77.6245 };
  }
  if (q.includes('jayanagar')) {
    return { lat: 12.9308, lng: 77.5838 };
  }
  if (q.includes('whitefield')) {
    return { lat: 12.9698, lng: 77.7499 };
  }
  if (q.includes('mg road') || q.includes('brigade')) {
    return { lat: 12.9756, lng: 77.6066 };
  }
  if (q.includes('malleshwaram')) {
    return { lat: 13.0031, lng: 77.5643 };
  }
  if (q.includes('hsr') || q.includes('sector')) {
    return { lat: 12.9121, lng: 77.6446 };
  }
  if (q.includes('jp nagar')) {
    return { lat: 12.9063, lng: 77.5857 };
  }

  // Deterministic slight pseudo-random offset around Bengaluru center based on string hash
  let hash = 0;
  for (let i = 0; i < locationQuery.length; i++) {
    hash = (hash << 5) - hash + locationQuery.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((Math.abs(hash) % 40) - 20) * 0.0004;
  const offsetLng = (((Math.abs(hash >> 3)) % 40) - 20) * 0.0004;

  return {
    lat: Number((BENGALURU_CENTER.lat + offsetLat).toFixed(6)),
    lng: Number((BENGALURU_CENTER.lng + offsetLng).toFixed(6)),
  };
}

/**
 * Formats a currency number in INR with standard symbol.
 */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats distance with appropriate units (m or km).
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1);
    return `${km.endsWith('.0') ? km.slice(0, -2) : km} km`;
  }
  return `${meters} m`;
}
